<script setup>
import { ref } from "vue";
import DrawerContent from "./DrawerContent.vue";
import Drawer from "primevue/drawer";

const drawerVisible = ref(false);

</script>

<template>
    <div>
        <Drawer v-model:visible="drawerVisible" :show-close-icon="false" class="w-[270px] bg-gray-100 dark:bg-gray-800">
            <DrawerContent />
        </Drawer>

        <div class="w-[50px] h-screen flex justify-start items-start p-2">
            <button @click="drawerVisible = true" class="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                    viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE -->
                    <path fill="currentColor" d="M3 18v-2h18v2zm0-5v-2h18v2zm0-5V6h18v2z" />
                </svg>
            </button>
        </div>
    </div>
</template>