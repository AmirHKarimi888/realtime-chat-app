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

        if (messageInput.value.trim()) {
            if (!currentParticipant.value) {
                throw new Error('No active chat');
            }

            const socketStore = useSocketStore();

            try {
                socketStore.sendMessage(currentParticipant.value.id, text);

                if (!messages.value.length && !currentRoom.value) {

                    usersStore.loadChatRooms()
                        .then(() => {
                            currentRoom.value = chatRooms.value.find(room => {
                                if (room.participant.id === currentParticipant.value.id) {
                                    return room;
                                }
                            })
                        })
                        .then(() => {
                            setTimeout(loadRoomMessages(currentRoom.value?.roomId), 1000);
                        })
                }

            } catch (err) {
                console.error('Error sending message:', err);
                throw err;
            }

            messageInput.value = '';
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