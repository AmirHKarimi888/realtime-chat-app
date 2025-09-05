<script setup>
import httpService from "@/server";
import { onMounted } from 'vue';

onMounted(() => {
    // httpService.post("users", {
    //     username: "amir555",
    //     password: "123456",
    //     displayName: "Amir",
    //     avatar: "uuu"
    // })

    // httpService.post("login", {
    //     username: "amir555",
    //     password: "123456"
    // })


    httpService.get("users/me")
    .then(res => {
        for (let key in res.data) {
            console.log(key, res.data[key]);
        }
    })
    
})
</script>

<template>
    <div class="w-full min-h-screen flex flex-col justify-center items-center">
        <form @submit.prevent=""
            class="p-5 shadow-lg border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white flex flex-col gap-4">
            <div>
                <label for="displayName" class="font-[1rem] text-sm">Name</label>
                <input type="text" name="displayName"
                    class="block border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-500 focus:outline-2 outline-pink-600" />
            </div>
            <div>
                <label for="username" class="font-[1rem] text-sm">Username</label>
                <input type="text" name="username"
                    class="block border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-500 focus:outline-2 outline-pink-600" />
            </div>
            <div>
                <label for="password" class="font-[1rem] text-sm">Password</label>
                <input type="text" name="password"
                    class="block border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-500 focus:outline-2 outline-pink-600" />
                <div class="mt-1 flex items-center gap-1">
                    <input type="checkbox" name="showPassword" />
                    <label for="showPassword" class="text-xs">Show Password</label>
                </div>
            </div>
            <div>
                <label for="passwordConfirm" class="font-[1rem] text-sm">Confirm Password</label>
                <input type="text" name="passwordConfirm"
                    class="block border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-500 focus:outline-2 outline-pink-600" />
                <div class="mt-1 flex items-center gap-1">
                    <input type="checkbox" name="showConfirmPassword" />
                    <label for="showConfirmPassword" class="text-xs"> Show Password Confirm</label>
                </div>
            </div>
            <div>
                <button class="bg-pink-600 px-2 py-1 rounded-md text-sm text-white cursor-pointer hover:bg-pink-500 duration-150">Sign Up</button>
            </div>
        </form>
    </div>
</template>