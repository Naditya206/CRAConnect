"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Settings } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Admin", href: "/admin", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-white/90 backdrop-blur-lg border-t border-gray-100 flex justify-around py-3.5 px-6 z-50 shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.08)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1.5 transition-colors ${
              isActive ? "text-primary-600" : "text-gray-400 hover:text-gray-900"
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-2"}`} />
            <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
