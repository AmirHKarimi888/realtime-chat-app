import { defineStore } from 'pinia'
import { ref } from 'vue'
import httpService from "@/server";
import useGenerateAvatar from '@/composables/useGenerateAvatar';

export const useUsersStore = defineStore('users', () => {
    const signedInUser = ref("");

    const signUp = async (values) => {
        try {
            const fd = new FormData();
            fd.append('username', values.username);
            fd.append('password', values.password);
            fd.append('displayName', values.displayName || '');
            fd.append('defaultAvatar', useGenerateAvatar(values?.username).avatarUrl);
            
            // Always append avatar field, even if it's empty or a file
            if (values.avatarFile) {
                fd.append('avatar', values.avatarFile);
            } else {
                fd.append('avatar', ''); // Send empty string if no file
            }

            await httpService.post('users', fd, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // 🔑 Login after signup
            await httpService.post("login", {
                username: values.username,
                password: values.password
            });

            const res = await httpService.get("users/me");
            signedInUser.value = res.data;

        } catch (err) {
            console.error(err.message);
            throw err; // Important: re-throw the error so the component can handle it
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