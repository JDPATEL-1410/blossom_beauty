const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const net = require('net');

const checkPortActive = (host, port) => {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(200); // Fail fast in 200ms
        
        socket.on('connect', () => {
            socket.destroy();
            resolve(true);
        });
        
        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });
        
        socket.on('error', () => {
            socket.destroy();
            resolve(false);
        });
        
        socket.connect(port, host);
    });
};

const connectDB = async () => {
    try {
        let host = '127.0.0.1';
        let port = 27017;
        
        const uri = process.env.MONGO_URI || '';
        const match = uri.match(/:\/\/([^:/]+)(?::(\d+))?/);
        if (match) {
            host = match[1];
            if (match[2]) {
                port = parseInt(match[2], 10);
            }
        }

        const isOnline = await checkPortActive(host, port);
        
        if (!isOnline) {
            throw new Error(`Port ${port} on ${host} is closed.`);
        }

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Failed: ${error.message}`);
        console.log('⚠️ Bypassing Mongoose Connection: Activating Local JSON Database Fallback! 🚀');
        setupLocalDBFallback();
    }
};

function setupLocalDBFallback() {
    mongoose.connection.readyState = 1;

    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const getFilePath = (modelName) => path.join(dataDir, `${modelName.toLowerCase()}s.json`);

    const readData = (modelName) => {
        const filePath = getFilePath(modelName);
        if (!fs.existsSync(filePath)) {
            return [];
        }
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch {
            return [];
        }
    };

    const writeData = (modelName, data) => {
        const filePath = getFilePath(modelName);
        const sanitized = data.map(item => {
            const copy = { ...item };
            if (typeof copy.save === 'function') delete copy.save;
            if (typeof copy.deleteOne === 'function') delete copy.deleteOne;
            delete copy.sort;
            delete copy.then;
            delete copy.exec;
            return copy;
        });
        fs.writeFileSync(filePath, JSON.stringify(sanitized, null, 2), 'utf8');
    };

    const applyOverrides = (ModelClass, name) => {
        const enrichDoc = (item) => {
            if (!item) return null;

            if (item.save && item.deleteOne && item._isEnriched) {
                return item;
            }

            const docObj = { ...item, _isEnriched: true };
            
            docObj.save = async function() {
                const data = readData(name);
                const rawObj = { ...this };
                delete rawObj.save;
                delete rawObj.deleteOne;
                delete rawObj._isEnriched;
                
                const methods = ModelClass.schema?.methods || {};
                for (let methodName in methods) {
                    delete rawObj[methodName];
                }

                if (name === 'Admin' && rawObj.password && !rawObj.password.startsWith('$2a$') && !rawObj.password.startsWith('$2b$')) {
                    const bcrypt = require('bcryptjs');
                    const salt = bcrypt.genSaltSync(10);
                    rawObj.password = bcrypt.hashSync(rawObj.password, salt);
                    this.password = rawObj.password;
                }

                const idx = data.findIndex(i => String(i._id) === String(rawObj._id));
                if (idx !== -1) {
                    data[idx] = { ...data[idx], ...rawObj };
                } else {
                    data.push(rawObj);
                }
                writeData(name, data);
                return this;
            };

            docObj.deleteOne = async function() {
                const data = readData(name);
                const filtered = data.filter(i => String(i._id) !== String(this._id));
                writeData(name, filtered);
                return { deletedCount: 1 };
            };

            const methods = ModelClass.schema?.methods || {};
            for (let methodName in methods) {
                docObj[methodName] = methods[methodName].bind(docObj);
            }

            return docObj;
        };

        ModelClass.find = function(query = {}) {
            const data = readData(name);
            let filtered = [...data];
            
            if (query && Object.keys(query).length > 0) {
                filtered = filtered.filter(item => {
                    for (let key in query) {
                        const val = query[key];
                        if (val && typeof val === 'object' && val.$regex) {
                            const reg = val.$regex;
                            const isCaseInsensitive = val.options && val.options.includes('i');
                            const regex = new RegExp(reg, isCaseInsensitive ? 'i' : '');
                            if (!regex.test(item[key])) return false;
                        } else if (item[key] !== val) {
                            return false;
                        }
                    }
                    return true;
                });
            }

            const enrichedFiltered = filtered.map(enrichDoc);

            const queryObj = {
                sort: function() { return this; },
                then: function(resolve) {
                    if (resolve) resolve(enrichedFiltered);
                    return Promise.resolve(enrichedFiltered);
                },
                exec: async function() { return enrichedFiltered; }
            };
            
            return queryObj;
        };

        ModelClass.findOne = function(query = {}) {
            const data = readData(name);
            const found = data.find(item => {
                for (let key in query) {
                    const val = query[key];
                    if (val && typeof val === 'object' && val.$regex) {
                        const reg = val.$regex;
                        const isCaseInsensitive = val.options && val.options.includes('i');
                        const regex = new RegExp(reg, isCaseInsensitive ? 'i' : '');
                        if (!regex.test(item[key])) return false;
                    } else if (item[key] !== val) {
                        return false;
                    }
                }
                return true;
            });

            return Promise.resolve(enrichDoc(found));
        };

        ModelClass.findById = function(id) {
            const data = readData(name);
            const found = data.find(i => String(i._id) === String(id));
            return Promise.resolve(enrichDoc(found));
        };

        ModelClass.findByIdAndUpdate = function(id, update, options = {}) {
            const data = readData(name);
            const idx = data.findIndex(i => String(i._id) === String(id));
            if (idx !== -1) {
                const fields = update.$set ? { ...update, ...update.$set } : update;
                delete fields.$set;
                
                data[idx] = { ...data[idx], ...fields };
                writeData(name, data);
                return Promise.resolve(enrichDoc(data[idx]));
            }
            return Promise.resolve(null);
        };

        ModelClass.create = async function(doc) {
            const data = readData(name);
            const newDoc = {
                _id: new mongoose.Types.ObjectId().toString(),
                ...doc,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            const enriched = enrichDoc(newDoc);
            await enriched.save();
            return enriched;
        };

        ModelClass.deleteMany = function() {
            writeData(name, []);
            return Promise.resolve({ deletedCount: 0 });
        };

        ModelClass.insertMany = async function(docs) {
            const createdDocs = [];
            for (const doc of docs) {
                const created = await ModelClass.create(doc);
                createdDocs.push(created);
            }
            return createdDocs;
        };

        ModelClass.updateMany = function(query, update) {
            return Promise.resolve({ modifiedCount: 1 });
        };

        Object.defineProperty(ModelClass.prototype, 'save', {
            value: async function() {
                const data = readData(name);
                const docObj = this.toObject ? this.toObject() : this;
                if (!docObj._id) {
                    docObj._id = new mongoose.Types.ObjectId().toString();
                }
                
                if (name === 'Admin' && docObj.password && !docObj.password.startsWith('$2a$') && !docObj.password.startsWith('$2b$')) {
                    const bcrypt = require('bcryptjs');
                    const salt = bcrypt.genSaltSync(10);
                    docObj.password = bcrypt.hashSync(docObj.password, salt);
                }

                const idx = data.findIndex(item => String(item._id) === String(docObj._id));
                if (idx !== -1) {
                    data[idx] = { ...data[idx], ...docObj };
                } else {
                    data.push(docObj);
                }
                writeData(name, data);
                return docObj;
            },
            writable: true,
            configurable: true
        });

        Object.defineProperty(ModelClass.prototype, 'deleteOne', {
            value: async function() {
                const data = readData(name);
                const filtered = data.filter(item => String(item._id) !== String(this._id));
                writeData(name, filtered);
                return { deletedCount: 1 };
            },
            writable: true,
            configurable: true
        });
    };

    const originalModel = mongoose.model;
    mongoose.model = function(name, schema) {
        let ModelClass;
        try {
            ModelClass = originalModel.apply(this, arguments);
        } catch (e) {
            ModelClass = originalModel.call(this, name);
        }
        applyOverrides(ModelClass, name);
        return ModelClass;
    };

    mongoose.modelNames().forEach(modelName => {
        const ModelClass = mongoose.model(modelName);
        applyOverrides(ModelClass, modelName);
    });
}

module.exports = connectDB;
