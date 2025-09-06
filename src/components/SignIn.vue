<script setup>
import { useUsersStore } from "@/stores/useUsersStore";
import { ErrorMessage, Field, Form } from "vee-validate";
import { ref } from 'vue';
import { useRouter } from "vue-router";
import * as yup from "yup";

const usersStore = useUsersStore();
const router = useRouter();

const showPassword = ref(false);

const schema = yup.object({
    username: yup
        .string()
        .required("Username is required")
        .matches(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscore allowed")
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters"),

    password: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
});

const { signIn } = usersStore;
const signInUser = async(values) => {
    await signIn(values)
    .then(() => router.push("/"))
}
</script>

<template>
    <div class="w-full min-h-screen flex flex-col justify-center items-center">
        <Form @submit="signInUser" :validation-schema="schema"
            class="p-5 shadow-lg border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white flex flex-col gap-4 w-[280px]">
            <div>
                <label for="username" class="font-[1rem] text-sm">Username</label>
                <Field type="text" name="username"
                    class="block border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-500 focus:outline-2 outline-pink-600 w-full text-sm p-1" />
                <ErrorMessage name="username" class="text-xs text-red-500" />
            </div>
            <div>
                <label for="password" class="font-[1rem] text-sm">Password</label>
                <Field :type="showPassword ? 'text' : 'password'" name="password"
                    class="block border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-500 focus:outline-2 outline-pink-600 w-full text-sm p-1" />
                <div class="mt-1 flex items-center gap-1">
                    <input type="checkbox" name="showPassword" v-model="showPassword" />
                    <label for="showPassword" class="text-xs">Show Password</label>
                </div>
                <ErrorMessage name="password" class="text-xs text-red-500" />
            </div>
            <div>
                <button
                    class="bg-pink-600 px-2 py-1 rounded-md text-sm items-center text-white cursor-pointer hover:bg-pink-500 duration-150">Sign
                    In</button>
            </div>

            <div class="text-xs text-gray-700 dark:text-white">
                Haven't you registered yet?
                <RouterLink to="/signup" class="text-pink-600">Sign Up</RouterLink>
            </div>
        </Form>
    </div>
</template>