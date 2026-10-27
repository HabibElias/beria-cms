import type User from "../models/User";
import apiClient from "../services/Apiclient";
import {
  isAxiosError,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextType {
  updateUserProfile: (profile: Pick<User, "name" | "email">) => void;
  logout: () => void;
  fetchState: "notReady" | "ready" | "registering" | "logging" | "applying";
  login: (email: string, password: string) => Promise<void>;
  registerAccount: (attributes: {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  user?: User;
}

// Extend InternalAxiosRequestConfig to include _retry
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface Response {
  status: boolean;
  token?: string;
  message?: string;
  user?: User;
  error?: string;
  errors?: Record<string, string[]>;
}

function loginErrorMessage(error: unknown): string {
  if (!isAxiosError<Response>(error))
    return "Sign-in failed. Please try again.";
  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return "Sign-in timed out. Please try again.";
  }
  if (!error.response) return "Unable to reach the server. Please try again.";
  if (error.response.status === 429)
    return "Too many sign-in attempts. Please wait and try again.";
  if (error.response.status >= 500)
    return "The server is unavailable. Please try again shortly.";

  const data = error.response.data;
  const validationError = Object.values(data?.errors ?? {})
    .flat()
    .find((value) => typeof value === "string");
  if (validationError) return validationError;
  if (typeof data?.message === "string" && data.message) return data.message;
  if (typeof data?.error === "string" && data.error) return data.error;
  if (error.response.status === 401) return "Incorrect email or password.";
  if (error.response.status === 403)
    return "You do not have permission to sign in.";
  return "Sign-in failed. Please try again.";
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext must be used within AuthProvider");
  return context;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<boolean | null>(null);
  const loginInFlight = useRef(false);

  const [fetchState, setFetchState] = useState<
    "notReady" | "logging" | "ready" | "registering" | "applying"
  >("notReady");

  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${savedToken}`;
    } else {
      delete apiClient.defaults.headers.common["Authorization"];
    }
    return savedToken ?? null;
  });

  const [user, setUser] = useState<User>();

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(undefined);
    localStorage.removeItem("auth_token");
    delete apiClient.defaults.headers.common["Authorization"];
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      if (loginInFlight.current) return;
      loginInFlight.current = true;
      setFetchState("logging");
      const toastId = toast.loading("Signing in…");
      try {
        const response = await apiClient.post<Response>(
          "/login",
          {
            email,
            password,
          },
          { timeout: 60_000 },
        );
        if (
          response.data?.status === true &&
          response.data.token &&
          response.data.user
        ) {
          const token = response.data.token;
          setToken(token);
          localStorage.setItem("auth_token", token);
          apiClient.defaults.headers.common["Authorization"] =
            `Bearer ${token}`;
          setUser(response.data.user);
          toast.success("Signed in successfully.", { id: toastId });
        } else {
          clearSession();
          toast.error(
            response.data?.message ||
              response.data?.error ||
              "The server returned an unexpected sign-in response. Please try again.",
            { id: toastId },
          );
        }
      } catch (error) {
        clearSession();
        toast.error(loginErrorMessage(error), { id: toastId });
      } finally {
        loginInFlight.current = false;
        setFetchState("ready");
      }
    },
    [clearSession],
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post<Response>("/logout");
    } catch (err) {
      console.error(err);
    } finally {
      clearSession();
      window.location.href = "/";
    }
  }, [clearSession]);

  const registerAccount = useCallback(
    async (attributes: {
      name: string;
      email: string;
      phone: string;
      password: string;
      password_confirmation: string;
    }) => {
      if (loginInFlight.current) return;
      loginInFlight.current = true;
      setFetchState("registering");
      const toastId = toast.loading("Creating your account…");
      try {
        const response = await apiClient.post<Response>(
          "/register",
          attributes,
          { timeout: 60_000 },
        );
        if (
          !response.data.status ||
          !response.data.token ||
          !response.data.user
        ) {
          throw new Error(
            "The server returned an incomplete account response.",
          );
        }
        setToken(response.data.token);
        localStorage.setItem("auth_token", response.data.token);
        apiClient.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
        setUser(response.data.user);
        toast.success("Your account is ready. Welcome to the library!", {
          id: toastId,
        });
      } catch (error) {
        clearSession();
        toast.error(
          isAxiosError(error)
            ? loginErrorMessage(error)
                .replace("Sign-in", "Account creation")
                .replace("sign-in", "account creation")
            : "We couldn’t create your account. Please try again.",
          { id: toastId },
        );
      } finally {
        loginInFlight.current = false;
        setFetchState("ready");
      }
    },
    [clearSession],
  );

  useLayoutEffect(() => {
    if (!mounted && !ref.current) {
      if (!localStorage.getItem("auth_token")) {
        ref.current = true;
        setMounted(true);
        setFetchState("ready");
        return;
      }
      const fetchMe = async () => {
        setFetchState("notReady");
        try {
          const response = await apiClient.post<Response>(
            "/refresh",
            undefined,
            { timeout: 60_000 },
          );
          if (
            response.data.status &&
            response.data.token &&
            response.data.user
          ) {
            setToken(response.data.token);
            localStorage.setItem("auth_token", response.data.token);
            apiClient.defaults.headers.common["Authorization"] =
              `Bearer ${response.data.token}`;
            setUser(response.data.user);
          } else {
            clearSession();
          }
        } catch {
          clearSession();
          toast.error(
            "We couldn't restore your session. Please sign in again.",
          );
        } finally {
          setFetchState("ready");
        }
      };
      fetchMe();
      setMounted(true);
      ref.current = true;
    }
  }, [mounted, clearSession]);

  // ✅ Attach token to every Axios request
  useLayoutEffect(() => {
    const authInterceptor = apiClient.interceptors.request.use(
      (config: ExtendedAxiosRequestConfig) => {
        if (!config._retry && token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        config.withCredentials = true;
        return config;
      },
    );
    return () => {
      apiClient.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  // Refresh expired sessions, while allowing auth responses and permission errors through.
  useEffect(() => {
    let isRefreshing = false;
    const refreshInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;
        const isAuthRequest = /\/(login|register|refresh|logout)(?:\?|$)/.test(
          originalRequest?.url ?? "",
        );
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !isAuthRequest &&
          localStorage.getItem("auth_token") &&
          !originalRequest._retry &&
          !isRefreshing
        ) {
          isRefreshing = true;
          originalRequest._retry = true;
          try {
            const response = await apiClient.post<Response>(
              "/refresh",
              undefined,
              { timeout: 60_000 },
            );
            if (response.data.token) {
              setToken(response.data.token);
              localStorage.setItem("auth_token", response.data.token);
              apiClient.defaults.headers.common["Authorization"] =
                `Bearer ${response.data.token}`;
              originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
              return apiClient(originalRequest);
            }
            throw new Error("Session refresh failed");
          } catch {
            clearSession();
            toast.error("Your session has expired. Please sign in again.");
          } finally {
            isRefreshing = false;
          }
        }
        return Promise.reject(error);
      },
    );
    return () => {
      apiClient.interceptors.response.eject(refreshInterceptor);
    };
  }, [clearSession]);

  const updateUserProfile = useCallback(
    (profile: Pick<User, "name" | "email">) => {
      setUser((current) =>
        current
          ? { ...current, name: profile.name, email: profile.email }
          : current,
      );
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      logout,
      login,
      registerAccount,
      user,
      fetchState,
      updateUserProfile,
    }),
    [logout, login, registerAccount, user, fetchState, updateUserProfile],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
