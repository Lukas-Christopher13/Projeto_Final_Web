"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useRequireAuth(role) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (!token || !savedUser) {
      router.push("/login");
      return;
    }

    if (role) {
      const user = JSON.parse(savedUser);
      if (user.role !== role) {
        router.push("/dashboard");
      }
    }
  }, [router, role]);
}
