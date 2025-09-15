import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { io } from 'socket.io-client';
import httpService from '@/server';
import { useChatStore } from './useChatStore';

export const useSocketStore = defineStore('socket', () => {
  const socket = ref(null);
  const isConnected = ref(false);
  const onlineUsers = ref(new Set());
  const reconnectAttempts = ref(0);
  const maxReconnectAttempts = 5;
  const connectionStatus = ref('disconnected');

  const connect = (token) => {
    connectionStatus.value = 'connecting';

    socket.value = io(httpService.url, {
      auth: { token },
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000
    });

    // Connection events
    socket.value.on('connect', () => {
      isConnected.value = true;
      reconnectAttempts.value = 0;
      connectionStatus.value = 'connected';
      console.log('Socket connected');
    });

    socket.value.on('disconnect', (reason) => {
      isConnected.value = false;
      connectionStatus.value = 'disconnected';
      console.log('Socket disconnected:', reason);
    });

    socket.value.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      connectionStatus.value = 'error';
      reconnectAttempts.value++;
    });

    // User status events
    socket.value.on('user:online', (userId) => {
      onlineUsers.value.add(userId);
      console.log('User online:', userId);
    });

    socket.value.on('user:offline', (userId) => {
      onlineUsers.value.delete(userId);
      console.log('User offline:', userId);
    });

    socket.value.on('users:online-status', (onlineStatus) => {
      const onlineIds = new Set();
      for (const userId in onlineStatus) {
        if (onlineStatus[userId]) {
          onlineIds.add(userId);
        }
      }
      onlineUsers.value = onlineIds;
      console.log('Online users updated');
    });

    // Message events
    socket.value.on('message:new', (message) => {
      console.log('New message received:', message);
      const chatStore = useChatStore();
      chatStore.addMessage(message);
    });

    socket.value.on('message:updated', (message) => {
      console.log('Message updated:', message);
      const chatStore = useChatStore();
      chatStore.updateMessage(message);
    });

    socket.value.on('message:deleted', (data) => {
      console.log('Message deleted:', data.id);
      const chatStore = useChatStore();
      chatStore.deleteMessage(data.id);
    });

    // Typing indicators
    socket.value.on('typing:start', (data) => {
      console.log('User typing:', data.from);
      const chatStore = useChatStore();
      chatStore.setTyping(data.from, true);
    });

    socket.value.on('typing:stop', (data) => {
      console.log('User stopped typing:', data.from);
      const chatStore = useChatStore();
      chatStore.setTyping(data.from, false);
    });
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      isConnected.value = false;
      onlineUsers.value.clear();
      connectionStatus.value = 'disconnected';
    }
  };

  const getMessages = (roomId, limit = 50, before = null) => {
    if (socket.value && isConnected.value) {
      socket.value.emit('messages:get', { roomId, limit, before });
      return true;
    } else {
      console.error('Cannot get messages: Socket not connected');
      throw new Error('Socket not connected');
    }
  };

  const sendMessage = (to, text) => {
    if (socket.value && isConnected.value) {
      socket.value.emit('message:send', { to, text });
      return true;
    } else {
      console.error('Cannot send message: Socket not connected');
      throw new Error('Socket not connected');
    }
  };

  const editMessage = (messageId, text) => {
    if (socket.value && isConnected.value) {
      socket.value.emit('message:edit', { messageId, text });
      return true;
    } else {
      console.error('Cannot edit message: Socket not connected');
      throw new Error('Socket not connected');
    }
  };

  const deleteMessage = (messageId) => {
    if (socket.value && isConnected.value) {
      socket.value.emit('message:delete', { messageId });
      return true;
    } else {
      console.error('Cannot delete message: Socket not connected');
      throw new Error('Socket not connected');
    }
  };

  const startTyping = (to) => {
    if (socket.value && isConnected.value) {
      socket.value.emit('typing:start', { to });
      return true;
    } else {
      console.error('Cannot start typing: Socket not connected');
      return false;
    }
  };

  const stopTyping = (to) => {
    if (socket.value && isConnected.value) {
      socket.value.emit('typing:stop', { to });
      return true;
    } else {
      console.error('Cannot stop typing: Socket not connected');
      return false;
    }
  };

  const isUserOnline = (userId) => {
    return onlineUsers.value.has(userId);
  };

  return {
    socket,
    isConnected,
    onlineUsers,
    connectionStatus: computed(() => connectionStatus.value),
    connect,
    disconnect,
    getMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    startTyping,
    stopTyping,
    isUserOnline
  };
});