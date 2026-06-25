require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Offer = require('./models/Offer');

const offers = [
  {
    title: 'Eyebrow Threading',
    orig: '$10', price: '$7', save: '30%',
    badge: 'Most Popular',
    icon: 'FaStar',
    image: 'https://images.pexels.com/photos/6135620/pexels-photo-6135620.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400',
    order: 1
  },
  {
    title: 'Full Face Threading',
    orig: '$35', price: '$25', save: '$10',
    badge: 'Save Big',
    icon: 'FaTag',
    image: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400',
    order: 2
  },
  {
    title: 'Any Facial',
    orig: '$55', price: '$40', save: '27%',
    badge: 'Best Value',
    icon: 'FaGift',
    image: 'https://images.pexels.com/photos/5659016/pexels-photo-5659016.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400',
    order: 3
  },
  {
    title: 'Haircut + Style',
    orig: '$45', price: '$25', save: '44%',
    badge: 'Limited Offer',
    icon: 'FaBolt',
    image: 'https://images.pexels.com/photos/8468125/pexels-photo-8468125.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400',
    order: 4
  },
];

const seedOffers = async () => {
  try {
    await connectDB();
    await Offer.deleteMany(); // Clear existing
    await Offer.insertMany(offers);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

seedOffers();
