// Available avatar options for user profiles
export const AVATARS = [
  { id: 'apple-man', name: 'Apple Man', file: 'apple-man.svg' },
  { id: 'broccoli-dude', name: 'Broccoli Dude', file: 'broccoli-dude.svg' },
  { id: 'carrot-guy', name: 'Carrot Guy', file: 'carrot-guy.svg' },
  { id: 'tomato-man', name: 'Tomato Man', file: 'tomato-man.svg' },
  { id: 'avocado-person', name: 'Avocado Person', file: 'avocado-person.svg' },
  { id: 'strawberry', name: 'Strawberry', file: 'strawberry.svg' },
  { id: 'pineapple-dude', name: 'Pineapple Dude', file: 'pineapple-dude.svg' },
  { id: 'blueberry-guy', name: 'Blueberry Guy', file: 'blueberry-guy.svg' },
  { id: 'banana-man', name: 'Banana Man', file: 'banana-man.svg' },
  { id: 'leafy-green', name: 'Leafy Green', file: 'leafy-green.svg' },
];

// Get avatar URL from avatar ID
export function getAvatarUrl(avatarId) {
  const avatar = AVATARS.find(a => a.id === avatarId);
  if (avatar) {
    return `/avatars/${avatar.file}`;
  }
  // Fallback to first avatar if not found
  return `/avatars/${AVATARS[0].file}`;
}

// Get random avatar ID
export function getRandomAvatarId() {
  const randomIndex = Math.floor(Math.random() * AVATARS.length);
  return AVATARS[randomIndex].id;
}
