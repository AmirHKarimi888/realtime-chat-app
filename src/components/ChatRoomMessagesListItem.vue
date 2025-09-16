<script setup>
import { useTimeFormatter } from '@/composables/useTimeFormatter';
import httpService from '@/server';
import { useChatStore } from '@/stores/useChatStore';
import { useUsersStore } from '@/stores/useUsersStore';
import { storeToRefs } from 'pinia';
import { Popover } from 'primevue';
import { onBeforeMount, ref } from 'vue';

const usersStore = useUsersStore();
const { signedInUser } = storeToRefs(usersStore);

const chatStore = useChatStore();
const { currentParticipant, messageInput, editingMessage } = storeToRefs(chatStore);

const op = ref();

const props = defineProps({
    message: Object
})

const messageTopDisplayNameColor = ref("");

onBeforeMount(() => {
    messageTopDisplayNameColor.value = props.message.from === signedInUser.value.id ? `${signedInUser.value.defaultAvatar.split('&')[1].split('=')[1]}` : `${currentParticipant.value.defaultAvatar.split('&')[1].split('=')[1]}`;
})

const startEditingMessage = () => {
    messageInput.value = props.message.text;
    editingMessage.value = props.message;
}

</script>

<template>
    <li v-if="!message.isDeleted" class="flex items-end gap-2">
        <div>
            <img v-if="message.from === signedInUser.id"
                :src="signedInUser.avatar ? `${httpService.url}${signedInUser?.avatar}` : `${httpService.url}${signedInUser?.defaultAvatar}`"
                alt="avatar" class="w-[35px] aspect-square rounded-full">
            <img v-if="message.from === currentParticipant.id"
                :src="currentParticipant.avatar ? `${httpService.url}${currentParticipant?.avatar}` : `${httpService.url}${currentParticipant?.defaultAvatar}`"
                alt="avatar" class="w-[35px] aspect-square rounded-full">
        </div>
        <div class="p-2 rounded-md rounded-bl-none w-fit h-fit flex flex-col gap-3 shadow-md"
            :class="signedInUser.id === message.from ? 'bg-blue-300 dark:bg-linear-to-l dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500' : 'bg-gray-100 dark:bg-gray-700'">
            <div v-if="message.from !== signedInUser.id" :style="`color: #${messageTopDisplayNameColor};`">{{ message.from.id === signedInUser.id ? signedInUser.displayName : currentParticipant.displayName }}</div>
            <div class="whitespace-pre-wrap text-sm">{{ message.text }}</div>
            <div class="whitespace-pre-wrap text-[0.6rem]">{{ useTimeFormatter().formatTime(message.createdAt) }}</div>
        </div>

        <div v-if="message.from === signedInUser.id" @click="e => op.toggle(e)" class="bg-gray-100/50 dark:bg-gray-500/50 rounded-full cursor-pointer mb-7">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24"><!-- Icon from Google Material Icons by Material Design Authors - https://github.com/material-icons/material-icons/blob/master/LICENSE -->
                <path fill="currentColor" d="M16.59 8.59L12 13.17L7.41 8.59L6 10l6 6l6-6z" />
            </svg>
        </div>

        <Popover ref="op">
            <ul class="py-1 bg-gray-50 dark:bg-gray-700 rounded-md text-sm flex flex-col">
                <li @click="startEditingMessage" class="flex justify-start items-center gap-1 p-2 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                        viewBox="0 0 24 24"><!-- Icon from Prime Icons by PrimeTek - https://github.com/primefaces/primeicons/blob/master/LICENSE -->
                        <path fill="currentColor" fill-rule="evenodd"
                            d="M17.907 4.93c.104-.105.294-.186.539-.18a.85.85 0 0 1 .572.216c.13.13.222.34.231.575s-.065.413-.167.515l-7.49 7.5l-1.273.116l.1-1.245zm2.173-1.024c-.437-.438-1.037-.643-1.6-.656s-1.182.167-1.635.62l-7.682 7.692a.75.75 0 0 0-.217.47l-.194 2.407a.75.75 0 0 0 .816.807l2.43-.22a.75.75 0 0 0 .463-.218l7.682-7.692c.456-.456.627-1.073.605-1.635a2.37 2.37 0 0 0-.668-1.575M5.812 4.75a2.57 2.57 0 0 0-2.563 2.562v10.875a2.57 2.57 0 0 0 2.563 2.563h10.875a2.57 2.57 0 0 0 2.563-2.562V12.75a.75.75 0 0 0-1.5 0v5.438c0 .582-.48 1.062-1.063 1.062H5.812c-.583 0-1.063-.48-1.063-1.062V7.312c0-.582.48-1.062 1.063-1.062h5.437a.75.75 0 0 0 0-1.5z"
                            clip-rule="evenodd" />
                    </svg>
                    <span>Edit</span>
                </li>

                <li @click="() => chatStore.deleteMessage(message.id)" class="flex justify-start items-center gap-1 p-2 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                        viewBox="0 0 24 24"><!-- Icon from Prime Icons by PrimeTek - https://github.com/primefaces/primeicons/blob/master/LICENSE -->
                        <path fill="currentColor" d="M20 8.7H4a.75.75 0 1 1 0-1.5h16a.75.75 0 0 1 0 1.5" />
                        <path fill="currentColor"
                            d="M16.44 20.75H7.56A2.4 2.4 0 0 1 5 18.49V8a.75.75 0 0 1 1.5 0v10.49c0 .41.47.76 1 .76h8.88c.56 0 1-.35 1-.76V8A.75.75 0 1 1 19 8v10.49a2.4 2.4 0 0 1-2.56 2.26m.12-13a.74.74 0 0 1-.75-.75V5.51c0-.41-.48-.76-1-.76H9.22c-.55 0-1 .35-1 .76V7a.75.75 0 1 1-1.5 0V5.51a2.41 2.41 0 0 1 2.5-2.26h5.56a2.41 2.41 0 0 1 2.53 2.26V7a.75.75 0 0 1-.75.76Z" />
                        <path fill="currentColor"
                            d="M10.22 17a.76.76 0 0 1-.75-.75v-4.53a.75.75 0 0 1 1.5 0v4.52a.75.75 0 0 1-.75.76m3.56 0a.75.75 0 0 1-.75-.75v-4.53a.75.75 0 0 1 1.5 0v4.52a.76.76 0 0 1-.75.76" />
                    </svg>
                    <span>Delete</span>
                </li>
            </ul>
        </Popover>
    </li>
</template>