const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedTutorials() {
  try {
    console.log('🌱 Seeding tutorials...');

    // Check if tutorials already exist
    const existingTutorials = await prisma.tutorial.findMany();
    
    if (existingTutorials.length > 0) {
      console.log(`Found ${existingTutorials.length} existing tutorials. Updating to published...`);
      
      // Update existing tutorials to published
      await prisma.tutorial.updateMany({
        where: {},
        data: { published: true }
      });
      
      console.log('✅ Existing tutorials updated to published!');
      return;
    }

    // Create some sample tutorials
    const tutorials = [
      {
        slug: 'javascript-basics',
        published: true
      },
      {
        slug: 'python-introduction',
        published: true
      },
      {
        slug: 'html-css-fundamentals',
        published: true
      },
      {
        slug: 'react-basics',
        published: true
      },
      {
        slug: 'nodejs-backend',
        published: true
      },
      {
        slug: 'algorithms-intro',
        published: true
      },
      {
        slug: 'data-structures',
        published: true
      },
      {
        slug: 'sql-database',
        published: true
      },
      {
        slug: 'git-version-control',
        published: true
      },
      {
        slug: 'docker-containers',
        published: true
      }
    ];

    for (const tutorial of tutorials) {
      await prisma.tutorial.create({
        data: tutorial
      });
    }

    console.log(`✅ Created ${tutorials.length} published tutorials!`);
  } catch (error) {
    console.error('❌ Error seeding tutorials:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTutorials(); 