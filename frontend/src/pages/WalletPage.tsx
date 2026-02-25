import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Wallet, TrendingUp, ArrowDownCircle, AlertCircle,
  CheckCircle2, Clock, XCircle, Loader2, IndianRupee
} from 'lucide-react';

const MOCK_WALLET = {
  availableBalance: 0,
  totalEarnings: 0,
  totalWithdrawn: 0,
};

type WithdrawalRecord = {
  id: string;
  amount: number;
  upiId: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
};

export default function WalletPage() {
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);

  const wallet = MOCK_WALLET;

  const validateAmount = (val: string) => {
    const num = parseFloat(val);
    if (!val || isNaN(num)) {
      setAmountError('Please enter a valid amount');
      return false;
    }
    if (num < 500) {
      setAmountError('Minimum withdrawal amount is ₹500');
      return false;
    }
    if (num > wallet.availableBalance) {
      setAmountError('Insufficient balance');
      return false;
    }
    setAmountError('');
    return true;
  };

  const handleAmountChange = (val: string) => {
    setAmount(val);
    if (val) validateAmount(val);
    else setAmountError('');
  };

  const handleSubmitWithdrawal = async () => {
    if (!upiId.trim()) {
      toast.error('Please enter your UPI ID');
      return;
    }
    if (!validateAmount(amount)) return;

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));

    const newWithdrawal: WithdrawalRecord = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      upiId: upiId.trim(),
      status: 'pending',
      date: new Date().toLocaleDateString('en-IN'),
    };

    setWithdrawals(prev => [newWithdrawal, ...prev]);
    setSubmitted(true);
    setIsSubmitting(false);
    setUpiId('');
    setAmount('');
    toast.success('Withdrawal request submitted successfully!');
  };

  const statusConfig = {
    pending: { icon: Clock, color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Pending' },
    approved: { icon: CheckCircle2, color: 'bg-emerald/10 text-emerald border-emerald/20', label: 'Approved' },
    rejected: { icon: XCircle, color: 'bg-red-100 text-red-600 border-red-200', label: 'Rejected' },
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Wallet</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your earnings and withdrawals</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Card className="bg-gradient-to-br from-emerald to-emerald-dark border-0 text-white shadow-lg">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-gold" />
              <span className="text-emerald-100 text-sm">Available Balance</span>
            </div>
            <div className="text-4xl font-bold text-gold">
              ₹{wallet.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-emerald-200 text-xs mt-1">Min. withdrawal: ₹500</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="border border-emerald/20 bg-emerald/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald" />
                <span className="text-xs text-gray-500">Total Earnings</span>
              </div>
              <div className="text-xl font-bold text-emerald-dark">
                ₹{wallet.totalEarnings.toLocaleString('en-IN')}
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gold/20 bg-gold/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownCircle className="w-4 h-4 text-gold-dark" />
                <span className="text-xs text-gray-500">Total Withdrawn</span>
              </div>
              <div className="text-xl font-bold text-gold-dark">
                ₹{wallet.totalWithdrawn.toLocaleString('en-IN')}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald" />
            Withdraw Funds
          </h3>

          {submitted && (
            <div className="bg-emerald/10 border border-emerald/20 rounded-xl p-3 mb-4 flex gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-dark">
                <strong>Request submitted!</strong> Processing time: 12–48 hours after verification.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="upi" className="text-sm font-medium text-gray-700">
                UPI ID
              </Label>
              <Input
                id="upi"
                type="text"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                Amount (₹)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="500"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className={`pl-7 h-10 ${amountError ? 'border-red-400 focus:ring-red-400' : ''}`}
                  min={500}
                />
              </div>
              {amountError && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {amountError}
                </p>
              )}
              <p className="text-xs text-gray-400">Minimum withdrawal: ₹500</p>
            </div>

            <Button
              onClick={handleSubmitWithdrawal}
              disabled={isSubmitting || !upiId || !amount || !!amountError}
              className="w-full bg-emerald hover:bg-emerald-dark text-white font-semibold h-10"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
              ) : (
                'Submit Withdrawal Request'
              )}
            </Button>
          </div>

          <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-2.5 flex gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Withdrawal requests are processed within 12–48 hours after manual verification.
            </p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">Withdrawal History</h3>
        {withdrawals.length === 0 ? (
          <Card className="border border-dashed border-gray-200">
            <CardContent className="p-6 text-center">
              <Wallet className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No withdrawal requests yet</p>
              <p className="text-xs text-gray-400 mt-1">Your withdrawal history will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {withdrawals.map((w) => {
              const { icon: StatusIcon, color, label } = statusConfig[w.status];
              return (
                <Card key={w.id} className="border border-gray-100">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">
                          ₹{w.amount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{w.upiId}</div>
                        <div className="text-xs text-gray-400">{w.date}</div>
                      </div>
                      <Badge className={`${color} text-xs flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
