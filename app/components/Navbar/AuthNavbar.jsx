"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar/Navbar";

export default function AuthNavbar() {
  const [isLogged, setIsLogged] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLogged(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  if (isLogged === null || !isLogged) return null;

  return <>{isLogged && <Navbar />}</>;
}
