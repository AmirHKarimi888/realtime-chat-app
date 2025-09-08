<script setup>
import httpService from '@/server';
import { useSearchStore } from '@/stores/useSearchStore';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useSocketStore } from '@/stores/useSocketStore';

const searchStore = useSearchStore();
const socketStore = useSocketStore();

const { searchQuery, searchResults } = storeToRefs(searchStore);
const { socket } = storeToRefs(socketStore);

const loading = ref(false);

defineExpose({
    loading: loading.value
})

const handleSearch = async () => {
    if (!searchQuery.value.length) {
        searchResults.value = [];
        return;
    }

    loading.value = true;
    try {
        const response = await httpService.get(`users/search?q=${encodeURIComponent(searchQuery.value)}`);
        searchResults.value = response.data;
    } catch (error) {
        console.error('Search failed:', error);
        searchResults.value = [];
    } finally {
        loading.value = false;
    }
}

// watch(searchQuery, async () => {
//     await handleSearch();
// })

// Debounce search to avoid too many requests
let searchTimeout = null;
const debouncedSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(handleSearch, 300);
};

// Watch search query with debounce
watch(searchQuery, debouncedSearch);



// Add socket event listeners for real-time updates
onMounted(() => {
  if (socket.value) {
    socket.value.on('user:online', handleUserOnline);
    socket.value.on('user:offline', handleUserOffline);
  }
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.off('user:online', handleUserOnline);
    socket.value.off('user:offline', handleUserOffline);
  }
});

const handleUserOnline = (userId) => {
  // Update status in search results
  const userIndex = searchResults.value.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    searchResults.value[userIndex].isOnline = true;
  }
};

const handleUserOffline = (userId) => {
  // Update status in search results
  const userIndex = searchResults.value.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    searchResults.value[userIndex].isOnline = false;
    searchResults.value[userIndex].lastSeen = Date.now();
  }
};
</script>

<template>
    <div class="search-box">
        <input v-model="searchQuery" placeholder="Search users..." class="search-input"
            type="text" />
        <slot :loading="loading"></slot>
    </div>
</template>