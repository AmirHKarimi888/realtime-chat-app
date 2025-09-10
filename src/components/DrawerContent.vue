<script setup>
import { useUsersStore } from "@/stores/useUsersStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import ProfilePictureOpened from "./ProfilePictureOpened.vue";

const usersStore = useUsersStore();
const { signedInUser } = storeToRefs(usersStore);

const router = useRouter();

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
        <div class="flex justify-end p-3">
            <button @click="toggleDarkMode" class="cursor-pointer text-gray-600 dark:text-gray-100">
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
                <ProfilePictureOpened />
            </div>

            <div class="flex flex-col items-center gap-1">
                <span class="font-bold text-lg text-gray-700 dark:text-gray-100">{{ signedInUser?.displayName
                    }}</span>
                <span class="font-light text-gray-600 dark:text-gray-200">@{{ signedInUser?.username }}</span>
            </div>
        </div>

        <ul class="mt-5 w-full flex flex-col">
            <li @click="signOutUser" class="px-3 py-1 flex justify-start items-center gap-2 hover:bg-gray-200 hover:dark:bg-gray-700 duration-200 cursor-pointer">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4t-.288.713T11 5H5v14h6q.425 0 .713.288T12 20t-.288.713T11 21zm12.175-8H10q-.425 0-.712-.288T9 12t.288-.712T10 11h7.175L15.3 9.125q-.275-.275-.275-.675t.275-.7t.7-.313t.725.288L20.3 11.3q.3.3.3.7t-.3.7l-3.575 3.575q-.3.3-.712.288t-.713-.313q-.275-.3-.262-.712t.287-.688z"/></svg>
                </span>
                <span>
                    Sign Out
                </span>
            </li>
        </ul>
    </div>
</template>