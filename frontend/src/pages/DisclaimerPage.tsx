import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const DISCLAIMERS = [
  {
    title: 'No Guaranteed Income',
    content: 'This app does not provide guaranteed income. Earnings are entirely dependent on task completion, user activity, and admin approval. Past performance does not guarantee future results.',
  },
  {
    title: 'Performance-Based Earnings',
    content: 'Earnings are performance-based and depend on user participation. The amount you earn is directly proportional to the tasks you complete and the referrals you bring in.',
  },
  {
    title: 'Voluntary Participation',
    content: 'User participation is completely voluntary. You may stop using the platform at any time. The platform is not responsible for any financial decisions made based on projected earnings.',
  },
];

export default function DisclaimerPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Disclaimer</h1>
          <p className="text-sm text-gray-500">Important information about Super Gro</p>
        </div>
      </div>

      <Card className="border border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <p className="text-xs text-amber-800 font-medium">
            ⚠️ Please read this disclaimer carefully before using the Super Gro platform.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {DISCLAIMERS.map((item, i) => (
          <Card key={i} className="border border-gray-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-amber-700 text-xs font-bold">{i + 1}</span>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">{item.title}</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed pl-8">{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Super Gro is a task-based reward platform. It is not a financial institution, investment platform,
            or guaranteed income scheme. Always make informed decisions and never invest money you cannot afford to lose.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
