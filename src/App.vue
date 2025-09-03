<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';

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
</script>

<template>
  <header>
    <button @click="toggleDarkMode">toggleDarkMode</button>
  </header>

  <main>
    <RouterView />
  </main>

  <footer>

  </footer>
</template>

<style scoped></style>
