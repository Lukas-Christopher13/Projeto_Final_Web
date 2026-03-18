"use client";

export function getAuthHeaders(includeJson = false) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = {};
  if (includeJson) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}
