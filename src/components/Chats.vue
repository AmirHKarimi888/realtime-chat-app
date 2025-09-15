<script setup>
import { onMounted, ref } from 'vue';
import UserSearch from './UserSearch.vue';
import ChatsUsersList from './ChatsUsersList.vue';
import { useSearchStore } from '@/stores/useSearchStore';
import { storeToRefs } from 'pinia';
import { useUsersStore } from '@/stores/useUsersStore';

const searchStore = useSearchStore();
const { searchQuery, searchResults } = storeToRefs(searchStore);

const usersStore = useUsersStore();
const { chatRooms } = storeToRefs(usersStore);

const childRef = ref(null);
const loading = ref(false);

</script>

<template>
  <div>
    <div>
      <UserSearch ref="childRef" />
    </div>

    <div>
      <div v-if="loading">
        <div class="flex w-52 flex-col gap-4">
          <div class="flex items-center gap-4">
            <div class="skeleton h-16 w-16 shrink-0 rounded-full"></div>
            <div class="flex flex-col gap-4">
              <div class="skeleton h-4 w-20"></div>
              <div class="skeleton h-4 w-28"></div>
            </div>
          </div>
          <div class="skeleton h-32 w-full"></div>
        </div>
      </div>
      <div v-if="!loading">
        <ChatsUsersList :chatRooms="searchQuery ? searchResults : chatRooms" />
      </div>
    </div>
  </div>
</template>