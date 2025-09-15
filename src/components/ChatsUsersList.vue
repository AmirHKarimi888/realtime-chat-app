<script setup>
import ChatsUsersListItem from './ChatsUsersListItem.vue';

defineProps({
    chatRooms: Object
})
</script>

<template>
    <ul v-for="room in chatRooms" :key="room.roomId" class="grid">
        <ChatsUsersListItem :room="room" />
    </ul>
</template>