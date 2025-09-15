<script setup>
import { ref, watch, onUnmounted, nextTick } from 'vue';
import { useChatStore } from '@/stores/useChatStore';
import { useSocketStore } from '@/stores/useSocketStore';
import { storeToRefs } from 'pinia';
import { useUsersStore } from '@/stores/useUsersStore';
import ChatRoomMessagesList from './ChatRoomMessagesList.vue';

const usersStore = useUsersStore();
const { signedInUser } = storeToRefs(usersStore);

const chatStore = useChatStore();
const { currentRoom, currentParticipant, messages } = storeToRefs(chatStore);

const socketStore = useSocketStore();

const messageInput = ref('');
const messagesEnd = ref(null);
let typingTimeout = null;

// Scroll to bottom of messages
const scrollToBottom = () => {
    nextTick(() => {
        if (messagesEnd.value) {
            messagesEnd.value.scrollIntoView({ behavior: 'smooth' });
        }
    });
};

// Watch for new messages and scroll to bottom
watch(() => chatStore.messages.length, scrollToBottom);

// Send message
const sendMessage = async () => {

    if (messageInput.value.trim()) {
        try {
            // For a completely new chat, there's no room yet
            // Send a first message to create the room automatically
            chatStore.sendMessage(messageInput.value.trim());

            // The backend will automatically:
            // 1. Create a new chat room
            // 2. Add both users as participants
            // 3. Store the message
            // 4. Add the room to both users' chatRooms arrays

        } catch (error) {
            console.error('Failed to start new chat:', error);
        }


        messageInput.value = '';
    }
};

// Handle typing indicators
const handleInput = () => {
    if (currentRoom.value) {
        socketStore.startTyping(currentRoom.value);
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            socketStore.stopTyping(currentRoom.value);
        }, 1000);
    }
};

// Edit message
const editMessage = (messageId, newText) => {
    if (newText.trim()) {
        socketStore.editMessage(messageId, newText.trim());
    }
};

// Delete message
const deleteMessage = (messageId) => {
    socketStore.deleteMessage(messageId);
};

// Clean up on unmount
onUnmounted(() => {
    clearTimeout(typingTimeout);
    if (currentRoom.value) {
        socketStore.stopTyping(currentRoom.value);
    }
});
</script>

<template>
    <div class="flex flex-col w-full h-screen bg-gray-200 dark:bg-gray-900">

        <div class="w-full h-full flex flex-col justify-between items-center">

            <div v-if="currentParticipant"
                class="w-full h-[60px] bg-gray-50 dark:bg-gray-800 border-s border-gray-300 dark:border-gray-700">
            </div>

            <div class="flex w-full h-full overflow-y-auto"
                :class="messages.length ? 'justify-start items-start' : 'justify-center items-center'">
                <span v-if="currentParticipant && !messages.length"
                    class="px-3 py-1 text-sm text-white bg-gray-700/40 rounded-full">No messages yet...</span>

                <div v-if="currentParticipant && messages.length">
                    <ChatRoomMessagesList :messages="messages" />
                </div>
            </div>

            <div v-if="currentParticipant" class="p-5 w-full">
                <input type="text" v-model="messageInput" @input="handleInput">
                <button @click="sendMessage">send</button>
            </div>
        </div>
    </div>
</template>