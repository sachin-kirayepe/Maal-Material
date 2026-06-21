export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

const request = async (method: string, path: string, data?: any) => {
  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      // Mock auth header for testing
      Authorization: "Bearer test-token",
      "x-tenant-id": "025b5fe2-63ee-451a-9a63-47ab114fb231",
    },
  };
  if (data) options.body = JSON.stringify(data);
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }
  const responseData = await response.json();
  return { data: responseData };
};

const api = {
  get: (path: string) => request("GET", path),
  post: (path: string, data?: any) => request("POST", path, data),
  put: (path: string, data?: any) => request("PUT", path, data),
  patch: (path: string, data?: any) => request("PATCH", path, data),
  delete: (path: string) => request("DELETE", path),
};
export default api;
