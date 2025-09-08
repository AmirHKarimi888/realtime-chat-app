<script setup>
import Chats from '@/components/Chats.vue';
import ChatRoom from '@/components/ChatRoom.vue';
</script>

<template>
    <div class="w-full h-screen flex">
        <div class="max-sm:w-full md:w-1/3 lg:w-1/4">
            <Chats />
        </div>

        <div class="max-sm:hidden md:w-2/3 lg:w-3/4">
            <ChatRoom />
        </div>
    </div>
</template>