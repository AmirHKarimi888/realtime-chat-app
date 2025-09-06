import { defineStore } from 'pinia'
import { ref } from 'vue'
import httpService from "@/server";
import useGenerateAvatar from '@/composables/useGenerateAvatar';

export const useUsersStore = defineStore('users', () => {
    const signedInUser = ref("");

    const signUp = async (values) => {
        await httpService.post("users", {
            username: values?.username,
            password: values?.password,
            displayName: values?.displayName,
            avatar: useGenerateAvatar(values?.username).avatarUrl
        })
            .then(async () => {
                await httpService.post("login", {
                    username: values?.username,
                    password: values?.password
                })
                    .then(async () => {
                        httpService.get("users/me")
                            .then(res => {
                                signedInUser.value = res.data;
                            })
                    })
            })
    }

    const signIn = async (values) => {
        await httpService.post("login", {
            username: values?.username,
            password: values?.password
        })
            .then(async () => {
                httpService.get("users/me")
                    .then(res => {
                        signedInUser.value = res.data;
                    })
            })
    }

    const signOut = async() => {
        await httpService.post('/logout')
        .catch(err => console.error(err.message))
    }

    return { signedInUser, signUp, signIn, signOut };
})
