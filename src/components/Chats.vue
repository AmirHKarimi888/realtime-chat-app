<!--eslint-disable-->
<script setup>
import httpService from '@/server';
import UserSearch from './UserSearch.vue';
import { useSearchStore } from '@/stores/useSearchStore';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useSocketStore } from '@/stores/useSocketStore';

const searchStore = useSearchStore();
const socketStore = useSocketStore();

const { searchQuery, searchResults, onlineStatusMap } = storeToRefs(searchStore);

const loading = ref(false);


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
        searchResults.value.map(user => {
            for (let key in user) {
                console.log(key, user[key])
            }
            console.log("\n\n\n");
        })
    }
}

// watch(searchQuery, async () => {
//     await handleSearch();
// })


// Socket event handlers for real-time updates
const handleUserOnline = (userId) => {
    // Update online status in search results
    const userIndex = searchResults.value.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        searchResults.value[userIndex].isOnline = true;
        searchResults.value[userIndex].lastSeen = Date.now();
    }

    // Update our status map
    onlineStatusMap.value[userId] = true;
};

const handleUserOffline = (userId) => {
    // Update online status in search results
    const userIndex = searchResults.value.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        searchResults.value[userIndex].isOnline = false;
        searchResults.value[userIndex].lastSeen = Date.now();
    }

    // Update our status map
    onlineStatusMap.value[userId] = false;
};

// Debounce search to avoid too many requests
let searchTimeout = null;
const debouncedSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(handleSearch, 300);
};

// Watch search query with debounce
watch(searchQuery, debouncedSearch);

onMounted(() => {
    // Listen to socket events for real-time updates
    if (socketStore.socket) {
        socketStore.socket.on('user:online', handleUserOnline);
        socketStore.socket.on('user:offline', handleUserOffline);
    }
});

onUnmounted(() => {
    // Clean up socket listeners
    if (socketStore.socket) {
        socketStore.socket.off('user:online', handleUserOnline);
        socketStore.socket.off('user:offline', handleUserOffline);
    }
    clearTimeout(searchTimeout);
});
</script>

<template>
    <div>
        <div>
            <UserSearch />
        </div>

        <div>
            <div v-if="loading">loading...</div><br><br><br>
            <div v-if="!loading">{{ searchResults }}</div>
        </div>
    </div>
</template>