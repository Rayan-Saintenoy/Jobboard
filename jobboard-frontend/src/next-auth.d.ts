import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken: string;
      isAdmin: boolean;
      isRecruiter: boolean;
    };
  }

  interface User {
    accessToken: string;
    isAdmin: boolean;
    isRecruiter: boolean;
  }
}
