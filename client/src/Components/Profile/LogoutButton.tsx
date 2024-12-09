import axios from "axios";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function LogoutButton({ className }: { className: string }) {
  const userId = useAuth();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    try {
      axios.post(
        `${VITE_API_BASE_URL}/auth/logoutStatus/${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Marked offline");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Link to="/login">
      <button
        onClick={() => logout()}
        className={`text-gray-400 hover:text-white transition-colors ${className}`}
      >
        <LogOut size={20} />
      </button>
    </Link>
  );
}
