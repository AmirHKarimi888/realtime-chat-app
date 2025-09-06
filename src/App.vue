<script setup>
import { onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import httpService from "@/server";
import { useUsersStore } from './stores/useUsersStore';
import { storeToRefs } from 'pinia';

const usersStore = useUsersStore();
const { signedInUser } = storeToRefs(usersStore);

const router = useRouter();

onMounted(() => {
  if (!localStorage.getItem("isDarkMode")) localStorage.setItem("isDarkMode", window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? true : false);

  if (JSON.parse(localStorage.getItem("isDarkMode"))) {
    document.querySelector("body").classList.add("dark");
  } else {
    document.querySelector("body").classList.remove("dark");
  }

  httpService.get("users/me")
    .then(res => {
      signedInUser.value = res.data;
    })
    .catch(err => console.error(err.message))
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
const signOutUser = async() => {
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
