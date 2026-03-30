import { Link, usePage } from "@/lib/inertia-mock";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Globe, Menu, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  // Inertia normally gives url via usePage().url
  const { url } = usePage();
  // We still use wouter's location for the mock link active state logic inside the component if needed, 
  // but let's try to stick to Inertia patterns where possible.
  // In real Inertia, you check window.location or usePage().url
  const [location] = useLocation();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const navItems = [
    { key: 'home', href: '/' },
    { key: 'universities', href: '/universities' },
    { key: 'colleges', href: '/colleges' },
    { key: 'projects', href: '/projects' },
    { key: 'guidance', href: '/guidance' },
    { key: 'compare', href: '/compare' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <GraduationCap className="h-8 w-8 text-secondary" />
            <span>UniGuide</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.key} href={item.href} className={`text-sm font-medium transition-colors hover:text-primary ${
              location === item.href ? "text-primary font-bold" : "text-muted-foreground"
            }`}>
              {t(item.key)}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ar')}>العربية</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href={localStorage.getItem('isLoggedIn') === 'true' ? '#' : '/login'}>
            <Button className="hidden md:flex bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold">
              {localStorage.getItem('isLoggedIn') === 'true' ? t('dashboard') : t('login')}
            </Button>
          </Link>
          
          {/* Mobile Menu Trigger */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {navItems.map((item) => (
                <DropdownMenuItem key={item.key} asChild>
                  <Link href={item.href} className="w-full font-medium">
                    {t(item.key)}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem asChild>
                <Link href={localStorage.getItem('isLoggedIn') === 'true' ? '#' : '/login'} className="w-full font-bold text-primary">
                  {localStorage.getItem('isLoggedIn') === 'true' ? t('dashboard') : t('login')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
