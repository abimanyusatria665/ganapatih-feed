import Router from "next/router";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  if (!token) {
    Router.replace("/?error=unauthorized");
    throw new Error("Token not found");
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    Router.replace("/?error=session_expired");
    throw new Error("Unauthorized - token invalid/expired");
  }

  return res;
}
