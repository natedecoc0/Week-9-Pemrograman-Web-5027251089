require('dotenv/config');
const { PrismaClient } = require('./generated/prisma');
const { PrismaNeon } = require('@prisma/adapter-neon');

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
module.exports = new PrismaClient({ adapter });