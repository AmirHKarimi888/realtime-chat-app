<script setup>
import { useUsersStore } from "@/stores/useUsersStore";
import { ErrorMessage, Field, Form } from "vee-validate";
import { ref } from 'vue';
import { useRouter } from "vue-router";
import * as yup from "yup";

const usersStore = useUsersStore();

const router = useRouter();

const showPassword = ref(false);
const showPasswordConfirm = ref(false);

//const avatarFile = ref(null);

const schema = yup.object({
    displayName: yup
        .string()
        .required("Display name is required")
        .min(2, "Display name must be at least 2 characters")
        .max(50, "Display name must be at most 50 characters"),

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

    passwordConfirm: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match"),
});

// function onFileChange(e) {
//   const file = e.target.files[0];
//   if (!file) return;
  
//   // optional: check file size (e.g., max 2MB)
//   if (file.size > 2 * 1024 * 1024) {
//     alert('File is too large! Max 2MB.');
//     return;
//   }
  
//   avatarFile.value = file;
// }

const { signUp } = usersStore;
const signUpUser = async(values) => {
    await signUp(values)
    .then(() => router.push("/"))
}
// const signUpUser = async(values) => {
//     await signUp({...values, avatarFile})
//     .then(() => router.push("/"))
// }
</script>

<template>
    <div class="w-full min-h-screen flex flex-col justify-center items-center">
        <Form @submit="signUpUser" :validation-schema="schema"
            class="p-5 shadow-lg border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white flex flex-col gap-4 w-[280px]">
            <div>
                <label for="displayName" class="font-[1rem] text-sm">Name</label>
                <Field type="text" name="displayName"
                    class="block border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-500 focus:outline-2 outline-pink-600 w-full text-sm p-1" />
                <ErrorMessage name="displayName" class="text-xs text-red-500" />
            </div>
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
                <label for="passwordConfirm" class="font-[1rem] text-sm">Confirm Password</label>
                <Field :type="showPasswordConfirm ? 'text' : 'password'" name="passwordConfirm"
                    class="block border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-500 focus:outline-2 outline-pink-600 w-full text-sm p-1" />
                <div class="mt-1 flex items-center gap-1">
                    <input type="checkbox" name="showConfirmPassword" v-model="showPasswordConfirm" />
                    <label for="showConfirmPassword" class="text-xs"> Show Password Confirm</label>
                </div>
                <ErrorMessage name="passwordConfirm" class="text-xs text-red-500" />
            </div>
            <!--<div>
                <input type="file" @change="onFileChange" accept="image/*" />
            </div>-->
            <div>
                <button
                    class="bg-pink-600 px-2 py-1 rounded-md text-sm items-center text-white cursor-pointer hover:bg-pink-500 duration-150">Sign
                    Up</button>
            </div>

            <div class="text-xs text-gray-700 dark:text-white">
                Have you already gotten an account?
                <RouterLink to="/signin" class="text-pink-600">Sign In</RouterLink>
            </div>
        </Form>
    </div>
</template>