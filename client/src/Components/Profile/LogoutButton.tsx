import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function LogoutButton({ className }: { className: string }) {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
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
