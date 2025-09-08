<script setup>
import { onMounted, ref } from 'vue';
import UserSearch from './UserSearch.vue';
import ChatsUsersList from './ChatsUsersList.vue';
import { useSearchStore } from '@/stores/useSearchStore';
import { storeToRefs } from 'pinia';

const searchStore = useSearchStore();

const { searchQuery, searchResults } = storeToRefs(searchStore);

const childRef = ref(null);
const loading = ref(false);

onMounted(() => {
  if (childRef.value) {
    loading.value = childRef.value.loading;
  }
})
</script>

<template>
    <div>
        <div>
            <UserSearch ref="childRef" />
        </div>

        <div>
            <div v-if="loading">loading...</div><br><br><br>
            <div v-if="!loading">
              <ChatsUsersList :usersList="searchQuery ? searchResults : []" />
            </div>
        </div>
    </div>
</template>