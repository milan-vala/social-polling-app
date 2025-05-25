"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authUtils } from "@/utils/auth";

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    if (!authUtils.isLoggedIn()) {
      router.push("/auth/login");
    }
  }, [router]);

  return authUtils.getUser();
}
