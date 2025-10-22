import { auth } from "@/lib/auth";
import SettingsClient from "@/components/SettingsClient";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();

  const session = await auth.api.getSession({
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  return <SettingsClient initialSession={session} />;
}
