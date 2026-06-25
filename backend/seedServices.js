require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const ServiceCategory = require('./models/ServiceCategory');

const categories = [
  {
    name: 'Threading', icon: 'FaMagic', color: 'from-rose/80 to-accent',
    image: 'https://images.pexels.com/photos/6135620/pexels-photo-6135620.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
    desc: 'Precise & gentle hair removal for perfectly shaped brows.',
    services: [
      { name: 'Eyebrows', price: '$7', popular: true, revisit: '3–4 wks' },
      { name: 'Upper Lip', price: '$4', revisit: '3–4 wks' },
      { name: 'Lower Lip', price: '$4', revisit: '4–6 wks' },
      { name: 'Forehead', price: '$5', revisit: '6–8 wks' },
      { name: 'Chin', price: '$5', revisit: '4–6 wks' },
      { name: 'Neck', price: '$5', revisit: '4–6 wks' },
      { name: 'Sideburns', price: '$8', revisit: '5–6 wks' },
      { name: 'Full Face', price: '$30', popular: true, revisit: '3–4 wks' },
    ],
    order: 1
  },
  {
    name: 'Waxing', icon: 'FaHandSparkles', color: 'from-accent to-lavender',
    image: 'https://images.pexels.com/photos/5659018/pexels-photo-5659018.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
    desc: 'Smooth, long-lasting results with premium products.',
    services: [
      { name: 'Underarms', price: '$10', revisit: '3–4 wks' },
      { name: 'Half Arms', price: '$20', revisit: '4–6 wks' },
      { name: 'Full Arms', price: '$35', revisit: '4–6 wks' },
      { name: 'Half Legs', price: '$25', revisit: '4–5 wks' },
      { name: 'Full Legs', price: '$45', popular: true, revisit: '4–5 wks' },
      { name: 'Back', price: '$35', revisit: '4–6 wks' },
      { name: 'Stomach', price: '$25', revisit: '4–6 wks' },
      { name: 'Brazilian', price: '$30', popular: true, revisit: '4–5 wks' },
    ],
    order: 2
  },
  {
    name: 'Facials', icon: 'FaSpa', color: 'from-lavender to-blush',
    image: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
    desc: 'Rejuvenating treatments for a radiant, youthful glow.',
    services: [
      { name: 'Signature Facial', price: '$50', popular: true, revisit: '4 wks' },
      { name: 'Fruit Facial', price: '$55', revisit: '4–6 wks' },
      { name: 'D-Tan Facial', price: '$65', revisit: '4–6 wks' },
      { name: 'Microdermabrasion', price: '$85', revisit: '4–6 wks' },
      { name: 'Acne Facial', price: '$110', revisit: '2–3 wks' },
      { name: 'Peeling Facial', price: '$110', revisit: '4–6 wks' },
    ],
    order: 3
  },
  {
    name: 'Hair', icon: 'FaCut', color: 'from-rose-gold to-rose/80',
    image: 'https://images.pexels.com/photos/8468125/pexels-photo-8468125.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
    desc: 'Specialist cuts, color & styling for your unique look.',
    services: [
      { name: 'Hair Cut', price: '$25+', popular: true, revisit: '6–8 wks' },
      { name: 'Hair Styling', price: '$35+', revisit: 'As needed' },
      { name: 'Hair Color', price: '$60+', popular: true, revisit: '6–8 wks' },
      { name: 'Root Touch Up', price: '$45+', revisit: '4–6 wks' },
      { name: 'Hair Treatment', price: '$50+', revisit: '4–6 wks' },
      { name: 'Hair Spa', price: '$55+', revisit: '4 wks' },
    ],
    order: 4
  },
  {
    name: 'Bridal', icon: 'FaGem', color: 'from-gold to-accent',
    image: 'https://images.pexels.com/photos/20695691/pexels-photo-20695691.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
    desc: 'Make your special day unforgettable.',
    services: [
      { name: 'Bridal Makeup', price: '$150+', popular: true, revisit: 'Per event' },
      { name: 'Party Makeup', price: '$80+', revisit: 'Per event' },
      { name: 'Hair Styling', price: '$60+', revisit: 'Per event' },
      { name: 'Saree Draping', price: '$40+', revisit: 'Per event' },
      { name: 'Hair, Makeup & Saree', price: '$150+', popular: true, revisit: 'Per event' },
    ],
    order: 5
  },
  {
    name: 'Lashes', icon: 'FaEye', color: 'from-blush to-rose/70',
    image: 'https://images.pexels.com/photos/8554941/pexels-photo-8554941.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
    desc: 'Enhance your natural beauty with perfection.',
    services: [
      { name: 'Eyebrow Tint', price: '$15', revisit: '4–6 wks' },
      { name: 'Brow Tint + Threading', price: '$20', popular: true, revisit: '3–4 wks' },
      { name: 'Lash Tint', price: '$25', revisit: '4–6 wks' },
      { name: 'Lash Enhancement', price: '$45+', revisit: '2–3 wks' },
    ],
    order: 6
  }
];

const seedServices = async () => {
  try {
    await connectDB();
    await ServiceCategory.deleteMany(); // Clear existing
    await ServiceCategory.insertMany(categories);
    console.log('Services and Pricing Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

seedServices();
