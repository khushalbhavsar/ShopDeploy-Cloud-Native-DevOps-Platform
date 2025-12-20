import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import connectDB from '../config/db.js';

dotenv.config();

const categories = [
    { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets' },
    { name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel' },
    { name: 'Books', slug: 'books', description: 'Books and literature' },
    { name: 'Home & Garden', slug: 'home-garden', description: 'Home and garden products' },
    { name: 'Sports', slug: 'sports', description: 'Sports equipment and gear' },
];

const products = [
    {
        title: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
        price: 79.99,
        stock: 50,
        brand: 'AudioTech',
        featured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', publicId: 'headphones-1' }],
    },
    {
        title: 'Smart Watch Pro',
        description: 'Advanced smartwatch with fitness tracking, heart rate monitor, and GPS.',
        price: 299.99,
        stock: 30,
        brand: 'TechGear',
        featured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', publicId: 'watch-1' }],
    },
    {
        title: 'Laptop Stand Aluminum',
        description: 'Ergonomic laptop stand made from premium aluminum with adjustable height.',
        price: 49.99,
        stock: 100,
        brand: 'DeskPro',
        featured: false,
        images: [{ url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', publicId: 'stand-1' }],
    },
    {
        title: 'Mechanical Keyboard RGB',
        description: 'Gaming mechanical keyboard with customizable RGB lighting and blue switches.',
        price: 129.99,
        stock: 45,
        brand: 'GameTech',
        featured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', publicId: 'keyboard-1' }],
    },
    {
        title: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking and long battery life.',
        price: 39.99,
        stock: 80,
        brand: 'ComfortTech',
        featured: false,
        images: [{ url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500', publicId: 'mouse-1' }],
    },
    {
        title: 'Men\'s Cotton T-Shirt',
        description: 'Premium quality cotton t-shirt available in multiple colors. Comfortable and breathable.',
        price: 24.99,
        stock: 200,
        brand: 'FashionWear',
        featured: false,
        images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', publicId: 'tshirt-1' }],
    },
    {
        title: 'Women\'s Denim Jacket',
        description: 'Stylish denim jacket with modern fit. Perfect for casual wear.',
        price: 89.99,
        stock: 60,
        brand: 'UrbanStyle',
        featured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', publicId: 'jacket-1' }],
    },
    {
        title: 'Running Shoes',
        description: 'Lightweight running shoes with excellent cushioning and support.',
        price: 119.99,
        stock: 75,
        brand: 'SportsPro',
        featured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', publicId: 'shoes-1' }],
    },
    {
        title: 'Yoga Mat Premium',
        description: 'Extra thick yoga mat with non-slip surface. Includes carrying strap.',
        price: 34.99,
        stock: 150,
        brand: 'FitLife',
        featured: false,
        images: [{ url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', publicId: 'yoga-1' }],
    },
    {
        title: 'Water Bottle Insulated',
        description: 'Stainless steel insulated water bottle keeps drinks cold for 24 hours.',
        price: 29.99,
        stock: 120,
        brand: 'HydroMax',
        featured: false,
        images: [{ url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', publicId: 'bottle-1' }],
    },
    {
        title: 'The Complete JavaScript Guide',
        description: 'Comprehensive guide to modern JavaScript programming. Perfect for beginners and experts.',
        price: 44.99,
        stock: 90,
        brand: 'TechBooks',
        featured: false,
        images: [{ url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500', publicId: 'book-1' }],
    },
    {
        title: 'Coffee Table Book - Architecture',
        description: 'Beautiful coffee table book featuring modern architecture from around the world.',
        price: 59.99,
        stock: 40,
        brand: 'ArtPublishing',
        featured: false,
        images: [{ url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', publicId: 'book-2' }],
    },
    {
        title: 'Cooking Masterclass Cookbook',
        description: 'Professional cookbook with 200+ recipes from world-renowned chefs.',
        price: 39.99,
        stock: 70,
        brand: 'CulinaryPress',
        featured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500', publicId: 'book-3' }],
    },
    {
        title: 'Indoor Plant Collection',
        description: 'Set of 3 easy-care indoor plants perfect for home or office.',
        price: 49.99,
        stock: 55,
        brand: 'GreenLife',
        featured: false,
        images: [{ url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500', publicId: 'plant-1' }],
    },
    {
        title: 'LED Desk Lamp',
        description: 'Modern LED desk lamp with adjustable brightness and color temperature.',
        price: 54.99,
        stock: 85,
        brand: 'BrightHome',
        featured: false,
        images: [{ url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', publicId: 'lamp-1' }],
    },
    {
        title: 'Ceramic Coffee Mug Set',
        description: 'Set of 4 handcrafted ceramic coffee mugs with unique designs.',
        price: 34.99,
        stock: 95,
        brand: 'HomeStyle',
        featured: false,
        images: [{ url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500', publicId: 'mug-1' }],
    },
    {
        title: 'Wall Art Canvas Print',
        description: 'Modern abstract canvas print. Ready to hang, multiple sizes available.',
        price: 79.99,
        stock: 50,
        brand: 'ArtDecor',
        featured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1582561833949-2378bc0f5d0e?w=500', publicId: 'art-1' }],
    },
    {
        title: 'Backpack Travel Pro',
        description: 'Durable travel backpack with laptop compartment and USB charging port.',
        price: 69.99,
        stock: 65,
        brand: 'TravelGear',
        featured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', publicId: 'backpack-1' }],
    },
    {
        title: 'Sunglasses Polarized',
        description: 'UV protection polarized sunglasses with stylish design.',
        price: 44.99,
        stock: 110,
        brand: 'SunShield',
        featured: false,
        images: [{ url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500', publicId: 'sunglasses-1' }],
    },
    {
        title: 'Portable Bluetooth Speaker',
        description: 'Waterproof Bluetooth speaker with 360° sound and 12-hour battery.',
        price: 59.99,
        stock: 88,
        brand: 'SoundWave',
        featured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', publicId: 'speaker-1' }],
    },
];

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Product.deleteMany({});
        await Category.deleteMany({});

        console.log('🗑️  Cleared existing data');

        // Create categories
        const createdCategories = await Category.insertMany(categories);
        console.log(`✅ Created ${createdCategories.length} categories`);

        // Assign random categories to products
        const productsWithCategories = products.map((product, index) => ({
            ...product,
            categoryId: createdCategories[index % createdCategories.length]._id,
        }));

        // Create products
        const createdProducts = await Product.insertMany(productsWithCategories);
        console.log(`✅ Created ${createdProducts.length} products`);

        console.log('🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
