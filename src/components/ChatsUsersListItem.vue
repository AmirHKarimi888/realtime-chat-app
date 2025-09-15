<script setup>
import httpService from '@/server';
import { useChatStore } from '@/stores/useChatStore';
import { useUsersStore } from '@/stores/useUsersStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const props = defineProps({
  room: Object
})

const user = ref(props.room.roomId ? props.room.participant : props.room);

const chatStore = useChatStore();
const { currentParticipant, currentRoom } = storeToRefs(chatStore);

const usersStore = useUsersStore();

//Get message
const getMessages = async (participant) => {
  // Now we need to wait for the room to be created and refresh our chat list

  // Find the new room with this user
  const newRoom = usersStore.chatRooms.find(room => room.participant.id === participant.id);

  if (newRoom) {
    // Open the new chat room
    chatStore.setCurrentChat(newRoom, newRoom.participant);
    await chatStore.loadRoomMessages(newRoom.roomId);
  }
}

const startChat = async (user) => {
  currentParticipant.value = user;
  currentRoom.value = null;
  await getMessages(user);
};
</script>

<template>
  <li @click="startChat(user)" class="flex hover:bg-gray-200 hover:dark:bg-gray-700 duration-200 cursor-pointer">
    <div class="w-[20%] p-2">
      <img :src="user?.avatar ? `${httpService.url}${user?.avatar}` : user?.defaultAvatar" alt="avatar" loading="lazy"
        class="w-full aspect-square rounded-full bg-cover" />
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