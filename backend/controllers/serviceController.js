const ServiceCategory = require('../models/ServiceCategory');

// @desc    Get all service categories
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const categories = await ServiceCategory.find({}).sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving services', error: error.message });
  }
};

// @desc    Update a service category (including nested services and prices)
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateServiceCategory = async (req, res) => {
  try {
    const { name, icon, color, image, desc, services, order } = req.body;
    console.log(`[ServiceUpdate] Updating category ID: ${req.params.id}`);
    
    const category = await ServiceCategory.findById(req.params.id);

    if (category) {
      category.name = name || category.name;
      category.icon = icon || category.icon;
      category.color = color || category.color;
      category.image = image || category.image;
      category.desc = desc !== undefined ? desc : category.desc;
      category.services = services || category.services;
      category.order = order !== undefined ? order : category.order;

      const updatedCategory = await category.save();
      console.log(`[ServiceUpdate] Success: Updated "${updatedCategory.name}"`);
      res.json(updatedCategory);
    } else {
      console.log(`[ServiceUpdate] Not found: ID ${req.params.id}`);
      res.status(404).json({ message: 'Service category not found' });
    }
  } catch (error) {
    console.error('[ServiceUpdate] Error:', error);
    res.status(500).json({ message: 'Server error updating service category', error: error.message });
  }
};

module.exports = {
  getServices,
  updateServiceCategory
};
