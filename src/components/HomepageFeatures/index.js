import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'On-Chain RWA Credits',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        &bull; Specialized risk solutions tailored for on-chain Real World Asset credits.
      </>
    ),
  },
  {
    title: 'Portfolio-Specific Machine-Learning Credit Modeling',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        &bull; Utilizes advanced machine-learning techniques to craft credit models customized for the distinct characteristics of each portfolio.<br />
        &bull; Incorporates fundamental analysis to gain insights into underlying assets, identifying patterns, trends, and risk factors.<br />
        &bull; Integrates data from both on-chain and off-chain sources, providing a holistic view for a more comprehensive risk assessment.
      </>
    ),
  },
  {
    title: 'Privacy-Preserving Data Security',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        &bull; Implements stringent privacy-preserving measures to secure the portfolio dataset, ensuring the confidentiality of sensitive information.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--left padding-horiz--md">
        {/* <Svg className={styles.featureSvg} role="img" /> */}
      </div>
      <div className="text--left padding-horiz--md">
      <Heading as="h3" className="text--center">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
