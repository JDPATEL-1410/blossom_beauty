require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const importData = async () => {
    try {
        await connectDB();
        await Admin.deleteMany(); // Clear existing admins

        const admin = new Admin({
            username: 'admin',
            password: 'password123', // This will be automatically hashed by the pre-save hook in the model
        });

        await admin.save();

        console.log('Admin Data Imported!');
        console.log('Username: admin');
        console.log('Password: password123');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
