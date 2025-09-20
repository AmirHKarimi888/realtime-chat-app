import { defineStore, storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import httpService from '@/server';
import { useSocketStore } from './useSocketStore';
import { useUsersStore } from './useUsersStore';

export const useChatStore = defineStore('chat', () => {
    const currentRoom = ref(null);
    const currentParticipant = ref(null);
    const messages = ref([]);
    const messageInput = ref("");
    const editingMessage = ref(null);
    const typingUsers = ref(new Set());
    const loading = ref(false);
    const error = ref(null);

    const socketStore = useSocketStore();

    const usersStore = useUsersStore();
    const { signedInUser, chatRooms } = storeToRefs(usersStore);

    // Load messages for a specific chat room
    const loadRoomMessages = async (roomId) => {
        try {
            loading.value = true;
            error.value = null;
            const response = await httpService.get(`/messages/room/${roomId}`);
            messages.value = response.data;

            return messages.value;
        } catch (err) {
            console.error('Error loading room messages:', err);
            error.value = err.response?.data?.error || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Set current chat room and participant
    const setCurrentChat = (room, participant) => {
        currentRoom.value = room;
        currentParticipant.value = participant;
        messages.value = []; // Clear previous messages
    };

    // Add a new message to the store
    const addMessage = (message) => {
        try {
            // Only add if it belongs to the current room
            if (currentRoom.value && message.roomId === currentRoom.value.roomId) {
                // Check if message already exists
                const exists = messages.value.some(m => m.id === message.id);
                if (!exists) {
                    messages.value.push(message);
                    // Sort messages by timestamp
                    messages.value.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                }
            }
        } catch (err) {
            console.error('Error adding message:', err);
        }
    };

    // Update an existing message
    const updateMessage = (message) => {
        const index = messages.value.findIndex(m => m.id === message.id);
        if (index !== -1) {
            messages.value[index] = { ...messages.value[index], ...message };
        }
    };

    // Set typing status for a user
    const setTyping = (userId, isTyping) => {
        if (isTyping) {
            typingUsers.value.add(userId);
        } else {
            typingUsers.value.delete(userId);
        }
    };

    // Check if a user is typing
    const isTyping = (userId) => {
        return typingUsers.value.has(userId);
    };

    // Clear all messages and current chat
    const clearChat = () => {
        messages.value = [];
        currentRoom.value = null;
        currentParticipant.value = null;
        typingUsers.value.clear();
        error.value = null;
    };


    // Send message
    const sendMessage = async (text) => {
        if (!text.trim()) return;

        if (!currentParticipant.value) {
            throw new Error('No active chat');
        }

        const socketStore = useSocketStore();

        try {
            // Send the message via Socket.IO
            socketStore.sendMessage(currentParticipant.value.id, text);

            // If this is the first message to this user
            if (!messages.value.length && !currentRoom.value) {
                // Wait for the backend to create the room
                await new Promise(resolve => setTimeout(resolve, 500));

                // Reload chat rooms to get the newly created room
                await usersStore.loadChatRooms();

                // Find the room for this participant
                currentRoom.value = chatRooms.value.find(room =>
                    room.participant.id === currentParticipant.value.id
                );

                if (currentRoom.value) {
                    // Load messages for the room
                    await loadRoomMessages(currentRoom.value.roomId);
                    console.log("Room created and messages loaded");
                } else {
                    console.warn("Room not found after message send");
                }
            }

            messageInput.value = '';

        } catch (err) {
            console.error('Error sending message:', err);
            throw err;
        }
    };


    // Edit message
    const editMessage = (messageId, newText) => {
        if (newText.trim()) {
            socketStore.editMessage(messageId, newText.trim());
        }
        messageInput.value = "";
        editingMessage.value = null;
    };

    // Delete message
    const deleteMessage = (messageId) => {
        const index = messages.value.findIndex(m => m.id === messageId);
        if (index !== -1) {
            // Either remove it or mark as deleted
            messages.value[index].isDeleted = true;
            messages.value[index].text = 'This message was deleted';
        }
        socketStore.deleteMessage(messageId);
    };

    return {
        currentRoom,
        currentParticipant,
        messages,
        messageInput,
        editingMessage,
        typingUsers: computed(() => typingUsers.value),
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        loadRoomMessages,
        setCurrentChat,
        addMessage,
        updateMessage,
        deleteMessage,
        editMessage,
        setTyping,
        isTyping,
        clearChat,
        sendMessage
    };
});