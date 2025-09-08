import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore = defineStore("search", () => {
    const searchQuery = ref("");
    const searchResults = ref([]);
    const onlineUsers = ref({});
    const onlineStatusMap = ref({});

    return { searchQuery, searchResults, onlineUsers, onlineStatusMap };
})