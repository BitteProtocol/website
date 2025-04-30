declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      username?: string;
      provider?: string;
    };
  }

  interface User {
    username?: string;
    provider?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username?: string;
    provider?: string;
  }
}
