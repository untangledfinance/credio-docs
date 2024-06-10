import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

export default function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroBannerLeft}>
        <Heading as="h1">
          Welcome to <span>Credio Docs</span>
        </Heading>
        <p>
          Learn how to use data analytics platform to build machine learning
          risk models or earn by providing validation services
        </p>
        <Link
          className="button button--primary button--md"
          to="docs/ml-quant/credio/intro"
        >
          Getting Started
        </Link>
      </div>
      <div className={styles.heroBannerRight}>{/* Banner Image here */}</div>
    </header>
  );
}
