import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const trustItems = ['No credit card required', 'Instant feedback', 'Cancel anytime'];

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'brightness(0.8) contrast(1.1)',
          zIndex: 0,
        }}
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Vignette Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(4,10,4,0.2) 0%, rgba(4,10,4,0.7) 70%, rgba(4,10,4,0.95) 100%)',
          zIndex: 1,
        }}
      />

      {/* Top/Bottom dark gradients for vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(4,10,4,0.5) 0%, transparent 30%, transparent 70%, rgba(4,10,4,0.8) 100%)',
          zIndex: 2,
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto pt-32">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2"
            style={{
              background: 'rgba(20, 25, 20, 0.5)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '100px',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-verdant-lime opacity-75"
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-verdant-lime" />
            </span>
            <span className="text-sm text-[rgba(200,230,200,0.7)]">
              New
            </span>
            <span className="text-sm text-[rgba(180,210,180,0.5)]">|</span>
            <span className="text-sm text-mint-cream">
              PrepPath AI is now available
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-verdant-lime" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-tight mb-6"
          style={{ letterSpacing: '-2px', lineHeight: 1.1 }}
        >
          <span className="text-mint-cream">Interviews that </span>
          <br className="hidden sm:block" />
          <span className="font-serif-accent italic text-verdant-lime">adapt</span>
          <span className="text-mint-cream"> to you.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg text-[rgba(200,230,200,0.7)] max-w-xl mb-10 leading-relaxed"
        >
          The AI-powered interview coach that provides personalized coding roadmaps, realistic mock interviews, and instant feedback.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <Link
            href="/signup"
            className="btn-verdant inline-flex items-center gap-2 px-8 py-4 text-base font-semibold"
            style={{
              borderRadius: '14px',
              boxShadow: '0 0 40px rgba(212, 248, 122, 0.3)',
            }}
          >
            Start Practicing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex items-center gap-5 flex-wrap justify-center"
        >
          {trustItems.map((item) => (
            <div
              key={item}
              className="flex items-center gap-1.5 text-xs text-[rgba(180,210,180,0.5)]"
            >
              <Check className="w-3.5 h-3.5 text-verdant-lime" />
              {item}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Social Proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-0 left-0 right-0 z-10 pb-10 pt-20"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, #040A04 60%)',
        }}
      >
        <div className="text-center">
          <p
            className="text-[10px] font-medium uppercase tracking-[3px] text-[rgba(180,210,180,0.4)] mb-6"
          >
            Trusted by candidates at top companies
          </p>
          <div className="flex items-center justify-center gap-12 flex-wrap px-6">
            {['GOOGLE', 'META', 'AMAZON', 'NETFLIX'].map((name) => (
              <span
                key={name}
                className="text-lg font-medium text-[rgba(180,210,180,0.25)] tracking-wider hover:text-[rgba(180,210,180,0.4)] transition-colors duration-300 cursor-default select-none"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
