<script setup>
import httpService from '@/server';
import { useUsersStore } from '@/stores/useUsersStore';
import { storeToRefs } from 'pinia';
import { Dialog } from 'primevue';
import { ref } from 'vue';

const usersStore = useUsersStore();
const { signedInUser } = storeToRefs(usersStore);

const profilePictureVisible = ref(false);
</script>

<template>
    <div>
        <img :src="signedInUser?.avatar ? `${httpService.url}${signedInUser?.avatar}` : `${signedInUser?.defaultAvatar}`"
            @click="profilePictureVisible = true" alt="User avatar" loading="lazy"
            class="w-[70px] rounded-full cursor-pointer" />

        <div v-if="profilePictureVisible" @click="profilePictureVisible = false"
            class=" w-screen h-screen fixed top-0 left-0 bg-gray-600/40">
            <Dialog v-model:visible="profilePictureVisible" :closable="false" class="max-sm:w-full w-1/2 aspect-square">
                <img :src="signedInUser?.avatar ? `${httpService.url}${signedInUser?.avatar}` : `${signedInUser?.defaultAvatar}`"
                    @click="profilePictureVisible = true" alt="User avatar" loading="lazy" class="" />
            </Dialog>
        </div>
    </div>
</template>