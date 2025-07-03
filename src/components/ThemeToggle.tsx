import React from 'react';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    // 切换主题：如果当前是暗色则切换到亮色，否则切换到暗色
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
      onClick={toggleTheme}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
};

export default ThemeToggle;
