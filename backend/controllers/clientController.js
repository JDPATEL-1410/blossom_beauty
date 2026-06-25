const Client = require('../models/Client');
const Appointment = require('../models/Appointment');

// Helper to extract the last 10 digits of a phone number for robust matching
const getPhoneMatchKey = (phone) => {
    if (phone === undefined || phone === null) return '';
    const phoneStr = String(phone);
    const clean = phoneStr.replace(/\D/g, '');
    return clean.length >= 10 ? clean.slice(-10) : clean;
};

// Helper to sync clients with appointments
const syncClientsFromAppointments = async () => {
    try {
        const clients = await Client.find({}, 'phone');
        const clientMatchKeys = new Set(clients.map(c => getPhoneMatchKey(c.phone)));

        const appointments = await Appointment.find({});
        const newClientsToCreate = [];

        for (const appt of appointments) {
            if (!appt.phone) continue;
            
            const apptKey = getPhoneMatchKey(appt.phone);
            if (!apptKey) continue;

            if (!clientMatchKeys.has(apptKey)) {
                newClientsToCreate.push({
                    name: appt.name || 'Unknown Client',
                    phone: String(appt.phone).trim(),
                    email: appt.email || '',
                    isWalkIn: false,
                    lastVisitDate: null,
                    revisitWeeks: 4,
                    notes: appt.notes || '',
                });
                clientMatchKeys.add(apptKey); // Avoid duplicate entries in the same batch
            }
        }

        if (newClientsToCreate.length > 0) {
            await Client.insertMany(newClientsToCreate);
        }
    } catch (error) {
        console.error('Error syncing clients from appointments:', error);
    }
};

// @desc    Get all clients with their statistics
// @route   GET /api/clients
// @access  Private/Admin
const getClients = async (req, res) => {
    try {
        // Sync any appointments first so the directory is fully up-to-date
        await syncClientsFromAppointments();

        const clients = await Client.find({}).sort({ name: 1 });
        const allAppointments = await Appointment.find({}).sort({ date: -1, time: -1 });
        const enrichedClients = [];

        for (const client of clients) {
            // Find all appointments matching client's phone (using robust 10-digit match key)
            const clientKey = getPhoneMatchKey(client.phone);
            const clientAppointments = allAppointments.filter(
                appt => getPhoneMatchKey(appt.phone) === clientKey
            );
            
            // Calculate visits
            const totalVisits = clientAppointments.length;
            const completedVisits = clientAppointments.filter(a => a.status === 'completed').length;
            
            // Get last service consumed
            let lastService = 'None';
            let lastServiceDate = '';
            
            const lastActiveAppt = clientAppointments.find(a => ['completed', 'confirmed'].includes(a.status)) || clientAppointments[0];
            if (lastActiveAppt) {
                lastService = lastActiveAppt.service;
                lastServiceDate = lastActiveAppt.date;
            }

            // Support legacy database schemas with fallbacks
            const lastVisitDate = client.lastVisitDate || client.lastPeriodDate;
            const revisitWeeks = client.revisitWeeks || (client.periodCycleDays ? Math.round(client.periodCycleDays / 7) : 4);

            enrichedClients.push({
                _id: client._id,
                name: client.name,
                phone: client.phone,
                email: client.email,
                lastVisitDate,
                revisitWeeks,
                notes: client.notes,
                isWalkIn: client.isWalkIn,
                totalVisits,
                completedVisits,
                lastService,
                lastServiceDate,
                createdAt: client.createdAt,
                appointments: clientAppointments.slice(0, 10), // Return last 10 appointments
            });
        }

        res.json(enrichedClients);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching clients' });
    }
};

// @desc    Create new client (Walk-in)
// @route   POST /api/clients
// @access  Private/Admin
const createClient = async (req, res) => {
    try {
        const { name, phone, email, lastVisitDate, revisitWeeks, notes } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ message: 'Please provide at least a name and phone number' });
        }

        const phoneStr = String(phone).trim();

        // Check if client already exists
        const clientExists = await Client.findOne({ phone: phoneStr });
        if (clientExists) {
            return res.status(400).json({ message: 'Client with this phone number already exists' });
        }

        const client = await Client.create({
            name,
            phone: phoneStr,
            email: email || '',
            lastVisitDate: lastVisitDate || null,
            revisitWeeks: revisitWeeks || 4,
            notes: notes || '',
            isWalkIn: true,
        });

        res.status(201).json(client);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating client' });
    }
};

// @desc    Update client details
// @route   PUT /api/clients/:id
// @access  Private/Admin
const updateClient = async (req, res) => {
    try {
        const { name, phone, email, lastVisitDate, revisitWeeks, notes, isWalkIn } = req.body;

        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // If phone is being changed, check if new phone is already taken by another client
        if (phone && String(phone).trim() !== client.phone) {
            const phoneStr = String(phone).trim();
            const phoneExists = await Client.findOne({ phone: phoneStr });
            if (phoneExists) {
                return res.status(400).json({ message: 'Another client is already registered with this phone number' });
            }
            
            // Update appointments phone as well to maintain association
            await Appointment.updateMany({ phone: client.phone }, { phone: phoneStr });
            client.phone = phoneStr;
        }

        client.name = name || client.name;
        client.email = email !== undefined ? email : client.email;
        client.lastVisitDate = lastVisitDate !== undefined ? lastVisitDate : client.lastVisitDate;
        client.revisitWeeks = revisitWeeks !== undefined ? revisitWeeks : client.revisitWeeks;
        client.notes = notes !== undefined ? notes : client.notes;
        if (isWalkIn !== undefined) {
            client.isWalkIn = isWalkIn;
        }

        const updatedClient = await client.save();
        res.json(updatedClient);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating client' });
    }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private/Admin
const deleteClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (client) {
            await client.deleteOne();
            res.json({ message: 'Client profile removed successfully' });
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting client' });
    }
};

module.exports = {
    getClients,
    createClient,
    updateClient,
    deleteClient,
};
