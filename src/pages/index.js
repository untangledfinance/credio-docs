import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { PrismicProvider } from "@prismicio/react";

import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import prismicClient from "../api/client";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <PrismicProvider client={prismicClient}>
      <Layout
        title={`${siteConfig.title} Doc site`}
        description="Description will go into a meta tag in <head />"
      >
        <main>
          <HomepageFeatures />
        </main>
      </Layout>
    </PrismicProvider>
  );
}
