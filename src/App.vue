<script setup>
import { onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { useUsersStore } from './stores/useUsersStore';
import { storeToRefs } from 'pinia';
import { useSocketStore } from './stores/useSocketStore';
import { onUnmounted } from 'vue';
import { watch } from 'vue';
import httpService from './server';

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
    document.querySelector("body").classList.add("dark");
  } else {
    document.querySelector("body").classList.remove("dark");
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

const toggleDarkMode = () => {
  if (JSON.parse(localStorage.getItem("isDarkMode"))) {
    document.querySelector("body").classList.remove("dark");
    localStorage.setItem("isDarkMode", false);
  } else {
    document.querySelector("body").classList.add("dark");
    localStorage.setItem("isDarkMode", true);
  }
}

const { signOut } = usersStore;
const signOutUser = async () => {
  await signOut()
    .then(() => router.push("/signin"))
}
</script>

<template>
  <header>
    <button @click="toggleDarkMode">toggleDarkMode</button>
    <br /><br />
    <button @click="signOutUser">Sign Out</button>
    <br><br><br><br>
    <img :src="signedInUser?.defaultAvatar" alt="User Avatar" loading="lazy">
    <img width="60" :src="`${httpService.url}${signedInUser?.avatar}`" alt="User avatar" loading="lazy" />
  </header>

  <main>
    <RouterView />
  </main>

  <footer>

  </footer>
</template>

<style scoped></style>
