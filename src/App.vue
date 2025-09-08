<script setup>
import { onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { useUsersStore } from './stores/useUsersStore';
import { storeToRefs } from 'pinia';
import { useSocketStore } from './stores/useSocketStore';
import { onUnmounted } from 'vue';

const usersStore = useUsersStore();
const socketStore = useSocketStore();

const { signedInUser } = storeToRefs(usersStore);

const router = useRouter();

onMounted(() => {
  if (!localStorage.getItem("isDarkMode")) localStorage.setItem("isDarkMode", window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? true : false);

  if (JSON.parse(localStorage.getItem("isDarkMode"))) {
    document.querySelector("body").classList.add("dark");
  } else {
    document.querySelector("body").classList.remove("dark");
  }

  // Connect socket when user is logged in
  if (signedInUser.value) {
    // You might need to get the token from cookies or store
    socketStore.connect();
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
    <img width="60" :src="`http://localhost:4000${signedInUser?.avatar}`" alt="User avatar" loading="lazy" />
  </header>

  <main>
    <RouterView />
  </main>

  <footer>

  </footer>
</template>

<style scoped></style>
