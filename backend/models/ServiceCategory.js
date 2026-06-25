const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  popular: { type: Boolean, default: false },
  revisit: { type: String, default: '' }
});

const serviceCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, required: true }, // e.g. "FaMagic", "FaCut"
  color: { type: String, required: true },
  image: { type: String, required: true },
  desc: { type: String, required: true },
  services: [serviceSchema],
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServiceCategory', serviceCategorySchema);
