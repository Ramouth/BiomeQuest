import Plant from '../models/Plant.js';

export const seedPlants = async () => {
  try {
    const count = await Plant.countDocuments();

    if (count === 0) {
      const plants = [
        {
          name: 'banana',
          commonName: 'Banana',
          category: 'fruit',
          pointsForNewConsumption: 5,
          pointsForRepeatConsumption: 1,
          healthBenefits: ['Rich in potassium', 'Good for digestion', 'High in fiber'],
          icon: '🍌',
          isActive: true
        },
        {
          name: 'apple',
          commonName: 'Apple',
          category: 'fruit',
          pointsForNewConsumption: 5,
          pointsForRepeatConsumption: 1,
          healthBenefits: ['High in fiber', 'Antioxidants', 'Supports heart health'],
          icon: '🍎',
          isActive: true
        },
        {
          name: 'mango',
          commonName: 'Mango',
          category: 'fruit',
          pointsForNewConsumption: 5,
          pointsForRepeatConsumption: 1,
          healthBenefits: ['Rich in vitamin C', 'Antioxidants', 'Good for skin'],
          icon: '🥭',
          isActive: true
        },
        {
          name: 'spinach',
          commonName: 'Spinach',
          category: 'vegetable',
          pointsForNewConsumption: 5,
          pointsForRepeatConsumption: 1,
          healthBenefits: ['Iron rich', 'High in antioxidants', 'Good for bones'],
          icon: '🥬',
          isActive: true
        },
        {
          name: 'broccoli',
          commonName: 'Broccoli',
          category: 'vegetable',
          pointsForNewConsumption: 5,
          pointsForRepeatConsumption: 1,
          healthBenefits: ['Rich in vitamin C', 'Cancer fighting compounds', 'Supports digestion'],
          icon: '🥦',
          isActive: true
        },
        {
          name: 'carrot',
          commonName: 'Carrot',
          category: 'vegetable',
          pointsForNewConsumption: 5,
          pointsForRepeatConsumption: 1,
          healthBenefits: ['Beta carotene', 'Good for eyes', 'Low calorie'],
          icon: '🥕',
          isActive: true
        },
        {
          name: 'blueberry',
          commonName: 'Blueberry',
          category: 'fruit',
          pointsForNewConsumption: 5,
          pointsForRepeatConsumption: 1,
          healthBenefits: ['Antioxidants', 'Brain health', 'Anti-inflammatory'],
          icon: '🫐',
          isActive: true
        },
        {
          name: 'lentils',
          commonName: 'Lentils',
          category: 'legume',
          pointsForNewConsumption: 5,
          pointsForRepeatConsumption: 1,
          healthBenefits: ['High in protein', 'Rich in fiber', 'Good for digestion'],
          icon: '🫘',
          isActive: true
        }
      ];

      await Plant.insertMany(plants);
      console.log('Seed data inserted successfully');
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};
