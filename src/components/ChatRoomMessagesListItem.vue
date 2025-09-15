<script setup>
import httpService from '@/server';
import { useChatStore } from '@/stores/useChatStore';
import { useUsersStore } from '@/stores/useUsersStore';
import { storeToRefs } from 'pinia';

const usersStore = useUsersStore();
const { signedInUser } = storeToRefs(usersStore);

const chatStore = useChatStore();
const { currentParticipant } = storeToRefs(chatStore);

const props = defineProps({
    message: Object
})
</script>

<template>
    <li class="flex items-end gap-2">
        <div>
            <img v-if="message.from === signedInUser.id" :src="signedInUser.avatar ? `${httpService.url}${signedInUser?.avatar}` : `${httpService.url}${signedInUser?.defaultAvatar}`" alt="avatar" class="w-[35px] aspect-square rounded-full">
            <img v-if="message.from === currentParticipant.id" :src="currentParticipant.avatar ? `${httpService.url}${currentParticipant?.avatar}` : `${httpService.url}${currentParticipant?.defaultAvatar}`" alt="avatar" class="w-[35px] aspect-square rounded-full">
        </div>
        <div class="p-2 rounded-md rounded-bl-none w-fit h-fit"
            :class="signedInUser.id === message.from ? 'bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500' : 'bg-gray-400 dark:bg-gray-700'">
            <span>{{ message.text }}</span>
        </div>
    </li>
</template>