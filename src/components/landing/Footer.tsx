import { lazy, Suspense } from 'react';
import Link from 'next/link';

const InstancedText = lazy(() => import('@/components/InstancedText'));

const footerLinks = {
  Product: ['AI Interviews', 'Roadmaps', 'Pricing', 'Changelog'],
  Resources: ['Interview Guides', 'System Design', 'Blog', 'Support'],
  Company: ['About', 'Careers', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Security'],
};

export default function Footer() {
  return (
    <footer className="relative min-h-[600px] bg-deep-forest overflow-hidden">
      {/* 3D Instanced Text Background */}
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div className="w-full h-full bg-deep-forest" />
          }
        >
          <InstancedText videoSrc="/videos/hero-video.mp4" />
        </Suspense>
      </div>

      {/* Footer Content Overlay */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-medium uppercase tracking-[2px] text-[rgba(180,210,180,0.5)] mb-5">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-[rgba(200,230,200,0.6)] hover:text-verdant-lime transition-colors duration-300"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D4F87A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 5.8 17 4.5 19 2c1 2 2 4.5 2 8 0 5.5-4.8 10-10 10Z" />
              <path d="M2 21c0-3 1.8-5.6 4.5-6.8" />
            </svg>
            <span className="text-sm font-medium text-[rgba(200,230,200,0.6)]">
              PREPPATH
            </span>
          </div>
          <p className="text-xs text-[rgba(180,210,180,0.35)]">
            &copy; 2025 PrepPath. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
