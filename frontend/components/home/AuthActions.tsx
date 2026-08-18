"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface AuthActionsProps {
  className?: string;
  fullWidth?: boolean;
}

const subscribe = () => () => {};
const getServerSnapshot = () => false;
const getAuthSnapshot = () => Boolean(localStorage.getItem("token"));

export default function AuthActions({
  className,
  fullWidth = false,
}: AuthActionsProps) {
  const isAuthenticated = useSyncExternalStore(
    subscribe,
    getAuthSnapshot,
    getServerSnapshot,
  );

  if (isAuthenticated) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button asChild className={cn(fullWidth && "w-full")}>
          <Link href="/dashboard">
            Open dashboard
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        fullWidth && "grid w-full grid-cols-2",
        className,
      )}
    >
      <Button asChild className={cn(fullWidth && "w-full")}>
        <Link href="/register">Create account</Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className={cn(fullWidth && "w-full")}
      >
        <Link href="/login">Log in</Link>
      </Button>
    </div>
  );
}
