<script setup>
import ChatRoomMessagesListItem from './ChatRoomMessagesListItem.vue';

const props = defineProps({
    messages: Object
})
</script>

<template>
    <ul class="sm:w-full md:w-[75%] lg:w-[60%] p-4 flex flex-col gap-2">
        <ChatRoomMessagesListItem v-for="message in messages" :key="message.id" :message="message" />
    </ul>
</template>