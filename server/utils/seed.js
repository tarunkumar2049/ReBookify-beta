require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Book = require('../models/Book');

const CATS = [
  ['Academic', 'Textbooks & study material', '🎓'],
  ['Engineering', 'Engineering books', '⚙️'],
  ['Computer Science', 'Programming, CS & IT', '💻'],
  ['Mathematics', 'Maths books', '📐'],
  ['Science', 'Physics, Chemistry, Biology', '🔬'],
  ['Competitive Exams', 'JEE, NEET, UPSC, GATE…', '🏆'],
  ['Novels', 'Fiction & literature', '📖'],
  ['Manga', 'Manga & anime books', '⛩️'],
  ['Comics', 'Comics & graphic novels', '💥'],
  ['Reference Books', 'Dictionaries, guides', '📚'],
  ['Other', 'Everything else', '📦'],
];

const BOOKS = [
  ['Clean Code', 'Robert C. Martin', 'Computer Science', 450, 'Good', 'Classic guide to writing readable, maintainable code.'],
  ['Let Us C', 'Yashavant Kanetkar', 'Computer Science', 150, 'Acceptable', 'Popular C programming book for beginners.'],
  ['Engineering Mathematics Vol 1', 'B.S. Grewal', 'Mathematics', 300, 'Like New', 'Higher engineering mathematics with solved examples.'],
  ['Data Structures in C', 'Reema Thareja', 'Computer Science', 280, 'Good', 'Covers arrays, stacks, queues, trees and graphs.'],
  ['Harry Potter and the Goblet of Fire', 'J.K. Rowling', 'Novels', 350, 'Like New', 'Fourth book in the Harry Potter series.'],
  ['One Piece Vol. 1', 'Eiichiro Oda', 'Manga', 499, 'New', 'Romance Dawn — start of the One Piece adventure.'],
  ['NCERT Physics Class 12', 'NCERT', 'Science', 120, 'Good', 'NCERT physics textbook, both parts.'],
  ['Quantitative Aptitude', 'R.S. Aggarwal', 'Competitive Exams', 250, 'Good', 'Must-have for aptitude & placement prep.'],
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rebookify');
  console.log('Seeding…');
  await Category.deleteMany({});
  const cats = await Category.insertMany(CATS.map(([category_name, description, icon]) => ({ category_name, description, icon })));
  const byName = Object.fromEntries(cats.map((c) => [c.category_name, c]));
  let admin = await User.findOne({ email: 'admin@rebookify.com' });
  if (!admin) admin = await User.create({ name: 'Admin', email: 'admin@rebookify.com', phone: '9999999999', password: 'admin123', role: 'admin' });
  let demo = await User.findOne({ email: 'demo@student.com' });
  if (!demo) demo = await User.create({ name: 'Demo Student', email: 'demo@student.com', phone: '8888888888', password: 'demo1234', role: 'user' });
  await Book.deleteMany({});
  await Book.insertMany(BOOKS.map(([title, author, cat, price, condition, description], i) => ({
    title, author, category_id: byName[cat]._id, category: cat, price, condition, description,
    image_url: `https://picsum.photos/seed/rebook${i}/400/600`,
    user_id: demo._id, status: 'Available', listing_type: 'Both'
  })));
  console.log('Seed done. admin@rebookify.com / admin123, demo@student.com / demo1234');
  process.exit(0);
}
run().catch((e) => { console.error(e); process.exit(1); });
