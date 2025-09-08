// stores/useSocketStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { io } from 'socket.io-client';
import httpService from '@/server';

export const useSocketStore = defineStore('socket', () => {
  const socket = ref(null);
  const isConnected = ref(false);

  const connect = (token) => {
    socket.value = io(httpService.url, {
      auth: { token },
      withCredentials: true
    });

    socket.value.on('connect', () => {
      isConnected.value = true;
      console.log('Socket connected');
    });

    socket.value.on('disconnect', () => {
      isConnected.value = false;
      console.log('Socket disconnected');
    });

    socket.value.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      isConnected.value = false;
    }
  };

  return {
    socket,
    isConnected,
    connect,
    disconnect
  };
});