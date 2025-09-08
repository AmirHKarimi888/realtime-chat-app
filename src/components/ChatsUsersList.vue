<script setup>
import ChatsUsersListItem from './ChatsUsersListItem.vue';

defineProps({
    usersList: Object
})
</script>

<template>
    <div>
        <ul v-for="user in usersList" :key="user.id" class="grid">
            <ChatsUsersListItem :user="user" />
        </ul>
    </div>
</template>