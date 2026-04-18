import clsx from "clsx";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

const features = [
  {
    title: "OctoPos",
    description: "Real-time DeFi position tracking and analytics. Access comprehensive wallet data, transaction history, and portfolio metrics through our powerful API.",
    link: "/docs/category/octopos",
    label1: "POSITION TRACKING",
    label2: "RISK MONITORING",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    title: "Credio Agents",
    description: "Create and deploy AI agents that interact with DeFi protocols. Build intelligent automation for trading, portfolio management, and analytics.",
    link: "/docs/category/credio-agents",
    label1: "AI AUTOMATION",
    label2: "STRATEGY EXECUTION",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6"/>
        <circle cx="19" cy="5" r="2"/>
        <path d="M17 7l-2.5 2.5"/>
      </svg>
    ),
  },
];

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <h2 className={styles.sectionTitle}>Solutions</h2>
      <div className={styles.grid}>
        {features.map((feature, idx) => (
          <Link
            key={idx}
            className={clsx(styles.card, idx === 0 ? styles.card1 : styles.card2)}
            to={feature.link}
          >
            <div className={styles.cardGeo}>
              <svg viewBox="0 0 390 410" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                {/* Grid lines */}
                <line x1="0" y1="130" x2="390" y2="130" stroke="rgba(60,100,180,0.18)" strokeWidth="0.7"/>
                <line x1="0" y1="260" x2="390" y2="260" stroke="rgba(60,100,180,0.18)" strokeWidth="0.7"/>
                <line x1="130" y1="0" x2="130" y2="410" stroke="rgba(60,100,180,0.18)" strokeWidth="0.7"/>
                <line x1="260" y1="0" x2="260" y2="410" stroke="rgba(60,100,180,0.18)" strokeWidth="0.7"/>
                
                {idx === 0 ? (
                  <>
                    {/* Card 1: Concentric circles */}
                    <circle cx="195" cy="200" r="130" stroke="rgba(60,100,180,0.22)" strokeWidth="0.8" fill="none"/>
                    <circle cx="195" cy="200" r="60" stroke="rgba(60,100,180,0.3)" strokeWidth="0.8" fill="none" strokeDasharray="4 4"/>
                    <circle cx="195" cy="200" r="2.5" fill="rgba(100,160,230,0.8)"/>
                    <rect x="60" y="60" width="220" height="130" rx="4" fill="rgba(20,50,110,0.10)"/>
                  </>
                ) : (
                  <>
                    {/* Card 2: Overlapping circles */}
                    <circle cx="195" cy="120" r="100" stroke="rgba(60,100,180,0.22)" strokeWidth="0.8" fill="none"/>
                    <circle cx="195" cy="290" r="95" stroke="rgba(60,100,180,0.22)" strokeWidth="0.8" fill="none" strokeDasharray="5 4"/>
                    <circle cx="195" cy="185" r="2.5" fill="rgba(100,160,230,0.8)"/>
                  </>
                )}
              </svg>
            </div>
            <span className={clsx(styles.geoLabel, styles.label1)}>{feature.label1}</span>
            <span className={clsx(styles.geoLabel, styles.label2)}>{feature.label2}</span>
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>
                {feature.icon}
              </div>
              <div className={styles.cardTitle}>{feature.title}</div>
              <div className={styles.cardDesc}>
                <p>{feature.description}</p>
                <Link to={feature.link} className={styles.readDocsBtn}>Read Docs</Link>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
