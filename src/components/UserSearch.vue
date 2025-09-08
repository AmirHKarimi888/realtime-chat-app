<script setup>
import { useSearchStore } from '@/stores/useSearchStore';
import { storeToRefs } from 'pinia';

const searchStore = useSearchStore();

const { searchQuery } = storeToRefs(searchStore);
</script>

<template>
    <div class="search-box">
        <input v-model="searchQuery" placeholder="Search users..." class="search-input"
            type="text" />
    </div>
</template>