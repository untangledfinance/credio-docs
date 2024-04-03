# Credit modeling

## 1. Introduction

Ensuring the sustainable operation of Untangled credit health hinges on our capacity to precisely assess the efficacy of our loans. We gauge loan performance through various metrics, such as anticipated losses due to charge-offs (instances where a borrower fails to repay a portion or the entirety of a loan), the speed at which loans are repaid, and the monthly cash flow associated with a specific loan portfolio. The accurate estimation of these factors proves invaluable for a diverse range of analyses and applications. For more detail, we will go through some notes

## 2. Management Risks

Real World Assets (RWA) and decentralized finance aligns with key factors that can impact the performance and stability of such systems. Let's explore each risk and mitigation strategy

**2.1 Borrower Capability of Payment**

* **Description:** This risk focuses on the ability of borrowers to meet their repayment obligations. It includes factors such as the financial health of the borrowing entities, their revenue streams, and their capacity to generate enough income to service their loans.
* **Mitigation Strategies:** Lenders can employ robust underwriting processes, collateral requirements, and credit scoring mechanisms to assess the creditworthiness of borrowers. Overcollateralization, where borrowers provide more collateral than the loan amount, can act as a buffer in case of default.

### **2.2 Macroeconomic Risks**

* **Description:** Macroeconomic factors, such as economic downturns, inflation, interest rate changes, or geopolitical events, can impact the overall stability of real-world assets and the ability of borrowers to repay their loans.
* **Mitigation Strategies:** Regular stress testing of the lending protocols under various economic scenarios can help identify vulnerabilities. Diversification of assets within the lending pool and implementing risk management frameworks that consider macroeconomic indicators are essential

### 2.3 Onchain market Risks&#x20;

* **Description:** Cryptocurrency prices, particularly Bitcoin (BTC) as a leading and influential asset, can exhibit high volatility. Fluctuations in BTC pricing can impact the value of collateral held by borrowers, potentially leading to issues with overcollateralization and liquidations.
* **Mitigation Strategies:** Implementing dynamic collateral ratios that adjust based on market conditions can help manage this risk. Continuous monitoring of the market and setting appropriate risk parameters can also assist in responding to sudden price movements.

### **2.4 Counterparty Risks:**

* **Description:** Interactions with external systems, oracles, and other off-chain entities introduce counterparty risks. The reliability of price feeds and data from external sources is crucial.
* **Mitigation Strategies:** Using reputable oracles, implementing decentralized oracle networks, and employing multiple data sources can enhance the reliability of external information. Smart contracts should be designed to handle potential failures in external data sources gracefully.

## 3. Credit Modelling

Credit Modeling Machine Learning (ML) models can be a powerful tool to gain insights into the expected repayment behavior of borrowers and to forecast the amount of money a lending platform can expect in any given month. Credit modeling using ML leverages historical data and various features to build predictive models that can assess the creditworthiness of borrowers and estimate their likelihood of default

We involves leveraging both on-chain user behavior and historical loan data to model the month-by-month behavior of Real World Asset (RWA) loans. The combination of on-chain data and monthly loan history provides a comprehensive view of a borrower's creditworthiness and repayment patterns.

<img src="../../.gitbook/assets/image (4).png" alt="Unified credit model architecture" />

<!-- {% content-ref url="factors/" %} -->
[factors](factors/)
<!-- {% endcontent-ref %} -->

<!-- {% content-ref url="modelling/" %} -->
[modelling](modelling/)
<!-- {% endcontent-ref %} -->
