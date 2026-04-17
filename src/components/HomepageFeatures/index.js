import clsx from "clsx";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

const features = [
  {
    title: "OctoPos",
    description: "Real-time DeFi position tracking and analytics. Access comprehensive wallet data, transaction history, and portfolio metrics through our powerful API.",
    link: "/docs/category/octopos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#6366f1" strokeWidth="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#6366f1" strokeWidth="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#6366f1" strokeWidth="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#6366f1" strokeWidth="1.5"/>
        <path d="M10 12L14 12M14 10L10 14M14 14L10 10" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Credio Agents",
    description: "Create and deploy AI agents that interact with DeFi protocols. Build intelligent automation for trading, portfolio management, and analytics.",
    link: "/docs/category/credio-agents",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="#22c55e" strokeWidth="1.5"/>
        <circle cx="12" cy="8" r="3" stroke="#22c55e" strokeWidth="1.5"/>
        <path d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="19" cy="5" r="2" stroke="#22c55e" strokeWidth="1.5"/>
        <path d="M17 7L14.5 9.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      {features.map((feature, idx) => (
        <Link
          key={idx}
          className={styles.feature}
          to={feature.link}
        >
          <div className={styles.featureIconWrapper}>
            {feature.icon}
          </div>
          <div className={styles.featureContent}>
            <Heading as="h3">{feature.title}</Heading>
            <p>{feature.description}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}
