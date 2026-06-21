const API_BASE_URL =
  typeof window !== "undefined"
    ? window.location.protocol + "//" + window.location.hostname + ":3001/api/v1"
    : "http://localhost:3001/api/v1";

const getHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("constructos_access_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const api = {
  get: async (endpoint: string, customHeaders = {}) => {
    const res: any = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { ...getHeaders(), ...customHeaders },
    });
    if (!res.ok) throw new Error("API Request Failed");
    return { data: await res.json() };
  },
  post: async (endpoint: string, data: any, customHeaders = {}) => {
    const res: any = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { ...getHeaders(), ...customHeaders },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("API Request Failed");
    return { data: await res.json() };
  },
  put: async (endpoint: string, data: any, customHeaders = {}) => {
    const res: any = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: { ...getHeaders(), ...customHeaders },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("API Request Failed");
    return { data: await res.json() };
  },
  patch: async (endpoint: string, data: any, customHeaders = {}) => {
    const res: any = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: { ...getHeaders(), ...customHeaders },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("API Request Failed");
    return { data: await res.json() };
  },
  delete: async (endpoint: string, customHeaders = {}) => {
    const res: any = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: { ...getHeaders(), ...customHeaders },
    });
    if (!res.ok) throw new Error("API Request Failed");
    return { data: await res.json() };
  },
};

export default api;
