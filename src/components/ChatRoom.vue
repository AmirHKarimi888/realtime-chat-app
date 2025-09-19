<script setup>
import { watch } from 'vue';
import { useChatStore } from '@/stores/useChatStore';
import { useSocketStore } from '@/stores/useSocketStore';
import { storeToRefs } from 'pinia';
import ChatRoomMessagesList from './ChatRoomMessagesList.vue';
import httpService from '@/server';

const chatStore = useChatStore();
const { currentRoom, currentParticipant, messages, messageInput, editingMessage } = storeToRefs(chatStore);

const socketStore = useSocketStore();

let typingTimeout = null;

// Scroll to bottom of messages
function scrollChatToBottom() {
    const chatContainer = document.querySelector('#chatContainer');
    if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

// Watch for new messages and scroll to bottom
watch(messages, () => {
    setTimeout(scrollChatToBottom);
});

const getBackFromChat = () => {
    chatStore.clearChat();
}

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
</script>

<template>
    <div
        class="flex flex-col w-full h-screen bg-[url(/images/wallpaperLight.jpg)] dark:bg-[url(/images/wallpaperDark.jpg)]">

        <div class="w-full h-full flex flex-col justify-between items-center">

            <div v-if="currentParticipant"
                class="w-full h-[60px] bg-gray-50 dark:bg-gray-800 flex justify-start items-center ps-2 gap-2">
                <span
                    class="hidden max-sm:flex w-8 h-8 justify-center items-center cursor-pointer rounded-full bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <button @click="getBackFromChat" class="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                            viewBox="0 0 24 24"><!-- Icon from Prime Icons by PrimeTek - https://github.com/primefaces/primeicons/blob/master/LICENSE -->
                            <path fill="currentColor"
                                d="M14 17.75a.74.74 0 0 1-.53-.22l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 0 1 1.06 1.06L10.06 12l4.47 4.47a.75.75 0 0 1 0 1.06a.74.74 0 0 1-.53.22" />
                        </svg>
                    </button>
                </span>

                <span>
                    <img :src="currentParticipant.avatar ? `${httpService.url}${currentParticipant?.avatar}` : `${httpService.url}${currentParticipant?.defaultAvatar}`"
                        alt="avatar" class="w-[35px] aspect-square rounded-full">
                </span>
                <span>
                    {{ currentParticipant.displayName }}
                </span>
            </div>

            <div id="chatContainer" class="flex w-full h-full overflow-y-auto"
                :class="messages.length ? 'justify-start items-start' : 'justify-center items-center'">

                <span v-if="!currentParticipant && !messages.length"
                    class="px-3 py-1 text-sm text-white bg-gray-700/40 rounded-full">Select a chat</span>

                <span v-if="currentParticipant && !messages.length"
                    class="px-3 py-1 text-sm text-white bg-gray-700/40 rounded-full">No messages yet...</span>

                <div v-if="currentParticipant && messages.length">
                    <ChatRoomMessagesList :messages="messages" />
                </div>

                <div
                    class="fixed bottom-15 right-3 w-8 h-8 flex justify-center items-center cursor-pointer rounded-full bg-white dark:bg-gray-700">
                    <button @click="scrollChatToBottom" class="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24"><!-- Icon from Google Material Icons by Material Design Authors - https://github.com/material-icons/material-icons/blob/master/LICENSE -->
                            <path fill="currentColor" d="M16.59 8.59L12 13.17L7.41 8.59L6 10l6 6l6-6z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div v-if="currentParticipant"
                class="w-full min-h-10 flex bg-white dark:bg-gray-700 border-s border-t border-gray-300 dark:border-gray-800">
                <textarea @keyup.ctrl.enter="!editingMessage ? chatStore.sendMessage(messageInput) : chatStore.editMessage(editingMessage.id, messageInput)" class="w-full min-h-10 resize-none" type="text"
                    v-model="messageInput" @input="handleInput" aria></textarea>
                <button @click="!editingMessage ? chatStore.sendMessage(messageInput) : chatStore.editMessage(editingMessage.id, messageInput)" class="p-3 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                        viewBox="0 0 24 24"><!-- Icon from Google Material Icons by Material Design Authors - https://github.com/material-icons/material-icons/blob/master/LICENSE -->
                        <path fill="currentColor" d="M2.01 21L23 12L2.01 3L2 10l15 2l-15 2z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>