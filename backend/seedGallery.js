require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const GalleryImage = require('./models/GalleryImage');

const staticImgs = [
  { src: '/images/room-9.png', alt: 'Our Studio (Room 9)', cat: 'Studio', order: 1 },
  { src: '/images/entryway.png', alt: 'Salon Entry Way', cat: 'Studio', order: 2 },
  { src: 'https://images.pexels.com/photos/6135620/pexels-photo-6135620.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600', alt: 'Brow Shaping & Threading', cat: 'Threading', order: 3 },
  { src: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500', alt: 'Facial Treatment', cat: 'Facials', order: 4 },
  { src: 'https://images.pexels.com/photos/6135621/pexels-photo-6135621.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500', alt: 'Eyebrow Styling', cat: 'Threading', order: 5 },
  { src: 'https://images.pexels.com/photos/14615063/pexels-photo-14615063.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', alt: 'Hair Styling', cat: 'Hair', order: 6 },
  { src: 'https://images.pexels.com/photos/8554941/pexels-photo-8554941.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500', alt: 'Lash Extensions', cat: 'Lashes', order: 7 },
  { src: 'https://images.pexels.com/photos/20695691/pexels-photo-20695691.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500', alt: 'Bridal Beauty', cat: 'Bridal', order: 8 },
  { src: 'https://images.pexels.com/photos/5659018/pexels-photo-5659018.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500', alt: 'Spa Treatment', cat: 'Facials', order: 9 },
  { src: 'https://images.pexels.com/photos/8468125/pexels-photo-8468125.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500', alt: 'Hair Coloring', cat: 'Hair', order: 10 },
  { src: 'https://images.pexels.com/photos/7256109/pexels-photo-7256109.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700', alt: 'Beauty Products', cat: 'Products', order: 11 },
  { src: 'https://images.pexels.com/photos/5659016/pexels-photo-5659016.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500', alt: 'Head Massage', cat: 'Spa', order: 12 },
  { src: 'https://images.pexels.com/photos/7755207/pexels-photo-7755207.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500', alt: 'Style Session', cat: 'Hair', order: 13 },
  { src: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500', alt: 'Waxing Service', cat: 'Waxing', order: 14 },
];

const seedGallery = async () => {
  try {
    await connectDB();
    await GalleryImage.deleteMany(); 
    await GalleryImage.insertMany(staticImgs);
    console.log('Gallery Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

seedGallery();
