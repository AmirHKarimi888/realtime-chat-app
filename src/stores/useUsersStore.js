import { defineStore } from 'pinia'
import { ref } from 'vue'
import httpService from "@/server";
import useGenerateAvatar from '@/composables/useGenerateAvatar';
import { useSocketStore } from './useSocketStore';

export const useUsersStore = defineStore('users', () => {
    const signedInUser = ref(null);
    const users = ref([]);
    const chatRooms = ref([]);
    const loading = ref(false);

    const signUp = async (values) => {
        try {
            const fd = new FormData();
            fd.append('username', values.username);
            fd.append('password', values.password);
            fd.append('displayName', values.displayName || '');
            fd.append('defaultAvatar', useGenerateAvatar(values?.username).avatarUrl);

            if (values.avatarFile) {
                fd.append('avatar', values.avatarFile);
            } else {
                fd.append('avatar', '');
            }

            await httpService.post('users', fd, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            await signIn({
                username: values.username,
                password: values.password
            });

        } catch (err) {
            console.error(err.message);
            throw err;
        }
    };

    const signIn = async (values) => {
        try {
            await httpService.post("login", {
                username: values?.username,
                password: values?.password
            });

            await updateSignedInUser();

            // Connect socket after successful login
            const socketStore = useSocketStore();
            socketStore.connect();

            return signedInUser.value;
        } catch (err) {
            console.error(err.message);
            throw err;
        }
    };

    const signOut = async () => {
        try {
            await httpService.post('logout');

            // Disconnect socket
            const socketStore = useSocketStore();
            socketStore.disconnect();

            signedInUser.value = null;
            users.value = [];
            chatRooms.value = [];
        } catch (err) {
            console.error(err.message);
            throw err;
        }
    };

    const updateSignedInUser = async () => {
        try {
            const res = await httpService.get("users/me");
            signedInUser.value = res.data;
        } catch (err) {
            console.error('Error updating signed in user:', err);
            throw err;
        }
    };

    // Load user's chat rooms
    const loadChatRooms = async () => {
        try {
            loading.value = true;
            const response = await httpService.get('/users/chat-rooms');
            chatRooms.value = response.data;
            return chatRooms.value;
        } catch (err) {
            console.error('Error loading chat rooms:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Load all users (for search and discovery)
    const loadUsers = async () => {
        try {
            loading.value = true;
            const response = await httpService.get('users');
            users.value = response.data;
            return users.value;
        } catch (err) {
            console.error(err.message);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Search users
    const searchUsers = async (query) => {
        try {
            if (!query || query.length < 2) {
                return [];
            }

            const response = await httpService.get(`/users/search?q=${encodeURIComponent(query)}`);
            return response.data;
        } catch (err) {
            console.error(err.message);
            return [];
        }
    };

    // Get user by ID
    const getUserById = async (userId) => {
        try {
            // First check if we already have this user in our list
            const existingUser = users.value.find(u => u.id === userId);
            if (existingUser) {
                return existingUser;
            }

            // If not, fetch from server
            const response = await httpService.get(`/users/${userId}`);
            return response.data;
        } catch (err) {
            console.error(err.message);
            throw err;
        }
    };

    return {
        signedInUser,
        users,
        chatRooms,
        loading,
        signUp,
        signIn,
        signOut,
        updateSignedInUser,
        loadChatRooms,
        loadUsers,
        searchUsers,
        getUserById
    };
});