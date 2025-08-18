import {defineStore} from 'pinia';
import {ref} from 'vue';


export const useAuthStore = defineStore('auth', () => {
    const user =  ref(null);
    const token = ref(null);


    const isAuthenticated = () => !!token.value;

    const setUser = (newUser) => {
        user.value = newUser;
    }
    const setToken = (newToken) => {
        token.value = newToken;
    }

    const logout = () => {
        user.value = null;
        token.value = null;
    }

    return {isAuthenticated, setUser, setToken, logout};
});