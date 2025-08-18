export default defineNuxtRouteMiddleware(async () => {
    const session = useUserSession();

    console.log("hey there from auth middleware", session);
    
    

    if(!session.loggedIn.value) {
        return navigateTo('/auth/login');
    }
})