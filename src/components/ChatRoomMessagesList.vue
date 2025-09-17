<script setup>
import ChatRoomMessagesListItem from './ChatRoomMessagesListItem.vue';

const props = defineProps({
    messages: Object
})
</script>

<template>
    <ul class="w-full md:pe-30 lg:pe-70 p-4 flex flex-col gap-2">
        <ChatRoomMessagesListItem v-for="message in messages" :key="message.id" :message="message" />
    </ul>
</template>