import { createContext, useContext, useEffect, useState } from "react";
import http from "../api/http";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, role: "ADMIN" | "USER" }
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (!token) return setLoading(false);
        const { data } = await http.get("/me"); // 백엔드에서 유저/역할 반환
        setUser(data);
      } catch (_) {
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await http.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    const me = await http.get("/me");
    setUser(me.data);
    return me.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
