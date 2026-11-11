const prisma = require('../db');

const data = [
  { title: 'Can This Love be Translated', genre: 'K-Drama', totalEpisodes: 12, watched: 12, status: 'completed', rating: 5, review: '*chefs kiss' },
  { title: 'The Office', genre: 'Sitcom', totalEpisodes: 201, watched: 201, status: 'completed', rating: 5, review: 'no words' },
  { title: 'Modern Family', genre: 'Sitcom', totalEpisodes: 250, watched: 198, status: 'watching' },
  { title: 'Brooklyn Nine-Nine', genre: 'Sitcom', totalEpisodes: 153, watched: 42, status: 'watching' },
  { title: 'Alice in Borderland', genre: 'Thriller', totalEpisodes: 22, watched: 0, status: 'plan' },
  { title: 'Reply 1988', genre: 'K-Drama', totalEpisodes: 20, watched: 0, status: 'plan' },
  { title: 'Stranger Things', genre: 'Sci-Fi', totalEpisodes: 42, watched: 32, status: 'hold' },
];

(async () => {
  await prisma.series.deleteMany();
  await prisma.series.createMany({ data });
  console.log('Seed selesai');
  await prisma.$disconnect();
})();