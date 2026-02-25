import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle, Phone, ExternalLink, HeadphonesIcon } from 'lucide-react';
import { SiTelegram, SiWhatsapp } from 'react-icons/si';

const SUPPORT_CHANNELS = [
  {
    id: 'email',
    title: 'Email Support',
    subtitle: 'Get help via email',
    value: 's10361781@gmail.com',
    icon: Mail,
    brandIcon: null,
    action: () => window.open('mailto:s10361781@gmail.com', '_blank'),
    buttonLabel: 'Send Email',
    buttonClass: 'bg-red-500 hover:bg-red-600 text-white',
    cardClass: 'border-red-100 bg-red-50/50',
    iconClass: 'bg-red-100 text-red-500',
  },
  {
    id: 'telegram',
    title: 'Telegram Support',
    subtitle: 'Chat with us on Telegram',
    value: '@supergroearn',
    icon: MessageCircle,
    brandIcon: SiTelegram,
    action: () => window.open('https://t.me/supergroearn', '_blank'),
    buttonLabel: 'Open Telegram',
    buttonClass: 'bg-[#0088cc] hover:bg-[#006fa8] text-white',
    cardClass: 'border-blue-100 bg-blue-50/50',
    iconClass: 'bg-blue-100 text-[#0088cc]',
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp Support',
    subtitle: 'Message us on WhatsApp',
    value: '+91 63710 78941',
    icon: Phone,
    brandIcon: SiWhatsapp,
    action: () => window.open('https://wa.me/916371078941', '_blank'),
    buttonLabel: 'Open WhatsApp',
    buttonClass: 'bg-[#25D366] hover:bg-[#1da851] text-white',
    cardClass: 'border-green-100 bg-green-50/50',
    iconClass: 'bg-green-100 text-[#25D366]',
  },
];

export default function SupportPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald rounded-xl flex items-center justify-center">
          <HeadphonesIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Support Center</h1>
          <p className="text-sm text-gray-500">We're here to help you</p>
        </div>
      </div>

      {/* Hero */}
      <Card className="bg-gradient-to-br from-emerald to-emerald-dark border-0 text-white">
        <CardContent className="p-5 text-center">
          <HeadphonesIcon className="w-10 h-10 text-gold mx-auto mb-2" />
          <h2 className="font-bold text-lg">Need Help?</h2>
          <p className="text-emerald-100 text-sm mt-1">
            Our support team is available to assist you with any questions or issues.
          </p>
        </CardContent>
      </Card>

      {/* Support Channels */}
      <div className="space-y-3">
        {SUPPORT_CHANNELS.map((channel) => {
          const Icon = channel.icon;
          const BrandIcon = channel.brandIcon;

          return (
            <Card key={channel.id} className={`border ${channel.cardClass} shadow-sm`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 ${channel.iconClass} rounded-xl flex items-center justify-center`}>
                    {BrandIcon ? (
                      <BrandIcon className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{channel.title}</h3>
                    <p className="text-xs text-gray-500">{channel.subtitle}</p>
                  </div>
                </div>

                <div className="bg-white/70 rounded-lg p-2.5 mb-3">
                  <p className="text-sm font-medium text-gray-700 font-mono">{channel.value}</p>
                </div>

                <Button
                  onClick={channel.action}
                  className={`w-full ${channel.buttonClass} font-medium text-sm h-9`}
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-2" />
                  {channel.buttonLabel}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Response Time */}
      <Card className="border border-emerald/20 bg-emerald/5">
        <CardContent className="p-4">
          <h3 className="font-semibold text-emerald-dark text-sm mb-2">Response Times</h3>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Email Support</span>
              <span className="font-medium text-gray-800">24–48 hours</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Telegram Support</span>
              <span className="font-medium text-gray-800">2–6 hours</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">WhatsApp Support</span>
              <span className="font-medium text-gray-800">1–4 hours</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
