import { useAuth } from "@clerk/react";
import { setAuthInterceptor } from "./api";

export default function AuthProvider({ children }) {
  const { getToken } = useAuth();

  // Set on every render so _getToken is always current
  setAuthInterceptor(getToken);

  return children;
}
