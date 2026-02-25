import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetAllTasks } from '../hooks/useQueries';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import {
  CheckSquare, Users, Wallet, Copy, MessageCircle, Send,
  TrendingUp, Star, ArrowRight, Coins
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: tasks } = useGetAllTasks();

  const principal = identity?.getPrincipal().toString() || '';
  const referralCode = profile?.referralCode ?? principal.slice(0, 8);
  const referralLink = `${window.location.origin}/#/login?ref=${referralCode}`;

  const handleCopyReferral = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied to clipboard!');
    } catch {
      toast.error('Failed to copy. Please copy manually.');
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Join Super Gro and earn daily! Use my referral link: ${referralLink}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleTelegram = () => {
    const text = encodeURIComponent(`Join Super Gro and earn daily!`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`, '_blank');
  };

  const displayName = profile?.name || 'User';

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Super Gro"
          className="w-full h-36 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-dark/80 to-transparent flex flex-col justify-center px-5">
          <p className="text-emerald-100 text-xs font-medium uppercase tracking-wider">Welcome back</p>
          {profileLoading ? (
            <Skeleton className="h-7 w-32 mt-1 bg-white/20" />
          ) : (
            <h1 className="text-white text-xl font-bold mt-0.5">{displayName} 👋</h1>
          )}
          <p className="text-emerald-100 text-xs mt-1">Daily Task Earn Pro</p>
        </div>
      </div>

      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-br from-emerald to-emerald-dark border-0 shadow-lg text-white">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-gold" />
              <span className="text-emerald-100 text-sm font-medium">Wallet Balance</span>
            </div>
            <Link to="/wallet">
              <Button variant="ghost" size="sm" className="text-gold hover:text-gold hover:bg-white/10 text-xs h-7 px-2">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="text-3xl font-bold text-gold">₹0.00</div>
          <p className="text-emerald-200 text-xs mt-1">Available for withdrawal</p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-gold" />
                <span className="text-emerald-100 text-xs">Direct Income</span>
              </div>
              <div className="text-lg font-bold text-gold">₹0</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-gold" />
                <span className="text-emerald-100 text-xs">Team Income</span>
              </div>
              <div className="text-lg font-bold text-gold">₹0</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/tasks">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-10 h-10 bg-emerald/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-emerald/20 transition-colors">
                <CheckSquare className="w-5 h-5 text-emerald" />
              </div>
              <div className="font-semibold text-gray-800 text-sm">Daily Tasks</div>
              <div className="text-xs text-gray-500 mt-0.5">Earn up to ₹1000/day</div>
            </div>
          </Link>

          <Link to="/wallet">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-gold/20 transition-colors">
                <Wallet className="w-5 h-5 text-gold-dark" />
              </div>
              <div className="font-semibold text-gray-800 text-sm">Withdraw</div>
              <div className="text-xs text-gray-500 mt-0.5">Min. ₹500</div>
            </div>
          </Link>

          <Link to="/referral">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div className="font-semibold text-gray-800 text-sm">My Team</div>
              <div className="text-xs text-gray-500 mt-0.5">10-level bonuses</div>
            </div>
          </Link>

          <Link to="/support">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
                <Star className="w-5 h-5 text-purple-500" />
              </div>
              <div className="font-semibold text-gray-800 text-sm">Support</div>
              <div className="text-xs text-gray-500 mt-0.5">24/7 help</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Referral Section */}
      <Card className="border border-emerald/20 shadow-sm">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald" />
            Share & Earn ₹1000
          </h3>

          {/* Referral Code Display */}
          <div className="bg-gray-50 rounded-xl p-3 mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Your Referral Code</p>
              <p className="font-mono font-bold text-emerald-dark text-sm">{referralCode}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyReferral}
              className="border-emerald text-emerald hover:bg-emerald hover:text-white text-xs"
            >
              <Copy className="w-3.5 h-3.5 mr-1" />
              Copy Link
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleWhatsApp}
              className="bg-[#25D366] hover:bg-[#1da851] text-white text-xs font-medium h-9"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
              WhatsApp
            </Button>
            <Button
              onClick={handleTelegram}
              className="bg-[#0088cc] hover:bg-[#006fa8] text-white text-xs font-medium h-9"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Telegram
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Task Rewards Preview */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 text-sm">Today's Rewards</h3>
            <Link to="/tasks" className="text-xs text-emerald hover:underline">View All</Link>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Daily Check-In', reward: '₹50', color: 'bg-emerald/10 text-emerald' },
              { label: 'Watch Video', reward: '₹100', color: 'bg-gold/10 text-gold-dark' },
              { label: 'Submit Screenshot', reward: '₹50', color: 'bg-blue-50 text-blue-600' },
              { label: 'Refer 1 Friend', reward: '₹1,000', color: 'bg-purple-50 text-purple-600' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-gray-700">{item.label}</span>
                <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${item.color}`}>
                  {item.reward}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
