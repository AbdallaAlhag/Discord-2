import { ReactNode } from "react";
import { clsx } from "clsx";
import { FiSearch } from "react-icons/fi";
import { RiCommunityLine } from "react-icons/ri";

interface NavLinkProps {
  children: ReactNode;
  href: string;
  isActive?: boolean;
}

const NavLink = ({ children, href, isActive = false }: NavLinkProps) => {
  return (
    <a
      href={href}
      className={clsx(
        "px-4 py-2 rounded-md transition-colors",
        isActive
          ? "text-white"
          : "text-gray-300 hover:text-white hover:bg-gray-700"
      )}
    >
      {children}
    </a>
  );
};

export const NavBar = () => {
  return (
    <nav className="bg-gray-900 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* <img src="/logo.svg" alt="Discord Logo" className="w-8 h-8" />{" "} */}
          <RiCommunityLine className="w-8 h-8 text-white" />
          <div className="flex space-x-2">
            <NavLink href="" isActive>
              Home
            </NavLink>
            <NavLink href="">Gaming</NavLink>
            <NavLink href="">Music</NavLink>
            <NavLink href="">Entertainment</NavLink>
            <NavLink href="">Science & Tech</NavLink>
            <NavLink href="">Education</NavLink>
            <NavLink href="">Student Hubs</NavLink>
          </div>{" "}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>{" "}
      </div>
    </nav>
  );
};
