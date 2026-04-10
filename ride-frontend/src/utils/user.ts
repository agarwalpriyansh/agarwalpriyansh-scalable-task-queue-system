export const getOrGenerateUserId = (): string => {
  const existingId = localStorage.getItem('swift_ride_user_id');
  if (existingId) return existingId;

  const newId = `user_${Math.random().toString(36).substring(2, 7)}`;
  localStorage.setItem('swift_ride_user_id', newId);
  return newId;
};
