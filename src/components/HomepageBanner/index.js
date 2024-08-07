import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import {
  usePrismicDocumentByUID,
  PrismicText,
  PrismicRichText,
  PrismicImage,
} from "@prismicio/react";

export default function HomepageHeader() {
  const [document] = usePrismicDocumentByUID("landing_page", "banner");
  const content = document?.data?.body?.[0]?.primary;

  if (!content) return null;

  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroBannerLeft}>
        <Heading as="h1">
          <PrismicText field={content.title} />
        </Heading>
        <p>{content.description}</p>
        <Link
          className="button button--primary button--md"
          to="docs/ml-quant/credio/intro"
        >
          Getting Started
        </Link>
      </div>
      <div className={styles.heroBannerRight}>
        <PrismicImage field={content.banner_image} />
      </div>
    </header>
  );
}
