// Available avatar options for user profiles (server-side)
export const AVATARS = [
  'apple-man',
  'banana-man',
  'avocado-person',
  'blueberry-guy',
];

// Get random avatar ID
export function getRandomAvatarId() {
  const randomIndex = Math.floor(Math.random() * AVATARS.length);
  return AVATARS[randomIndex];
}
