import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

const RULES = [
  {
    title: 'Activity-Based Earnings',
    content: 'Earnings depend on daily activity and task completion. You must actively participate every day to maximize your income.',
    icon: '📊',
  },
  {
    title: 'No Guaranteed Fixed Income',
    content: 'There is no guaranteed fixed income. All earnings are variable and based on your performance and task completion rate.',
    icon: '⚠️',
  },
  {
    title: 'Account Integrity',
    content: 'Fake or duplicate accounts will be permanently blocked. Each user is allowed only one account per mobile number.',
    icon: '🚫',
  },
  {
    title: 'Admin Approval Required',
    content: 'Admin approval is required for all task rewards. Earnings are only credited to your wallet after admin verification.',
    icon: '✅',
  },
  {
    title: 'Minimum Withdrawal Limit',
    content: 'Withdrawal is allowed only after reaching the minimum limit of ₹500. Requests below this amount will be rejected.',
    icon: '💰',
  },
  {
    title: 'Rule Updates',
    content: 'The company reserves the right to update rules at any time. Users will be notified of significant changes through the app.',
    icon: '📋',
  },
];

export default function RulesPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Important Rules</h1>
          <p className="text-sm text-gray-500">Please follow these rules to avoid account suspension</p>
        </div>
      </div>

      <Card className="border border-emerald/20 bg-emerald/5">
        <CardContent className="p-4">
          <p className="text-xs text-emerald-dark font-medium">
            Violation of any of these rules may result in account suspension or permanent ban.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {RULES.map((rule, i) => (
          <Card key={i} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="text-2xl shrink-0">{rule.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">{rule.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{rule.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
