require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const HeroSlide = require('./models/HeroSlide');

const demoSlides = [
  { 
      desktopImageUrl: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920', 
      mobileImageUrl: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1920&w=1080', 
      order: 1 
  },
  { 
      desktopImageUrl: 'https://images.pexels.com/photos/8554941/pexels-photo-8554941.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920', 
      mobileImageUrl: 'https://images.pexels.com/photos/8554941/pexels-photo-8554941.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1920&w=1080', 
      order: 2 
  },
  { 
      desktopImageUrl: 'https://images.pexels.com/photos/14615063/pexels-photo-14615063.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920', 
      mobileImageUrl: 'https://images.pexels.com/photos/14615063/pexels-photo-14615063.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1920&w=1080', 
      order: 3 
  },
  { 
      desktopImageUrl: 'https://images.pexels.com/photos/5659018/pexels-photo-5659018.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920', 
      mobileImageUrl: 'https://images.pexels.com/photos/5659018/pexels-photo-5659018.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1920&w=1080', 
      order: 4 
  }
];

const seedHeroSlides = async () => {
  try {
    await connectDB();
    await HeroSlide.deleteMany(); 
    await HeroSlide.insertMany(demoSlides);
    console.log('Demo Hero Slides Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

seedHeroSlides();
