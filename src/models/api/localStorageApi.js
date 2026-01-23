/**
 * LocalStorage-based API
 * Frontend-only version - no backend required
 */

// ============================================
// STATIC PLANT DATA
// ============================================
const PLANTS_DATA = [
  // Fruits
  { id: 1, name: 'Banana', emoji: '🍌', points: 5, repeat_points: 1, first_time_message: 'Congrats! You just helped your biome with a new plant!', repeat_message: 'Plants are good, but diversity is KING!', is_superfood: false },
  { id: 2, name: 'Apple', emoji: '🍎', points: 5, repeat_points: 1, first_time_message: 'Congrats! You just helped your biome with a new plant!', repeat_message: 'Plants are good, but diversity is KING!', is_superfood: false },
  { id: 3, name: 'Mango', emoji: '🥭', points: 5, repeat_points: 1, first_time_message: 'Congrats! You just helped your biome with a new plant!', repeat_message: 'Plants are good, but diversity is KING!', is_superfood: false },
  { id: 4, name: 'Orange', emoji: '🍊', points: 5, repeat_points: 1, first_time_message: 'Congrats! You just helped your biome with a new plant!', repeat_message: 'Plants are good, but diversity is KING!', is_superfood: false },
  { id: 5, name: 'Strawberry', emoji: '🍓', points: 5, repeat_points: 1, first_time_message: 'Congrats! You just helped your biome with a new plant!', repeat_message: 'Plants are good, but diversity is KING!', is_superfood: false },
  { id: 6, name: 'Blueberry', emoji: '🫐', points: 5, repeat_points: 1, first_time_message: 'Congrats! You just helped your biome with a new plant!', repeat_message: 'Plants are good, but diversity is KING!', is_superfood: false },
  { id: 7, name: 'Watermelon', emoji: '🍉', points: 5, repeat_points: 1, first_time_message: 'Congrats! You just helped your biome with a new plant!', repeat_message: 'Plants are good, but diversity is KING!', is_superfood: false },
  { id: 8, name: 'Grape', emoji: '🍇', points: 5, repeat_points: 1, first_time_message: 'Congrats! You just helped your biome with a new plant!', repeat_message: 'Plants are good, but diversity is KING!', is_superfood: false },
  { id: 9, name: 'Pineapple', emoji: '🍍', points: 5, repeat_points: 1, first_time_message: 'Congrats! You just helped your biome with a new plant!', repeat_message: 'Plants are good, but diversity is KING!', is_superfood: false },
  { id: 10, name: 'Papaya', emoji: '🟠', points: 5, repeat_points: 1, first_time_message: 'Congrats! You just helped your biome with a new plant!', repeat_message: 'Plants are good, but diversity is KING!', is_superfood: false },
  // Vegetables
  { id: 11, name: 'Broccoli', emoji: '🥦', points: 5, repeat_points: 1, first_time_message: 'Green power! Your gut bacteria love this!', repeat_message: 'Keep up the veggie variety!', is_superfood: false },
  { id: 12, name: 'Carrot', emoji: '🥕', points: 5, repeat_points: 1, first_time_message: 'Great choice! Carrots are fantastic for your microbiome!', repeat_message: 'Crunchy and healthy!', is_superfood: false },
  { id: 13, name: 'Spinach', emoji: '🥬', points: 5, repeat_points: 1, first_time_message: 'Leafy greens are gut superheroes!', repeat_message: 'Popeye approves!', is_superfood: false },
  { id: 14, name: 'Tomato', emoji: '🍅', points: 5, repeat_points: 1, first_time_message: 'Technically a fruit, always delicious!', repeat_message: 'Tomato power!', is_superfood: false },
  { id: 15, name: 'Cucumber', emoji: '🥒', points: 5, repeat_points: 1, first_time_message: 'Cool as a cucumber, great for your gut!', repeat_message: 'Stay hydrated!', is_superfood: false },
  { id: 16, name: 'Corn', emoji: '🌽', points: 5, repeat_points: 1, first_time_message: 'Fiber-rich and delicious!', repeat_message: 'Corn is always a good choice!', is_superfood: false },
  { id: 17, name: 'Pepper', emoji: '🫑', points: 5, repeat_points: 1, first_time_message: 'Colorful and nutritious!', repeat_message: 'Peppers pack a punch!', is_superfood: false },
  { id: 18, name: 'Eggplant', emoji: '🍆', points: 5, repeat_points: 1, first_time_message: 'Purple power for your gut!', repeat_message: 'Eggplant excellence!', is_superfood: false },
  { id: 19, name: 'Mushroom', emoji: '🍄', points: 5, repeat_points: 1, first_time_message: 'Fungi are friends to your microbiome!', repeat_message: 'Mushroom magic!', is_superfood: false },
  { id: 20, name: 'Onion', emoji: '🧅', points: 5, repeat_points: 1, first_time_message: 'Prebiotic powerhouse!', repeat_message: 'Layers of goodness!', is_superfood: false },
  { id: 21, name: 'Garlic', emoji: '🧄', points: 5, repeat_points: 1, first_time_message: 'Incredible for gut health!', repeat_message: 'Garlic greatness!', is_superfood: false },
  { id: 22, name: 'Potato', emoji: '🥔', points: 5, repeat_points: 1, first_time_message: 'Resistant starch for happy gut bacteria!', repeat_message: 'Spud success!', is_superfood: false },
  { id: 23, name: 'Sweet Potato', emoji: '🍠', points: 5, repeat_points: 1, first_time_message: 'Sweet and fiber-rich!', repeat_message: 'Sweet choice!', is_superfood: false },
  { id: 24, name: 'Lettuce', emoji: '🥗', points: 5, repeat_points: 1, first_time_message: 'Fresh greens for a fresh gut!', repeat_message: 'Salad superstar!', is_superfood: false },
  // Legumes
  { id: 25, name: 'Peanut', emoji: '🥜', points: 5, repeat_points: 1, first_time_message: 'Legume power! Great for diversity!', repeat_message: 'Nutty and nice!', is_superfood: false },
  { id: 26, name: 'Beans', emoji: '🫘', points: 5, repeat_points: 1, first_time_message: 'Beans are gut bacteria favorites!', repeat_message: 'Bean there, love that!', is_superfood: false },
  // Grains
  { id: 27, name: 'Rice', emoji: '🍚', points: 5, repeat_points: 1, first_time_message: 'A staple for billions, great for you!', repeat_message: 'Rice is nice!', is_superfood: false },
  // More fruits
  { id: 28, name: 'Cherry', emoji: '🍒', points: 5, repeat_points: 1, first_time_message: 'Sweet antioxidant boost!', repeat_message: 'Cherry on top!', is_superfood: false },
  { id: 29, name: 'Peach', emoji: '🍑', points: 5, repeat_points: 1, first_time_message: 'Peachy keen for your gut!', repeat_message: 'Feeling peachy!', is_superfood: false },
  { id: 30, name: 'Pear', emoji: '🍐', points: 5, repeat_points: 1, first_time_message: 'Fiber-filled fruit!', repeat_message: 'A pear-fect choice!', is_superfood: false },
  { id: 31, name: 'Lemon', emoji: '🍋', points: 5, repeat_points: 1, first_time_message: 'Citrus boost for your system!', repeat_message: 'When life gives you lemons...', is_superfood: false },
  { id: 32, name: 'Coconut', emoji: '🥥', points: 5, repeat_points: 1, first_time_message: 'Tropical gut support!', repeat_message: 'Coco-nutty!', is_superfood: false },
  { id: 33, name: 'Kiwi', emoji: '🥝', points: 5, repeat_points: 1, first_time_message: 'Fuzzy fruit, fantastic fiber!', repeat_message: 'Kiwi power!', is_superfood: false },
  { id: 34, name: 'Avocado', emoji: '🥑', points: 5, repeat_points: 1, first_time_message: 'Healthy fats for a happy gut!', repeat_message: 'Avo-mazing!', is_superfood: false },
  { id: 35, name: 'Melon', emoji: '🍈', points: 5, repeat_points: 1, first_time_message: 'Refreshing and nutritious!', repeat_message: 'Melon-choly no more!', is_superfood: false },
  // Superfoods
  { id: 36, name: 'Kimchi', emoji: '🥬', points: 10, repeat_points: 2, first_time_message: 'SUPERFOOD! Korean fermented magic for your gut!', repeat_message: 'Kimchi power! Your microbiome thanks you!', is_superfood: true },
  { id: 37, name: 'Sauerkraut', emoji: '🥗', points: 10, repeat_points: 2, first_time_message: 'SUPERFOOD! German probiotic powerhouse!', repeat_message: 'Sauerkraut strikes again! Gut health boost!', is_superfood: true },
  { id: 38, name: 'Kefir', emoji: '🥛', points: 10, repeat_points: 2, first_time_message: 'SUPERFOOD! Probiotic-rich fermented milk!', repeat_message: 'Kefir keeps your gut happy!', is_superfood: true },
  { id: 39, name: 'Kombucha', emoji: '🍵', points: 10, repeat_points: 2, first_time_message: 'SUPERFOOD! Fizzy fermented tea goodness!', repeat_message: 'Kombucha culture for the win!', is_superfood: true },
  { id: 40, name: 'Miso', emoji: '🍜', points: 10, repeat_points: 2, first_time_message: 'SUPERFOOD! Ancient Japanese gut healer!', repeat_message: 'Miso good for your microbiome!', is_superfood: true },
  { id: 41, name: 'Tempeh', emoji: '🫘', points: 10, repeat_points: 2, first_time_message: 'SUPERFOOD! Fermented soy protein power!', repeat_message: 'Tempeh time! Gut bacteria rejoice!', is_superfood: true },
  { id: 42, name: 'Yogurt', emoji: '🥄', points: 10, repeat_points: 2, first_time_message: 'SUPERFOOD! Creamy probiotic classic!', repeat_message: 'Yogurt delivers billions of good bacteria!', is_superfood: true },
  { id: 43, name: 'Natto', emoji: '🫛', points: 10, repeat_points: 2, first_time_message: 'SUPERFOOD! Japanese fermented superfood!', repeat_message: 'Natto - the ultimate gut champion!', is_superfood: true },
  { id: 44, name: 'Apple Cider Vinegar', emoji: '🍎', points: 10, repeat_points: 2, first_time_message: 'SUPERFOOD! Fermented apple magic!', repeat_message: 'ACV keeps the gut doctor away!', is_superfood: true },
  { id: 45, name: 'Pickles', emoji: '🥒', points: 10, repeat_points: 2, first_time_message: 'SUPERFOOD! Naturally fermented crunch!', repeat_message: 'Pickle power for probiotic punch!', is_superfood: true },
];

const BADGES_DATA = [
  { id: 1, name: 'Plant Starter', emoji: '🌱', description: 'Begin your plant diversity journey', points_required: 10 },
  { id: 2, name: 'Green Guardian', emoji: '🌿', description: 'Growing your gut garden', points_required: 25 },
  { id: 3, name: 'Nature Hero', emoji: '🌳', description: 'A true friend of plants', points_required: 50 },
  { id: 4, name: 'Biome Master', emoji: '🌲', description: 'Your microbiome is thriving', points_required: 100 },
  { id: 5, name: 'Plant Legend', emoji: '🌴', description: 'Ultimate plant diversity champion', points_required: 150 },
  { id: 6, name: 'Diversity King', emoji: '👑', description: 'Reached legendary diversity status', points_required: 250 },
  { id: 7, name: 'Gut Guru', emoji: '🧘', description: 'Master of microbiome balance', points_required: 500 },
  { id: 8, name: 'Plant Wizard', emoji: '🧙', description: 'Magical plant powers unlocked', points_required: 750 },
  { id: 9, name: 'Biome Champion', emoji: '🏆', description: 'Champion of gut health', points_required: 1000 },
];

// ============================================
// STORAGE KEYS
// ============================================
const STORAGE_KEYS = {
  USER: 'biomequest_user',
  LOGS: 'biomequest_logs',
  TOTAL_POINTS: 'biomequest_total_points',
};

// ============================================
// HELPER FUNCTIONS
// ============================================
const getStoredUser = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER);
  return stored ? JSON.parse(stored) : null;
};

const getStoredLogs = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
  return stored ? JSON.parse(stored) : [];
};

const getTotalPoints = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.TOTAL_POINTS);
  return stored ? parseInt(stored, 10) : 0;
};

const saveUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

const saveLogs = (logs) => {
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
};

const saveTotalPoints = (points) => {
  localStorage.setItem(STORAGE_KEYS.TOTAL_POINTS, points.toString());
};

// ============================================
// AUTH API (localStorage-based)
// ============================================
export const authAPI = {
  register: async (username, email, password) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const user = {
      id: Date.now(),
      username,
      email,
      avatarSeed: `user-${Date.now()}`,
      isAdmin: false,
      createdAt: new Date().toISOString(),
    };

    saveUser(user);
    saveTotalPoints(0);
    saveLogs([]);

    return { user, token: 'local-token' };
  },

  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    let user = getStoredUser();

    // If no user exists, create a guest user
    if (!user) {
      user = {
        id: Date.now(),
        username: 'Guest',
        email: email || 'guest@biomequest.local',
        avatarSeed: `guest-${Date.now()}`,
        isAdmin: false,
        createdAt: new Date().toISOString(),
      };
      saveUser(user);
    }

    return { user, token: 'local-token' };
  },

  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));

    const user = getStoredUser();
    if (!user) {
      throw new Error('No user found');
    }
    return user;
  },

  updateGoals: async (weeklyGoal, monthlyGoal) => {
    await new Promise(resolve => setTimeout(resolve, 100));

    const user = getStoredUser();
    if (user) {
      user.weeklyGoal = weeklyGoal;
      user.monthlyGoal = monthlyGoal;
      saveUser(user);
    }
    return { weeklyGoal, monthlyGoal };
  },

  getAllUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const user = getStoredUser();
    return user ? [{ ...user, totalPoints: getTotalPoints(), uniquePlants: new Set(getStoredLogs().map(l => l.plantId)).size }] : [];
  },

  deleteUser: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { success: true };
  },
};

// ============================================
// PLANTS API (localStorage-based)
// ============================================
export const plantsAPI = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { plants: PLANTS_DATA };
  },

  getWithStatus: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));

    const logs = getStoredLogs();
    const eatenPlantIds = new Set(logs.map(log => log.plantId));
    const plantCounts = {};

    logs.forEach(log => {
      plantCounts[log.plantId] = (plantCounts[log.plantId] || 0) + 1;
    });

    const plantsWithStatus = PLANTS_DATA.map(plant => ({
      ...plant,
      has_eaten: eatenPlantIds.has(plant.id),
      times_eaten: plantCounts[plant.id] || 0,
    }));

    return {
      plants: plantsWithStatus,
      totalPoints: getTotalPoints(),
    };
  },

  search: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 50));

    const lowerQuery = query.toLowerCase();
    const results = PLANTS_DATA.filter(plant =>
      plant.name.toLowerCase().includes(lowerQuery)
    );

    return { plants: results };
  },
};

// ============================================
// LOGS API (localStorage-based)
// ============================================
export const logsAPI = {
  logPlant: async (plantId) => {
    await new Promise(resolve => setTimeout(resolve, 100));

    const logs = getStoredLogs();
    const plant = PLANTS_DATA.find(p => p.id === plantId);

    if (!plant) {
      throw new Error('Plant not found');
    }

    const isFirstTime = !logs.some(log => log.plantId === plantId);
    const points = isFirstTime ? plant.points : plant.repeat_points;

    const newLog = {
      id: Date.now(),
      plantId,
      plantName: plant.name,
      points,
      isFirstTime,
      timestamp: new Date().toISOString(),
    };

    logs.push(newLog);
    saveLogs(logs);

    const newTotal = getTotalPoints() + points;
    saveTotalPoints(newTotal);

    return {
      log: newLog,
      totalPoints: newTotal,
      pointsEarned: points,
      isFirstTime,
    };
  },

  getDaily: async (date) => {
    await new Promise(resolve => setTimeout(resolve, 100));

    const logs = getStoredLogs();
    const dayLogs = logs
      .filter(log => log.timestamp.startsWith(date))
      .map(log => {
        const plant = PLANTS_DATA.find(p => p.id === log.plantId);
        return {
          id: log.id,
          plant_name: log.plantName,
          emoji: plant?.emoji || '🌱',
          points_earned: log.points,
          timestamp: log.timestamp,
        };
      });

    return { logs: dayLogs };
  },

  getWeekly: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));

    const logs = getStoredLogs();
    const now = new Date();

    // Get start of current week (Monday)
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday start
    startOfWeek.setDate(now.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const weekLogs = logs.filter(log => new Date(log.timestamp) >= startOfWeek);
    const weeklyPoints = weekLogs.reduce((sum, log) => sum + log.points, 0);
    const uniquePlants = new Set(weekLogs.map(log => log.plantId)).size;
    const allTimePoints = getTotalPoints();

    return {
      logs: weekLogs,
      summary: {
        weeklyPoints,
        uniquePlants,
        weeklyGoal: 150,
        allTimePoints
      }
    };
  },

  getMonthly: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));

    const logs = getStoredLogs();
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const monthLogs = logs.filter(log => new Date(log.timestamp) >= monthAgo);
    const totalPoints = monthLogs.reduce((sum, log) => sum + log.points, 0);
    const uniquePlants = new Set(monthLogs.map(log => log.plantId)).size;

    return { logs: monthLogs, totalPoints, uniquePlants };
  },

  getTopPlants: async (limit = 5) => {
    await new Promise(resolve => setTimeout(resolve, 100));

    const logs = getStoredLogs();
    const counts = {};

    logs.forEach(log => {
      counts[log.plantId] = (counts[log.plantId] || 0) + 1;
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([plantId, count]) => {
        const plant = PLANTS_DATA.find(p => p.id === parseInt(plantId));
        return { ...plant, count };
      });

    return { plants: sorted };
  },

  getAll: async (page = 1, limit = 20) => {
    await new Promise(resolve => setTimeout(resolve, 100));

    const logs = getStoredLogs();
    const start = (page - 1) * limit;
    const paged = logs.slice(start, start + limit);

    return { logs: paged, total: logs.length, page, limit };
  },
};

// ============================================
// BADGES API (localStorage-based)
// ============================================
export const badgesAPI = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));

    const totalPoints = getTotalPoints();
    const badgesWithStatus = BADGES_DATA.map(badge => ({
      ...badge,
      earned: totalPoints >= badge.points_required,
    }));

    return { badges: badgesWithStatus };
  },

  getUserBadges: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));

    const totalPoints = getTotalPoints();
    const earned = BADGES_DATA.filter(badge => totalPoints >= badge.points_required);

    return { badges: earned };
  },
};

// ============================================
// REQUESTS API (localStorage-based - just logs to console)
// ============================================
export const requestsAPI = {
  submit: async (plantName, emoji, description) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('Plant request (frontend-only mode):', { plantName, emoji, description });
    return { success: true, message: 'Request logged (frontend-only mode)' };
  },

  getPending: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [];
  },

  approve: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { success: true };
  },

  reject: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { success: true };
  },
};

// ============================================
// EXPORTS
// ============================================
export const API_URL = 'localStorage://biomequest';

export function fetchAPI() {
  throw new Error('fetchAPI is not available in frontend-only mode');
}
