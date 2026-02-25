import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'super-gro');

  return (
    <footer className="bg-emerald-dark text-emerald-100 py-6 mt-auto">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
          <Link to="/terms" className="hover:text-gold transition-colors">Terms & Conditions</Link>
          <Link to="/disclaimer" className="hover:text-gold transition-colors">Disclaimer</Link>
          <Link to="/rules" className="hover:text-gold transition-colors">Important Rules</Link>
          <Link to="/support" className="hover:text-gold transition-colors">Support</Link>
        </div>
        <div className="text-center text-xs text-emerald-300">
          <p className="mb-1">© {year} Super Gro. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1">
            Built with <Heart className="w-3 h-3 text-gold fill-gold" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
