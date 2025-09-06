<script setup>
import { onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { useUsersStore } from './stores/useUsersStore';

const usersStore = useUsersStore();

const router = useRouter();

onMounted(() => {
  if (!localStorage.getItem("isDarkMode")) localStorage.setItem("isDarkMode", window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? true : false);

  if (JSON.parse(localStorage.getItem("isDarkMode"))) {
    document.querySelector("body").classList.add("dark");
  } else {
    document.querySelector("body").classList.remove("dark");
  }
})

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
  </header>

  <main>
    <RouterView />
  </main>

  <footer>

  </footer>
</template>

<style scoped></style>
