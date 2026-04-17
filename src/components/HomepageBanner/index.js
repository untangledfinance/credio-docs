import Heading from "@theme/Heading";
import styles from "./styles.module.css";

export default function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroBannerLeft}>
        <Heading as="h1">Build on Credio</Heading>
        <p>
          Access real-time DeFi position data through OctoPos API or create AI agents with Credio Agents — the choice is yours.
        </p>
      </div>
      <div className={styles.heroBannerRight}>
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Radar circles */}
          <circle cx="200" cy="200" r="180" stroke="#6366f1" strokeWidth="1" opacity="0.1"/>
          <circle cx="200" cy="200" r="140" stroke="#6366f1" strokeWidth="1" opacity="0.15"/>
          <circle cx="200" cy="200" r="100" stroke="#6366f1" strokeWidth="1" opacity="0.2"/>
          <circle cx="200" cy="200" r="60" stroke="#6366f1" strokeWidth="1.5" opacity="0.3"/>
          
          {/* Dashed arc lines */}
          <path d="M 200 20 A 180 180 0 0 1 380 200" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.4"/>
          <path d="M 200 380 A 180 180 0 0 1 20 200" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.4"/>
          
          {/* Center nodes */}
          <circle cx="200" cy="200" r="20" fill="#6366f1" opacity="0.2"/>
          <circle cx="200" cy="200" r="12" fill="#6366f1"/>
          <circle cx="200" cy="200" r="4" fill="#ffffff"/>
          
          {/* Outer nodes - OctoPos (left) */}
          <circle cx="60" cy="200" r="8" fill="#22c55e"/>
          <circle cx="60" cy="200" r="16" stroke="#22c55e" strokeWidth="1" opacity="0.3"/>
          <line x1="68" y1="200" x2="188" y2="200" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" opacity="0.5"/>
          
          {/* Outer nodes - Credio Agents (right) */}
          <circle cx="340" cy="200" r="8" fill="#8b5cf6"/>
          <circle cx="340" cy="200" r="16" stroke="#8b5cf6" strokeWidth="1" opacity="0.3"/>
          <line x1="212" y1="200" x2="332" y2="200" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 4" opacity="0.5"/>
          
          {/* Top node */}
          <circle cx="200" cy="40" r="6" fill="#6366f1"/>
          <circle cx="200" cy="40" r="12" stroke="#6366f1" strokeWidth="1" opacity="0.3"/>
          <line x1="200" y1="52" x2="200" y2="188" stroke="#6366f1" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>
          
          {/* Bottom node */}
          <circle cx="200" cy="360" r="6" fill="#f59e0b"/>
          <circle cx="200" cy="360" r="12" stroke="#f59e0b" strokeWidth="1" opacity="0.3"/>
          <line x1="200" y1="212" x2="200" y2="348" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>
          
          {/* Corner nodes */}
          <circle cx="90" cy="90" r="5" fill="#6366f1" opacity="0.6"/>
          <circle cx="310" cy="90" r="5" fill="#6366f1" opacity="0.6"/>
          <circle cx="90" cy="310" r="5" fill="#6366f1" opacity="0.6"/>
          <circle cx="310" cy="310" r="5" fill="#6366f1" opacity="0.6"/>
          
          {/* Labels */}
          <rect x="35" y="220" width="50" height="18" rx="3" fill="#1e293b" stroke="#22c55e" strokeWidth="1"/>
          <text x="60" y="233" fontSize="9" fill="#22c55e" textAnchor="middle" fontFamily="monospace">OCTOPOS</text>
          
          <rect x="315" y="220" width="50" height="18" rx="3" fill="#1e293b" stroke="#8b5cf6" strokeWidth="1"/>
          <text x="340" y="233" fontSize="9" fill="#8b5cf6" textAnchor="middle" fontFamily="monospace">AGENTS</text>
        </svg>
      </div>
    </header>
  );
}
