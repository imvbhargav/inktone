"use client";

import LanguageSwitcher from "@/components/language-switcher";
import { ModeToggle } from "@/components/theme-toggle";
import {
  addnewrepo,
  appearance,
  authentication,
  languageFonts,
  languageText,
  loginText,
  logoutText,
  setting,
  theme,
} from "@/constants/i18n";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/store/language";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOutIcon, LucideGithub, GitBranch, X } from "lucide-react";
import { useState } from "react";

const { useSession, signOut } = authClient;

interface GitHubSectionProps {
  initialSession: {
    session: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string | null;
      userAgent?: string | null;
    };
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | null;
      emailVerified: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  } | null;
}

export function GitHubSection({ initialSession }: GitHubSectionProps) {
  const { data: session } = useSession();
  const { language } = useLanguage();

  const currentSession = session || initialSession;
  const [connectedRepos, setConnectedRepos] = useState<string[]>([]);

  if (!currentSession) {
    return (
      <Button
        className="rounded cursor-pointer w-full"
        onClick={() => authClient.signIn.social({ provider: "github" })}
      >
        <LucideGithub />
        {loginText[language]}
      </Button>
    );
  }

  const handleAddRepo = async () => {
    const repo = prompt("Enter GitHub repository (username/repo):");
    if (repo && !connectedRepos.includes(repo)) {
      setConnectedRepos([...connectedRepos, repo]);
      // Here you would make an API call to save the connection
    }
  };

  const handleRemoveRepo = (repoToRemove: string) => {
    setConnectedRepos(connectedRepos.filter((repo) => repo !== repoToRemove));
    // Here you would make an API call to remove the connection
  };

  return (
    <div className="space-y-3">
      {connectedRepos.length > 0 && (
        <div className="space-y-2">
          {connectedRepos.map((repo) => (
            <div
              key={repo}
              className="flex items-center justify-between gap-2 p-2 bg-card-foreground/5 rounded"
            >
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                <span className="text-sm font-mono">{repo}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleRemoveRepo(repo)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        variant="outline"
        className="rounded cursor-pointer w-full"
        onClick={handleAddRepo}
      >
        <GitBranch />
        {addnewrepo[language]}
      </Button>

      <Button
        variant="outline"
        className="rounded cursor-pointer w-full"
        onClick={() => signOut()}
      >
        <LogOutIcon />
        {logoutText[language]}
      </Button>
    </div>
  );
}

interface SettingsClientProps {
  initialSession: {
    session: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string | null;
      userAgent?: string | null;
    };
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | null;
      emailVerified: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  } | null;
}

export default function SettingsClient({
  initialSession,
}: SettingsClientProps) {
  const { language } = useLanguage();

  return (
    <div className={cn("mt-12 md:mt-0", languageFonts[language])}>
      <h1 className="p-4 text-2xl font-black border-b border-foreground/10 ">
        {setting[language]}
      </h1>
      <main className="md:p-4">
        <p className="px-6 text-lg font-semibold">{appearance[language]}</p>
        <div className="w-fit p-4 rounded flex flex-wrap gap-2">
          <div className="flex flex-col gap-4  border border-accent-foreground/10 p-4 rounded">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold px-2">{theme[language]}</p>
              <div className="bg-card-foreground/5 p-1 rounded">
                <ModeToggle />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4  border border-accent-foreground/10 p-4 rounded">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold px-2">
                {languageText[language]}
              </p>
              <div className="bg-card-foreground/5 p-1 rounded">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
        <p className="px-6 text-lg font-semibold">{authentication[language]}</p>
        <div className="p-4">
          <div className="max-w-md flex flex-col gap-4 border border-accent-foreground/10 p-4 rounded">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold px-4 font-anek-latin">
                GitHub
              </p>
              <div className="py-2 px-2 rounded">
                <GitHubSection initialSession={initialSession} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
