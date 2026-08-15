"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export function ProductTabs({ tabs }: { tabs: Tab[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="mt-16 bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-zinc-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-6 py-4 text-sm font-semibold tracking-wide whitespace-nowrap transition-colors border-b-2",
              activeTab === tab.id
                ? "border-primary text-primary bg-zinc-50"
                : "border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 md:p-8 min-h-[300px]">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "animate-in fade-in slide-in-from-bottom-2 duration-500",
              activeTab === tab.id ? "block" : "hidden"
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
