import { Link, useRouter } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useState } from 'react';
import { Menu, X, Home, CheckSquare, Users, Wallet, Shield, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navigation() {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin } = useIsCallerAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    router.navigate({ to: '/login' });
  };

  const navLinks = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/tasks', label: 'Daily Tasks', icon: CheckSquare },
    { to: '/referral', label: 'Referral', icon: Users },
    { to: '/wallet', label: 'Wallet', icon: Wallet },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: Shield }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-emerald shadow-lg">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2">
            <img
              src="/assets/generated/super-gro-logo.dim_256x256.png"
              alt="Super Gro"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-bold text-lg text-white tracking-tight">Super Gro</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-emerald-100 hover:bg-emerald-700 hover:text-white transition-colors"
                activeProps={{ className: 'bg-emerald-700 text-white' }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1 text-emerald-100 hover:text-white hover:bg-emerald-700"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-emerald-100 hover:bg-emerald-700"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-3 border-t border-emerald-700">
            <nav className="flex flex-col gap-1 pt-2">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-emerald-100 hover:bg-emerald-700 hover:text-white transition-colors"
                  activeProps={{ className: 'bg-emerald-700 text-white' }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-emerald-100 hover:bg-emerald-700 hover:text-white transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
