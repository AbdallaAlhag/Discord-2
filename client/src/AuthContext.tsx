// AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextProps {
  userId: number | null;
  setUserId: (id: number | null) => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<number | null>(() => {
    // Get initial userId from localStorage
    const storedUserId = localStorage.getItem("userId");
    return storedUserId ? Number(storedUserId) : null; // Convert to number if exists
  });

  // Update localStorage whenever userId changes
  useEffect(() => {
    if (userId !== null) {
      localStorage.setItem("userId", userId.toString()); // Store as string
    } else {
      localStorage.removeItem("userId"); // Clear if userId is null
    }
  }, [userId]);

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
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
