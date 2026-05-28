import { motion } from 'framer-motion';
import { Leaf, TrendingUp, Shield, Database, Cloud, Code, Calendar } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.1 * i,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

function UnifyDiagram() {
  return (
    <div className="relative w-full h-40 mt-4">
      <svg viewBox="0 0 300 140" className="w-full h-full" fill="none">
        {/* Connection lines - glowing dashed */}
        <path
          d="M60 40 Q120 30 150 70"
          stroke="#D4F87A"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          className="animate-dash-flow"
          opacity="0.6"
        />
        <path
          d="M60 70 Q100 70 150 70"
          stroke="#D4F87A"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          className="animate-dash-flow"
          opacity="0.6"
          style={{ animationDelay: '0.3s' }}
        />
        <path
          d="M60 100 Q120 110 150 70"
          stroke="#D4F87A"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          className="animate-dash-flow"
          opacity="0.6"
          style={{ animationDelay: '0.6s' }}
        />
        <path
          d="M60 70 Q80 70 100 70 Q120 70 150 70"
          stroke="#D4F87A"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          className="animate-dash-flow"
          opacity="0.6"
          style={{ animationDelay: '0.9s' }}
        />

        {/* Source icons */}
        <g transform="translate(30, 20)">
          <rect
            x="0"
            y="0"
            width="40"
            height="40"
            rx="10"
            fill="rgba(20, 25, 20, 0.8)"
            stroke="rgba(255,255,255,0.08)"
          />
          <Database className="w-5 h-5" x="10" y="10" stroke="#D4F87A" strokeWidth={1.5} />
        </g>
        <g transform="translate(30, 55)">
          <rect
            x="0"
            y="0"
            width="40"
            height="40"
            rx="10"
            fill="rgba(20, 25, 20, 0.8)"
            stroke="rgba(255,255,255,0.08)"
          />
          <Cloud className="w-5 h-5" x="10" y="10" stroke="#D4F87A" strokeWidth={1.5} />
        </g>
        <g transform="translate(30, 90)">
          <rect
            x="0"
            y="0"
            width="40"
            height="40"
            rx="10"
            fill="rgba(20, 25, 20, 0.8)"
            stroke="rgba(255,255,255,0.08)"
          />
          <Calendar className="w-5 h-5" x="10" y="10" stroke="#D4F87A" strokeWidth={1.5} />
        </g>
        <g transform="translate(30, 55)">
          <rect
            x="0"
            y="0"
            width="40"
            height="40"
            rx="10"
            fill="rgba(20, 25, 20, 0.8)"
            stroke="rgba(255,255,255,0.08)"
          />
          <Code className="w-5 h-5" x="10" y="10" stroke="#D4F87A" strokeWidth={1.5} />
        </g>

        {/* Center hub - Verdant icon */}
        <g transform="translate(120, 40)">
          <circle cx="30" cy="30" r="32" fill="rgba(212, 248, 122, 0.15)" />
          <circle
            cx="30"
            cy="30"
            r="28"
            fill="rgba(20, 25, 20, 0.9)"
            stroke="#D4F87A"
            strokeWidth="1.5"
          />
          <circle
            cx="30"
            cy="30"
            r="28"
            fill="none"
            stroke="#D4F87A"
            strokeWidth="1"
            opacity="0.3"
          >
            <animate
              attributeName="r"
              values="28;36;28"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0;0.3"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <Leaf
            className="w-6 h-6"
            x="20"
            y="20"
            stroke="#D4F87A"
            strokeWidth={2}
          />
        </g>
      </svg>
    </div>
  );
}

function ChartVisual() {
  return (
    <div className="relative w-full h-44 mt-4">
      <svg viewBox="0 0 300 160" className="w-full h-full" fill="none">
        {/* Gradient fill definition */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4F87A" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D4F87A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2E4024" />
            <stop offset="50%" stopColor="#D4F87A" />
            <stop offset="100%" stopColor="#D4F87A" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path
          d="M30 120 C50 110, 60 80, 90 85 C120 90, 130 50, 160 60 C190 70, 200 30, 230 35 C260 40, 270 20, 290 25 L290 140 L30 140 Z"
          fill="url(#chartGradient)"
        />

        {/* Main line */}
        <path
          d="M30 120 C50 110, 60 80, 90 85 C120 90, 130 50, 160 60 C190 70, 200 30, 230 35 C260 40, 270 20, 290 25"
          stroke="url(#lineGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="animate-glow-pulse"
        />

        {/* Glow duplicate */}
        <path
          d="M30 120 C50 110, 60 80, 90 85 C120 90, 130 50, 160 60 C190 70, 200 30, 230 35 C260 40, 270 20, 290 25"
          stroke="#D4F87A"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.15"
          filter="blur(4px)"
        />

        {/* Tooltip */}
        <g transform="translate(200, 10)">
          <rect
            x="0"
            y="0"
            width="60"
            height="26"
            rx="8"
            fill="rgba(20, 25, 20, 0.9)"
            stroke="rgba(212, 248, 122, 0.3)"
            strokeWidth="1"
          />
          <text
            x="30"
            y="17"
            textAnchor="middle"
            fill="#D4F87A"
            fontSize="12"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            &#8593; 32%
          </text>
        </g>

        {/* Vertical grid lines */}
        {[60, 120, 180, 240].map((x) => (
          <line
            key={x}
            x1={x}
            y1="30"
            x2={x}
            y2="140"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Horizontal grid lines */}
        {[50, 80, 110].map((y) => (
          <line
            key={y}
            x1="30"
            y1={y}
            x2="290"
            y2={y}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}
      </svg>
    </div>
  );
}

function RadarVisual() {
  return (
    <div className="relative w-full h-40 mt-4">
      <svg viewBox="0 0 300 160" className="w-full h-full" fill="none">
        {/* Concentric radar rings */}
        {[30, 50, 70].map((r, i) => (
          <circle
            key={r}
            cx="150"
            cy="80"
            r={r}
            stroke="rgba(212, 248, 122, 0.15)"
            strokeWidth="1"
            fill="none"
            style={{
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <animate
              attributeName="r"
              values={`${r};${r + 5};${r}`}
              dur={`${4 + i}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Animated sweep line */}
        <line
          x1="150"
          y1="80"
          x2="150"
          y2="10"
          stroke="rgba(212, 248, 122, 0.3)"
          strokeWidth="1"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 150 80"
            to="360 150 80"
            dur="8s"
            repeatCount="indefinite"
          />
        </line>

        {/* Center shield */}
        <g transform="translate(130, 60)">
          <circle
            cx="20"
            cy="20"
            r="22"
            fill="rgba(212, 248, 122, 0.1)"
            stroke="#D4F87A"
            strokeWidth="1.5"
          />
          <Shield
            className="w-6 h-6"
            x="10"
            y="10"
            stroke="#D4F87A"
            strokeWidth={1.5}
          />
        </g>

        {/* Orbiting dots */}
        {[
          { angle: 45, dist: 45, delay: '0s' },
          { angle: 135, dist: 60, delay: '1s' },
          { angle: 225, dist: 50, delay: '2s' },
          { angle: 315, dist: 55, delay: '3s' },
        ].map((dot, i) => {
          const rad = (dot.angle * Math.PI) / 180;
          const cx = 150 + dot.dist * Math.cos(rad);
          const cy = 80 + dot.dist * Math.sin(rad);
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="3"
              fill="#D4F87A"
              opacity="0.8"
            >
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="2s"
                repeatCount="indefinite"
                begin={dot.delay}
              />
              <animate
                attributeName="r"
                values="2;4;2"
                dur="2s"
                repeatCount="indefinite"
                begin={dot.delay}
              />
            </circle>
          );
        })}
      </svg>
    </div>
  );
}

const features = [
  {
    icon: Leaf,
    title: 'Personalized Roadmaps',
    description:
      'Tell us your target role and company. We generate a custom syllabus to get you there.',
    visual: UnifyDiagram,
  },
  {
    icon: TrendingUp,
    title: 'Skill Progress Tracking',
    description:
      'Watch your proficiency grow with beautiful charts and actionable metrics.',
    visual: ChartVisual,
  },
  {
    icon: Shield,
    title: 'AI Mock Interviews',
    description:
      'Practice with a technical interviewer that provides instant, precise feedback on your code.',
    visual: RadarVisual,
  },
];

export default function BentoGrid() {
  return (
    <section className="relative z-10 -mt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
        {features.map((feature, i) => {
          const Visual = feature.visual;
          return (
            <motion.div
              key={feature.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              whileHover={{
                y: -4,
                transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
              }}
              className="glass-card group cursor-default overflow-hidden transition-all duration-300"
              style={{
                borderRadius: '24px',
                padding: '28px',
              }}
            >
              {/* Inner border glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  borderRadius: '24px',
                  boxShadow: 'inset 0 1px 0 0 rgba(212, 248, 122, 0.15)',
                }}
              />

              {/* Icon */}
              <div
                className="w-10 h-10 flex items-center justify-center mb-4"
                style={{
                  background: 'rgba(212, 248, 122, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(212, 248, 122, 0.15)',
                }}
              >
                <feature.icon
                  className="w-5 h-5 text-verdant-lime"
                  strokeWidth={1.5}
                />
              </div>

              {/* Title */}
              <h3 className="text-lg font-medium text-mint-cream mb-2">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[rgba(200,230,200,0.7)] leading-relaxed mb-4">
                {feature.description}
              </p>

              {/* Visual */}
              <Visual />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
