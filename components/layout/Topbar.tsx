'use client';

import { Bell, Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebarStore } from '@/store/sidebarStore';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';

export function Topbar() {
  const { toggle } = useSidebarStore();
  const { isDark, toggle: toggleTheme } = useThemeStore();
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-gray-500 dark:text-gray-400"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 dark:text-gray-400"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <div className="w-8 h-8 bg-[#468DD6] rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user?.name?.[0] || 'A'}
          </span>
        </div>
      </div>
    </header>
  );
}
