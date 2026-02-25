import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Smartphone, KeyRound, Gift, Loader2, CheckCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';

type Step = 'mobile' | 'otp' | 'profile';

export default function LoginPage() {
  const { login, clear, loginStatus, identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const router = useRouter();

  const [step, setStep] = useState<Step>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [name, setName] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const isAuthenticated = !!identity;

  // Redirect if already authenticated and has profile
  useEffect(() => {
    if (isAuthenticated && profileFetched && userProfile !== null) {
      router.navigate({ to: '/home' });
    } else if (isAuthenticated && profileFetched && userProfile === null) {
      setStep('profile');
    }
  }, [isAuthenticated, profileFetched, userProfile, router]);

  const handleSendOTP = () => {
    if (!mobile || mobile.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setOtpSent(true);
    setStep('otp');
    toast.success('OTP sent! (Demo: enter any 6-digit code)');
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }
    // Simulated OTP - any 6-digit code accepted
    // Trigger Internet Identity login
    try {
      login();
    } catch (err) {
      toast.error('Login failed. Please try again.');
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        mobile: mobile ? [mobile] : [],
        referralCode: referralCode ? [referralCode] : [],
      } as any);
      toast.success('Profile saved! Welcome to Super Gro!');
      router.navigate({ to: '/home' });
    } catch (err) {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  // Handle login status changes
  useEffect(() => {
    if (loginStatus === 'success' && isAuthenticated) {
      // Profile check will happen via useGetCallerUserProfile
    }
  }, [loginStatus, isAuthenticated]);

  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-dark to-emerald">
        <div className="text-center text-white">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3" />
          <p className="text-emerald-100">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-dark via-emerald to-emerald-light px-4 py-8">
      {/* Logo */}
      <div className="mb-6 text-center">
        <img
          src="/assets/generated/super-gro-logo.dim_256x256.png"
          alt="Super Gro"
          className="w-20 h-20 rounded-full mx-auto mb-3 shadow-xl border-2 border-gold"
        />
        <h1 className="text-2xl font-bold text-white">Super Gro</h1>
        <p className="text-emerald-100 text-sm mt-1">Daily Task Earn Pro</p>
      </div>

      <Card className="w-full max-w-sm shadow-2xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-emerald-dark text-xl">
            {step === 'mobile' && 'Welcome Back'}
            {step === 'otp' && 'Verify OTP'}
            {step === 'profile' && 'Complete Profile'}
          </CardTitle>
          <CardDescription className="text-center text-sm">
            {step === 'mobile' && 'Enter your mobile number to continue'}
            {step === 'otp' && `OTP sent to +91 ${mobile}`}
            {step === 'profile' && 'Tell us your name to get started'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Step 1: Mobile Number */}
          {step === 'mobile' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">
                  Mobile Number
                </Label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-600 font-medium">
                    +91
                  </span>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1"
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral" className="text-sm font-medium text-gray-700">
                  Referral Code <span className="text-gray-400 font-normal">(Optional)</span>
                </Label>
                <div className="relative">
                  <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="referral"
                    type="text"
                    placeholder="Enter referral code"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Button
                onClick={handleSendOTP}
                className="w-full bg-emerald hover:bg-emerald-dark text-white font-semibold py-2.5"
                disabled={mobile.length < 10}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Send OTP
              </Button>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 block text-center">
                  Enter 6-digit OTP
                </Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-xs text-center text-gray-500">
                  Demo mode: Enter any 6-digit code
                </p>
              </div>

              <Button
                onClick={handleVerifyOTP}
                className="w-full bg-emerald hover:bg-emerald-dark text-white font-semibold py-2.5"
                disabled={otp.length !== 6 || loginStatus === 'logging-in'}
              >
                {loginStatus === 'logging-in' ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</>
                ) : (
                  <><KeyRound className="w-4 h-4 mr-2" /> Verify & Login</>
                )}
              </Button>

              <button
                onClick={() => { setStep('mobile'); setOtp(''); }}
                className="w-full text-sm text-emerald hover:underline text-center"
              >
                ← Change mobile number
              </button>
            </>
          )}

          {/* Step 3: Profile Setup */}
          {step === 'profile' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Your Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <Button
                onClick={handleSaveProfile}
                className="w-full bg-emerald hover:bg-emerald-dark text-white font-semibold py-2.5"
                disabled={!name.trim() || saveProfile.isPending}
              >
                {saveProfile.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : (
                  <><CheckCircle className="w-4 h-4 mr-2" /> Get Started</>
                )}
              </Button>
            </>
          )}

          {/* Terms notice */}
          <p className="text-xs text-center text-gray-500 pt-2">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-emerald hover:underline font-medium">
              Terms & Conditions
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
