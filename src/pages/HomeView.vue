<script setup>
import Chats from '@/components/Chats.vue';
import ChatRoom from '@/components/ChatRoom.vue';
import Header from '@/components/Header.vue';
</script>

<template>
    <div class="w-full h-screen flex">
        <div>
            <Header />
        </div>

        <div class="max-sm:w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <Chats />
        </div>

        <div class="max-sm:hidden sm:w-1/2 md:w-2/3 lg:w-3/4">
            <ChatRoom />
        </div>
    </div>
</template>