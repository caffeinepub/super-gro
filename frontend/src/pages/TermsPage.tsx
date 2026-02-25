import { Card, CardContent } from '@/components/ui/card';
import { ScrollText } from 'lucide-react';

const TERMS = [
  'This platform provides task-based rewards only. Users earn by completing genuine tasks assigned by the platform.',
  'Users must complete tasks genuinely and honestly. Any form of cheating, automation, or misrepresentation is strictly prohibited.',
  'Multiple fake accounts are strictly prohibited. Each user is allowed only one account. Duplicate accounts will be permanently blocked.',
  'Withdrawal requests may be rejected if suspicious activity is detected. The platform reserves the right to investigate and withhold payments.',
  'All decisions made by the admin will be final and binding. Users agree to abide by all platform rules and admin decisions.',
];

export default function TermsPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald rounded-xl flex items-center justify-center">
          <ScrollText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Terms & Conditions</h1>
          <p className="text-sm text-gray-500">Super Gro – Daily Task Earn Pro</p>
        </div>
      </div>

      <Card className="border border-emerald/20 bg-emerald/5">
        <CardContent className="p-4">
          <p className="text-xs text-emerald-dark font-medium">
            By using Super Gro, you agree to the following terms and conditions. Please read them carefully.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {TERMS.map((term, i) => (
          <Card key={i} className="border border-gray-100 shadow-sm">
            <CardContent className="p-4 flex gap-3">
              <div className="w-6 h-6 bg-emerald rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">{i + 1}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{term}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <p className="text-xs text-amber-700">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-xs text-amber-600 mt-1">
            The company reserves the right to update these terms at any time without prior notice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
