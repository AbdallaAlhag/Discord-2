import clsx from "clsx";

interface TabBarProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex border-b border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={clsx(
            "px-4 py-2 text-sm font-medium",
            activeTab === tab
              ? "text-white border-b-2 border-blue-500"
              : "text-gray-400 hover:text-gray-200"
          )}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
