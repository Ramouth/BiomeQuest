// Available avatar options for user profiles
export const AVATARS = [
  { id: 'apple-man', name: 'Apple Man', file: 'apple-man.png' },
  { id: 'banana-man', name: 'Banana Man', file: 'banana-man.png' },
  { id: 'avocado-person', name: 'Avocado Person', file: 'avocado-person.png' },
  { id: 'blueberry-guy', name: 'Blueberry Guy', file: 'blueberry-guy.png' },
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
