import { defineStore } from 'pinia'
import { ref } from 'vue'
import httpService from "@/server";
import useGenerateAvatar from '@/composables/useGenerateAvatar';

export const useUsersStore = defineStore('users', () => {
    const signedInUser = ref("");

    const signUp = async (values) => {
        try {
            if (values.avatarFile) {
                const fd = new FormData();
                fd.append('username', values.username);
                fd.append('password', values.password);
                if (values.displayName) fd.append('displayName', values.displayName);
                fd.append('defaultAvatar', useGenerateAvatar(values?.username).avatarUrl);
                fd.append('avatar', values.avatarFile);
                await httpService.post('users', fd);
            } else {
                await httpService.post('users', {
                    username: values.username,
                    password: values.password,
                    displayName: values.displayName || undefined,
                    defaultAvatar: useGenerateAvatar(values?.username).avatarUrl,
                    avatar: ''
                });
            }

            // 🔑 Login after signup
            await httpService.post("login", {
                username: values.username,
                password: values.password
            });

            const res = await httpService.get("users/me");
            signedInUser.value = res.data;

        } catch (err) {
            console.error(err.message);
        }
    };


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
            .catch(err => console.error(err.message))
    }

    const signOut = async () => {
        await httpService.post('logout')
            .then(() => signedInUser.value = "")
            .catch(err => console.error(err.message))
    }

    return { signedInUser, signUp, signIn, signOut };
})
