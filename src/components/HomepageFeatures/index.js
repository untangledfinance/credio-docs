import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Data analytics",
    icon: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description:
      "Query, visualize, download onchain datasets for credit analytics and model building",
  },
  {
    title: "Credio",
    icon: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description:
      "Participate in challenges, earn from your model whilst keeping it private or stake CREDIO to secure the network",
  },
  {
    title: "Modelling Hub",
    icon: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description:
      "Explore machine learning credit modelling best practices and recipes",
  },
];

function Feature({ icon: Icon, title, description }) {
  return (
    <div className={styles.feature}>
      <div className={styles.featureIconWrapper}>
        <Icon className={styles.featureIcon} role="img" />
      </div>
      <div className={styles.featureContent}>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      {FeatureList.map((props, idx) => (
        <Feature key={idx} {...props} />
      ))}
    </section>
  );
}
