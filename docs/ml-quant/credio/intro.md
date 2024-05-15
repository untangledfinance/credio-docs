
# Introduction to credit oracle
Untangled is developing Credit Oracle, a real-time credit oracle powering on-chain lending with AI-driven risk models and zero-knowledge proof. We build Untangled on the conviction that much of RWA financing will be tokenized requiring robust credit infrastructure to scale. The credit oracle is a major missing piece in RWA DeFi today.

## Health factor in DeFi lending
In any collateralised lending, it is important to establish the price of collaterals as it directly impacts the recoverability of the loan. This is the concept of collateral ratio (value of collateral / loan amount). When collateral ratio drops to a certain level, say from 150% to 110%, collateral will be liquidated and the proceeds being used to repay the loan. 

All major DeFi lending protocols like Aave, Compound, Maker work in this way. However, in order to work out the collateral ratio, they need to know the current price of collateral. This is where price oracles such as Chainlink comes in. In the case of Chainlink, they provide price feed on a real time basis so that the protocols can maintain their financial health through the monitoring of the collateral ratio. 

The above protocols have one thing in common: their collaterals are crypto-native i.e. ETH or BTC. Whilst the collateral themselves are volatile in prices, there are deep markets for them, making prices highly observable. 

## Current stage of RWA collateral monitoring
RWA lending protocols, like the above, also need to monitor their health through the collateral ratios. However, the difference is that RWAs, while less volatile, do not have on-chain or secondary markets where prices can be easily observed. 

So if these proctocols want to value collaterals they need to use a ‘fair value’ approach based on credit modeling using statistical or machine learning approaches. These models generate ‘prices’ (or probability of default) for the credit collaterals which could then be fed into the collateral ratio above.  

The issue is that not many RWA lending protocols do or have the ability to value and monitor these RWA collaterals. The lack of collateral monitoring and pricing is a major contributing factor many defaults among many RWA pools to date. 

## Credit modeling 
In TradFi, the credit modeling or rating function is performed by rating agencies such as Moody’s, S&P and Fitch. Any public debt issuance will need to have a credit rating. In DeFi this is non-existent. 

A number of players have started to provide credit rating, modeling in DeFi. Untangled also build a machine learning based credit modeling capability that is providing credit prices for credit pools listing on Untangled protocol. This is a differentiation among existing RWA credit offerings in DeFi. 

Read more about our work on credit modelling at [RWAwise.xyz](https://rwawise.xyz)

## Credit oracle
Just like Chainlink is not the only source of crypto pricing, Untangled is decentralizing the credit modeling/pricing such that anyone with expertise in specific asset classes or the big rating agencies of the world can provide credit prices for RWA lending protocols. In order to feed those credit prices into smart contracts, an infrastructure layer needs to be developed. Where Chainlink builds an infrastructure for feeding crypto prices, Untangled build an credit oracle infrastructure to feed credit prices directly into smart contracts in real-time. 

![](./img/credit-oracle.png)

In building this infrastructure layer we collaborate with Chainlink and use the technologies Chainlink provides such as Automation or Functions. 

Untangled also works with Chainlink to bundle their Proof of Reserve offering with Credit Oracle. With this bundled solution, RWA lending protocols not only know the *price* of the RWA collaterals but also their *existence*. 

The lack of on-chain monitoring a system validating the existence of the collateral and their prices was what stopped Maker in lending to private credits RWAs but to focus on US treasuries instead. 
