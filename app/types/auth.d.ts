declare module '#auth-utils' {  
    interface UserSession {
      id: string;
      first_name: string;
      last_name: string;
    }

    interface UserSession {
        roles: string[];
    }
  }
  
  export {}