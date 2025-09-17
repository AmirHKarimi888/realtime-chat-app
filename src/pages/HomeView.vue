<script setup>
import Chats from '@/components/Chats.vue';
import ChatRoom from '@/components/ChatRoom.vue';
import Header from '@/components/Header.vue';
import { useChatStore } from '@/stores/useChatStore';
import { storeToRefs } from 'pinia';

const chatStore = useChatStore();
const { currentParticipant } = storeToRefs(chatStore);
</script>

<template>
    <div class="w-full h-screen flex">
        <div>
            <Header />
        </div>

        <div :class="!currentParticipant ? 'max-sm:block' : 'max-sm:hidden'" class="max-sm:w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <Chats />
        </div>

        <div :class="currentParticipant ? 'max-sm:block' : 'max-sm:hidden'" class="max-sm:w-full sm:w-1/2 md:w-2/3 lg:w-3/4">
            <ChatRoom />
        </div>
    </div>
</template>