"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar/Navbar";

export default function AuthNavbar() {
    const [isLogged, setIsLogged] = useState(null);
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      setIsLogged(!!token);
    }, []);
  
    if (isLogged === null) return null;
  
    return <>{isLogged && <Navbar />}</>;
  }