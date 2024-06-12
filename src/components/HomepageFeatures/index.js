import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import {
  PrismicImage,
  PrismicRichText,
  PrismicText,
  usePrismicDocumentByUID,
} from "@prismicio/react";

export default function HomepageFeatures() {
  const [document] = usePrismicDocumentByUID("landing_page", "features");
  const content = document?.data?.body?.[0]?.items;

  if (!content) return null;

  return (
    <section className={styles.features}>
      {content.map((item, idx) => (
        <a
          key={idx}
          className={styles.feature}
          href={item.link.url ?? "javascript:void(0)"}
          target={item.link.target}
        >
          <div className={styles.featureIconWrapper}>
            <PrismicImage className={styles.featureIcon} field={item.logo} />
          </div>
          <div className={styles.featureContent}>
            <Heading as="h3">
              <PrismicText field={item.title} />
            </Heading>
            <PrismicRichText field={item.description} />
          </div>
        </a>
      ))}
    </section>
  );
}
