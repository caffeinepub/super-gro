import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Users, TrendingUp, Award, Info, MessageCircle, Send } from 'lucide-react';

const LEVEL_BONUSES = [
  { level: 1, members: 5, bonus: 1000 },
  { level: 2, members: 10, bonus: 5000 },
  { level: 3, members: 15, bonus: 10000 },
  { level: 4, members: 20, bonus: 25000 },
  { level: 5, members: 25, bonus: 50000 },
  { level: 6, members: 30, bonus: 100000 },
  { level: 7, members: 35, bonus: 150000 },
  { level: 8, members: 40, bonus: 170000 },
  { level: 9, members: 45, bonus: 200000 },
  { level: 10, members: 50, bonus: 500000 },
];

export default function ReferralPage() {
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();

  const principal = identity?.getPrincipal().toString() || '';
  const referralCode = profile?.referralCode ?? principal.slice(0, 8);
  const referralLink = `${window.location.origin}/#/login?ref=${referralCode}`;

  const directCount = 0;
  const teamSize = 0;
  const levelReached = 0;
  const directIncome = 0;
  const teamIncome = 0;

  const handleCopyReferral = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied!');
    } catch {
      toast.error('Failed to copy link');
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

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Referral & Team</h1>
        <p className="text-sm text-gray-500 mt-0.5">Grow your team and earn level bonuses</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Card className="border-0 bg-emerald/5">
          <CardContent className="p-3 text-center">
            <Users className="w-5 h-5 text-emerald mx-auto mb-1" />
            <div className="text-xl font-bold text-emerald-dark">{directCount}</div>
            <div className="text-xs text-gray-500">Direct Refs</div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gold/5">
          <CardContent className="p-3 text-center">
            <TrendingUp className="w-5 h-5 text-gold-dark mx-auto mb-1" />
            <div className="text-xl font-bold text-gold-dark">{teamSize}</div>
            <div className="text-xs text-gray-500">Team Size</div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-purple-50">
          <CardContent className="p-3 text-center">
            <Award className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <div className="text-xl font-bold text-purple-600">L{levelReached}</div>
            <div className="text-xs text-gray-500">Level</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-emerald to-emerald-dark border-0 text-white">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-emerald-100 mb-3">Income Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs text-emerald-200">Direct Income</div>
              <div className="text-xl font-bold text-gold mt-1">₹{directIncome.toLocaleString('en-IN')}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs text-emerald-200">Team Income</div>
              <div className="text-xl font-bold text-gold mt-1">₹{teamIncome.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-emerald/20">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Your Referral Link</h3>
          <div className="bg-gray-50 rounded-xl p-3 mb-3">
            <p className="text-xs text-gray-500 mb-1">Referral Code</p>
            <p className="font-mono font-bold text-emerald-dark text-sm break-all">{referralCode}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyReferral}
              className="border-emerald text-emerald hover:bg-emerald hover:text-white text-xs col-span-1"
            >
              <Copy className="w-3.5 h-3.5 mr-1" />
              Copy
            </Button>
            <Button
              size="sm"
              onClick={handleWhatsApp}
              className="bg-[#25D366] hover:bg-[#1da851] text-white text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1" />
              WhatsApp
            </Button>
            <Button
              size="sm"
              onClick={handleTelegram}
              className="bg-[#0088cc] hover:bg-[#006fa8] text-white text-xs"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              Telegram
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
          <Award className="w-4 h-4 text-gold-dark" />
          Level Bonus Structure
        </h3>
        <div className="space-y-2">
          {LEVEL_BONUSES.map(({ level, members, bonus }) => {
            const isEligible = teamSize >= members;
            const isClaimed = false;

            return (
              <Card
                key={level}
                className={`border transition-all ${isEligible ? 'border-emerald/30 bg-emerald/5' : 'border-gray-100'}`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isEligible ? 'bg-emerald text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        L{level}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {members} Members Required
                        </div>
                        <div className="text-xs text-gray-500">
                          {isEligible
                            ? 'Eligible!'
                            : `Need ${members - teamSize} more members`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-gold-dark font-bold text-sm">
                          ₹{bonus.toLocaleString('en-IN')}
                        </div>
                      </div>
                      {isClaimed ? (
                        <Badge className="bg-emerald/10 text-emerald border-emerald/20 text-xs">
                          Claimed
                        </Badge>
                      ) : isEligible ? (
                        <Button
                          size="sm"
                          className="bg-gold hover:bg-gold-dark text-white text-xs h-7 px-3"
                          onClick={() => toast.info('Level bonus claiming coming soon!')}
                        >
                          Claim
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-xs text-gray-400">
                          Locked
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-100">
        <CardContent className="p-3 flex gap-2">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-700">
            <strong>Direct Referral Bonus: ₹1,000</strong> — Referral income is credited only after
            the referred user completes at least one daily task.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
