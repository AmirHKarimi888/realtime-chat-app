<script setup>
import httpService from '@/server';

defineProps({
    user: Object
})
</script>

<template>
    <li class="flex hover:bg-gray-200 cursor-pointer">
        <div class="w-[20%] p-2">
            <img :src="user?.avatar ? `${httpService.url}${user?.avatar}` : user?.defaultAvatar" alt="avatar" loading="lazy" class="w-full aspect-square rounded-full bg-cover" />
        </div>

        <div class="w-[60%] flex flex-col justify-center ps-5">
            <span class="font-bold">{{ user?.displayName }}</span>
            <span class="text-sm font-light">{{ user?.username }}</span>
        </div>

        <div class="w-[20%] aspect-square flex items-center justify-center p-2">
            <span v-if="user?.isOnline" class="w-[10px] aspect-square rounded-full bg-green-500"></span>
        </div>
    </li>
</template>