"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type LogoutButtonProps = Readonly<{
  redirectUrl?: string;
}>;

export default function LogoutButton({ redirectUrl = "/sign-in" }: LogoutButtonProps) {
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn, sessionId } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      await signOut({
        sessionId: sessionId ?? undefined,
        redirectUrl,
      });
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      disabled={isSigningOut}
    >
      {isSigningOut ? "Logging out..." : "Log Out"}
    </Button>
  );
}
