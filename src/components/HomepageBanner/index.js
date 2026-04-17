import Heading from "@theme/Heading";
import styles from "./styles.module.css";

export default function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroBannerLeft}>
        <Heading as="h1">Build on Credio</Heading>
        <p>
          Access real-time DeFi position data through OctoPos API or create AI agents with Credio Agents.
        </p>
      </div>
      <div className={styles.heroBannerRight}>
        <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Radar circles */}
          <circle cx="150" cy="150" r="120" stroke="#6366f1" strokeWidth="1" opacity="0.1"/>
          <circle cx="150" cy="150" r="90" stroke="#6366f1" strokeWidth="1" opacity="0.15"/>
          <circle cx="150" cy="150" r="60" stroke="#6366f1" strokeWidth="1" opacity="0.2"/>
          <circle cx="150" cy="150" r="35" stroke="#6366f1" strokeWidth="1.5" opacity="0.3"/>
          
          {/* Center nodes */}
          <circle cx="150" cy="150" r="15" fill="#6366f1" opacity="0.2"/>
          <circle cx="150" cy="150" r="8" fill="#6366f1"/>
          <circle cx="150" cy="150" r="3" fill="#ffffff"/>
          
          {/* Outer nodes - OctoPos (left) */}
          <circle cx="50" cy="150" r="6" fill="#22c55e"/>
          <line x1="56" y1="150" x2="142" y2="150" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" opacity="0.5"/>
          
          {/* Outer nodes - Credio Agents (right) */}
          <circle cx="250" cy="150" r="6" fill="#8b5cf6"/>
          <line x1="158" y1="150" x2="244" y2="150" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 4" opacity="0.5"/>
          
          {/* Top node */}
          <circle cx="150" cy="50" r="5" fill="#6366f1"/>
          <line x1="150" y1="57" x2="150" y2="142" stroke="#6366f1" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>
          
          {/* Bottom node */}
          <circle cx="150" cy="250" r="5" fill="#f59e0b"/>
          <line x1="150" y1="158" x2="150" y2="243" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>
          
          {/* Labels */}
          <rect x="15" y="168" width="60" height="18" rx="3" fill="#1e293b" stroke="#22c55e" strokeWidth="1"/>
          <text x="45" y="180" fontSize="8" fill="#22c55e" textAnchor="middle" fontFamily="monospace">OCTOPOS</text>
          
          <rect x="225" y="168" width="60" height="18" rx="3" fill="#1e293b" stroke="#8b5cf6" strokeWidth="1"/>
          <text x="255" y="180" fontSize="8" fill="#8b5cf6" textAnchor="middle" fontFamily="monospace">AGENTS</text>
        </svg>
      </div>
    </header>
  );
}
