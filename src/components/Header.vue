<script setup>
import httpService from "@/server";
import { useUsersStore } from "@/stores/useUsersStore";
import { storeToRefs } from "pinia";
import { Button, Drawer } from "primevue";
import { ref } from "vue";

const usersStore = useUsersStore();
const { signedInUser } = storeToRefs(usersStore);

const visible = ref(false);
const isDarkMode = ref(document.documentElement.classList.contains("dark"));

const toggleDarkMode = () => {
    if (JSON.parse(localStorage.getItem("isDarkMode"))) {
        document.querySelector("html").classList.remove("dark");
        localStorage.setItem("isDarkMode", false);
    } else {
        document.querySelector("html").classList.add("dark");
        localStorage.setItem("isDarkMode", true);
    }
    isDarkMode.value = !isDarkMode.value;
}

const { signOut } = usersStore;
const signOutUser = async () => {
  await signOut()
    .then(() => router.push("/signin"))
}
</script>

<template>
    <div>
        <Drawer v-model:visible="visible" :show-close-icon="false" class="w-[270px] bg-gray-100 dark:bg-gray-800">
            <div class="flex justify-end p-3">
                <button @click="toggleDarkMode" class="cursor-pointer">
                    <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                        viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE -->
                        <path fill="currentColor"
                            d="M12 5q-.425 0-.712-.288Q11 4.425 11 4V2q0-.425.288-.713Q11.575 1 12 1t.713.287Q13 1.575 13 2v2q0 .425-.287.712Q12.425 5 12 5Zm4.95 2.05q-.275-.275-.275-.688q0-.412.275-.712l1.4-1.425q.3-.3.712-.3q.413 0 .713.3q.275.275.275.7q0 .425-.275.7L18.35 7.05q-.275.275-.7.275q-.425 0-.7-.275ZM20 13q-.425 0-.712-.288Q19 12.425 19 12t.288-.713Q19.575 11 20 11h2q.425 0 .712.287q.288.288.288.713t-.288.712Q22.425 13 22 13Zm-8 10q-.425 0-.712-.288Q11 22.425 11 22v-2q0-.425.288-.712Q11.575 19 12 19t.713.288Q13 19.575 13 20v2q0 .425-.287.712Q12.425 23 12 23ZM5.65 7.05l-1.425-1.4q-.3-.3-.3-.725t.3-.7q.275-.275.7-.275q.425 0 .7.275L7.05 5.65q.275.275.275.7q0 .425-.275.7q-.3.275-.7.275q-.4 0-.7-.275Zm12.7 12.725l-1.4-1.425q-.275-.3-.275-.712q0-.413.275-.688q.275-.275.688-.275q.412 0 .712.275l1.425 1.4q.3.275.287.7q-.012.425-.287.725q-.3.3-.725.3t-.7-.3ZM2 13q-.425 0-.712-.288Q1 12.425 1 12t.288-.713Q1.575 11 2 11h2q.425 0 .713.287Q5 11.575 5 12t-.287.712Q4.425 13 4 13Zm2.225 6.775q-.275-.275-.275-.7q0-.425.275-.7L5.65 16.95q.275-.275.688-.275q.412 0 .712.275q.3.3.3.713q0 .412-.3.712l-1.4 1.4q-.3.3-.725.3t-.7-.3ZM12 18q-2.5 0-4.25-1.75T6 12q0-2.5 1.75-4.25T12 6q2.5 0 4.25 1.75T18 12q0 2.5-1.75 4.25T12 18Zm0-2q1.65 0 2.825-1.175Q16 13.65 16 12q0-1.65-1.175-2.825Q13.65 8 12 8q-1.65 0-2.825 1.175Q8 10.35 8 12q0 1.65 1.175 2.825Q10.35 16 12 16Zm0 0q-1.65 0-2.825-1.175Q8 13.65 8 12q0-1.65 1.175-2.825Q10.35 8 12 8q1.65 0 2.825 1.175Q16 10.35 16 12q0 1.65-1.175 2.825Q13.65 16 12 16Z" />
                    </svg>
                    <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                        viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE -->
                        <path fill="currentColor"
                            d="m15 8l-3-3l3-3l3 3zm5 3l-2-2l2-2l2 2zm-7.925 11q-2.1 0-3.937-.8t-3.2-2.162t-2.163-3.2t-.8-3.938q0-3.65 2.325-6.437T10.225 2q-.45 2.475.275 4.838t2.5 4.137t4.138 2.5t4.837.275q-.65 3.6-3.45 5.925T12.075 22" />
                    </svg>
                </button>
            </div>
            <div class="mt-2 flex flex-col items-center gap-2">
                <div>
                    <img :src="signedInUser?.avatar ? `${httpService.url}${signedInUser?.avatar}` : `${signedInUser?.defaultAvatar}`" alt="User avatar" loading="lazy"
                        class="w-[70px] rounded-full cursor-pointer" />
                </div>
                <div class="flex flex-col items-center gap-1">
                    <span class="font-bold text-lg text-gray-700 dark:text-gray-100">{{ signedInUser?.displayName
                        }}</span>
                    <span class="font-light text-gray-600 dark:text-gray-200">@{{ signedInUser?.username }}</span>
                </div>
            </div>

            <div>
                <button @click="signOutUser">Sign Out</button>
            </div>
        </Drawer>

        <div class="w-[50px] h-screen flex justify-start items-start p-2">
            <button @click="visible = true" class="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                    viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE -->
                    <path fill="currentColor" d="M3 18v-2h18v2zm0-5v-2h18v2zm0-5V6h18v2z" />
                </svg>
            </button>
        </div>
    </div>
</template>