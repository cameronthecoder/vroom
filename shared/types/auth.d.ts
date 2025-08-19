declare module '#auth-utils' {  
    interface User {
      id: string;
      first_name: string;
      last_name: string;
    }

    interface UserSession {
        roles: string[];
    }
  }
  
  export {}