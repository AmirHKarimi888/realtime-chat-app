<script setup>
import { onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { useUsersStore } from './stores/useUsersStore';
import { storeToRefs } from 'pinia';
import { useSocketStore } from './stores/useSocketStore';
import { onUnmounted } from 'vue';
import { watch } from 'vue';
import httpService from './server';
import Header from './components/Header.vue';

const usersStore = useUsersStore();
const socketStore = useSocketStore();

const { signedInUser } = storeToRefs(usersStore);

const router = useRouter();


// Connect socket when user logs in
watch(() => signedInUser.value, (newUser) => {
  if (newUser) {
    // Get token from cookie or store
    const token = getTokenFromCookie(); // You need to implement this
    socketStore.connect(token);
  } else {
    socketStore.disconnect();
  }
});

// Helper function to get token from cookie
const getTokenFromCookie = () => {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};


onMounted(() => {
  if (!localStorage.getItem("isDarkMode")) localStorage.setItem("isDarkMode", window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? true : false);

  if (JSON.parse(localStorage.getItem("isDarkMode"))) {
    document.querySelector("html").classList.add("dark");
  } else {
    document.querySelector("html").classList.remove("dark");
  }

  // Connect if user is already logged in
  if (signedInUser.value) {
    const token = getTokenFromCookie();
    if (token) {
      socketStore.connect(token);
    }
  }
})

onUnmounted(() => {
  socketStore.disconnect();
});



</script>

<template>
  <div class="flex">
    <header>
      <Header />
    </header>

    <main>
      <RouterView />
    </main>

    <footer>

    </footer>
  </div>
</template>

<style scoped></style>
