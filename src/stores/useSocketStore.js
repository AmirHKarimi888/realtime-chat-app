// stores/useSocketStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { io } from 'socket.io-client';
import httpService from '@/server';

export const useSocketStore = defineStore('socket', () => {
  const socket = ref(null);
  const isConnected = ref(false);
  const onlineUsers = ref(new Set()); // Store online user IDs

  const connect = (token) => {
    socket.value = io(httpService.url, {
      auth: { token },
      withCredentials: true,
      transports: ['websocket', 'polling'] // Fallback support
    });

    // Connection events
    socket.value.on('connect', () => {
      isConnected.value = true;
      console.log('Socket connected');
    });

    socket.value.on('disconnect', () => {
      isConnected.value = false;
      console.log('Socket disconnected');
    });

    // socket.value.on('connect_error', (error) => {
    //   console.error('Socket connection error:', error);
    // });

    // User status events
    socket.value.on('user:online', (userId) => {
      onlineUsers.value.add(userId);
      //console.log('User online:', userId);
    });

    socket.value.on('user:offline', (userId) => {
      onlineUsers.value.delete(userId);
      //console.log('User offline:', userId);
    });

    socket.value.on('users:online', (onlineUserIds) => {
      onlineUsers.value = new Set(onlineUserIds);
      //console.log('Online users received:', onlineUserIds);
    });

    // Message events (if needed)
    socket.value.on('message:new', (message) => {
      console.log('New message:', message);
      // Handle new messages here
    });
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      isConnected.value = false;
      onlineUsers.value.clear();
    }
  };

  const isUserOnline = (userId) => {
    return onlineUsers.value.has(userId);
  };

  return {
    socket,
    isConnected,
    onlineUsers,
    connect,
    disconnect,
    isUserOnline
  };
});