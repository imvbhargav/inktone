import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
const signIn = async () => {
  const data = await authClient.signIn.social({
    provider: "github",
  });
};

const { useSession, signOut } = authClient;
export { useSession, signOut, signIn };
