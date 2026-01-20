// Available avatar options for user profiles (server-side)
export const AVATARS = [
  'apple-man',
  'broccoli-dude',
  'carrot-guy',
  'tomato-man',
  'avocado-person',
  'strawberry',
  'pineapple-dude',
  'blueberry-guy',
  'banana-man',
  'leafy-green',
];

// Get random avatar ID
export function getRandomAvatarId() {
  const randomIndex = Math.floor(Math.random() * AVATARS.length);
  return AVATARS[randomIndex];
}
