import type {DB} from '../../types/db';

type User = DB['users'];

export const useAuthStore = defineStore('auth', () => {
    const user =  ref(null as User | null);


    const isAuthenticated = () => !!user.value;

    const setUser = (newUser: User) => {
        user.value = newUser;
    }

    const logout = () => {
        user.value = null;
    }

    return {isAuthenticated, setUser, logout};
});