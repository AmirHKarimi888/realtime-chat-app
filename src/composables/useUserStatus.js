// composables/useUserStatus.js
import { useSocketStore } from '@/stores/useSocketStore';
import { computed } from 'vue';

export function useUserStatus() {
  const socketStore = useSocketStore();

  // Function to update user status (for use in components)
  const updateUserStatus = (userId, isOnline) => {
    if (isOnline) {
      socketStore.onlineUsers.add(userId);
    } else {
      socketStore.onlineUsers.delete(userId);
    }
  };

  // Check if a specific user is online
  const isUserOnline = (userId) => {
    return socketStore.onlineUsers.has(userId);
  };

  // Get all online users
  const onlineUsers = computed(() => {
    return Array.from(socketStore.onlineUsers);
  });

  return {
    updateUserStatus,
    isUserOnline,
    onlineUsers
  };
}