import { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';
import Link from 'next/link';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'My Roadmap', href: '/roadmap' },
  { name: 'Practice', href: '/module/arrays' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out"
      style={{
        padding: scrolled ? '10px 32px' : '14px 40px',
        backdropFilter: scrolled ? 'blur(60px)' : 'blur(40px)',
        WebkitBackdropFilter: scrolled ? 'blur(60px)' : 'blur(40px)',
      }}
    >
      <div
        className="glass-nav flex items-center gap-8"
        style={{
          borderRadius: '100px',
          padding: '12px 28px',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Leaf
              className="w-5 h-5 text-verdant-lime transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(212,248,122,0.8)]"
              strokeWidth={2}
            />
          </div>
          <span className="text-sm font-semibold tracking-wide text-mint-cream">
            PREPPATH
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm text-[rgba(200,230,200,0.7)] hover:text-mint-cream transition-colors duration-300 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-verdant-lime transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-4">
          <Link
            href="/login"
            className="text-sm text-[rgba(200,230,200,0.7)] hover:text-mint-cream transition-colors duration-300 px-4 py-2"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="btn-verdant text-sm font-semibold px-5 py-2.5"
            style={{ borderRadius: '12px' }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
