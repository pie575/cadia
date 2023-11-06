# Cadia

*Read the "about" section for more info. This is the skeleton code for Cadia used as an example for projects I've worked on. Take a look at the game I made!*

Cadia is an on-chain arcade gaming platform that offers browser-based, plug-and-play arcade games with leadership boards. Players can showcase their skills and engage with others. We believe that blockchains are perfect for minigames.

Our first game is a poker strategy game called PokerGPT that allows you to play Texas Hold'em against ChatGPT. Come and play a game and see how well you fair against ChatGPT! On the tutorial page, click the symbol on the top right to log into MetaMask.
It's currently live at https://www.thecadia.xyz/

All Web3 elements from the Metamask login, the Arbitrum contracts, and DeFi betting protocols were implemented from scratch at Lionhack.


### How it Works

Cadia will have two modes, free-play and challenge-play. Free-play is an always avalible version that anyone with a MetaMask account can play. On the other hand, Challenge-play will have a small entry fee of 3 USDC. At the end of the day, the people with the three highest scores on our Challenge-play leaderboard wins 50%, 25%, and 15% of the game pot for today, with the remaining 10% going back into us for development and growth. Put your skills to the test and fight man vs machine!

### Our DeFi Protocol

On top of having the Challenge reward system, we also have a DeFi wager market for players to make secondary betting. Individuals will be able to bet on the player they think will have the highest score that week. The earlier someone bets, the more weight that bet will have. An early bet can be worth quadrule that of a late bet.

At the end of the week, those who bet on the top three highest scoring players from the past seven days will win their wager. Rewards will be distributed from our smart contract in accordance to how much and how early the wager was made.

You can check out our live contract here:

```console
https://goerli.arbiscan.io/address/0x2c49B722a88026D1EaeB6F1D257Fbe3e5BBeEE16#code
```

It's also in the /contracts folder.

# Smart Contract Documentation
Cadia's Poker "Side Bet" DeFi Protocol is built on Arbitrium. We have already deployed the contract on the Arbitrium testnet and plan to migrate to Arbitrum Nova in the future. With its exceptional convenience, speed, and cost-effectiveness, Arbitrium is an ideal platform for creating on-chain achievements, prizes, and collectibles. As a pioneering crypto gaming platform, we plan to utilize these features to the fullest.

Our primary contract, bettingMarket.sol, enables users to place bets while allowing our team to monitor the game season, distribute rewards, and withdraw management fees. We have implemented innovative incentive mechanisms that utilize the "weightMultiplier" concept, which degrades linearly over time as the season progresses. This incentivizes players to place bets early and claim a larger share of the prize pool. finally, we utilize Zkaptcha's captcha images in both the betting protocol and our gameplay to provide additional defence against potential botting and DDOS attacks.

To run tests on our smart contracts locally, 

1. Set Up
First create .env file and add ALCHEMY_ID (for all relevant environment variables, see .env.example)

Repo uses npm for packagement management. 

2. Run hardhat tests
install dependencies
```console
npm install
```

compile contracts
```console
npx hardhat compile
```

run tests
```console
npx hardhat test
```

# Game Documentation

For the game, we use a combination of Arbitrum and Firebase for our database as we in the process of transitioning all of our backend to the blockchain. While it's more expensive to have our backend on web3, layer 2s have made it signficantly easier to host our services there, and the blockchain's immutable nature allows us to be both more decentralized and robust for our players. Our frontend is hosted by Heroku and made in React, which has allowed us to be flexible and creative in our website design. 

Our game logic, website, and smart contracts have been tested vigoursly with extensive commenting.
You can find them in the /contracts folder.

Again, feel free to try out our game at https://www.thecadia.xyz/

If you wish to try out our game locally, you will need to have your own `.envrc` file with a Firebase service account with full access, an OpenAI API key, and the address of the smartcontract that is being used. For security reasons, we cannot share ours with you on a public github, but please reach out to us if you need to run the game locally.

If you have the above keys, you can set up the `.envrc` file following the format of the `.env.sample` file. Ensure you have [direnv](https://direnv.net/) installed. Then, to run our project, you can run the following:

```console
foo@bar:~$ direnv allow
foo@bar:~$ npm i
foo@bar:~$ npm run start:dev
```

To run just the back-end implementation, run

```console
foo@bar:~$ direnv allow
foo@bar:~$ npm i
foo@bar:~$ npm run start:dev:server
```

To run just the front-end implementation, run

```console
foo@bar:~$ direnv allow
foo@bar:~$ npm i
foo@bar:~$ npm run start:dev:server
```

## Team

Cadia is founded by four talented Princeton students looking to make a lasting impact on blockchain. Bofan Ji is the co-president of the Princeton Blockchain Club with research experience at Dragonfly Capital. Jackie Chen is the winner of the 2020 Princeton Mathematics Competition and has been programming on various blockchains for the past three years. Tharun Kumar Tiruppali Kalidoss is a young blockchain engineer with experience working at both Modulus Labs and Open AI. Carter Costic is a programming savant with the talents to make a remarkable website using React and Python.

## License
The license for Cadia "Side Bet" Protocol is the MIT License.
