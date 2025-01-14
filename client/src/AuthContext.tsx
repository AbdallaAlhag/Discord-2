// AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextProps {
  userId: string | null;
  setUserId: (id: string | null) => void;
  userName: string | null;
  setUserName: (name: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(() => {
    // Get initial userId from localStorage
    const storedUserId = localStorage.getItem("userId");
    return storedUserId || null; // Convert to number if exists
  });
  const [userName, setUserName] = useState<string | null>(() => {
    // Get initial userName from localStorage
    const storedUserName = localStorage.getItem("username");
    return storedUserName || null;
  });

  // Update localStorage whenever userId changes
  useEffect(() => {
    if (userId !== null) {
      localStorage.setItem("userId", userId.toString()); // Store as string
    } else {
      localStorage.removeItem("userId"); // Clear if userId is null
    }
    if (userName !== null) {
      localStorage.setItem("username", userName); // Store as string
    } else {
      localStorage.removeItem("userName"); // Clear if userName is null
    }
  }, [userId, userName]);

  return (
    <AuthContext.Provider value={{ userId, setUserId, userName, setUserName }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
