# Cadia

Cadia is an on-chain arcade gaming platform that offers browser-based, plug-and-play arcade games with leadership boards. Players can showcase their skills and engage with others. We believe that blockchains are perfect for minigames.

Our first game is a poker strategy game called PokerGPT that allows you to play Texas Hold'em against ChatGPT. Come and play a game and see how well you fair against ChatGPT! On the tutorial page, click the symbol on the top right to log into MetaMask.
It's currently live at https://www.thecadia.xyz/


### How it Works

Cadia will have two modes, free-play and challenge-play. Free-play is an always avalible version that anyone with a MetaMask account can play. On the other hand, Challenge-play will have a small entry fee of 3 USDC. At the end of the day, the people with the three highest scores on our Challenge-play leaderboard wins 50%, 25%, and 15% of the game pot for today, with the remaining 10% going back into us for development and growth. Put your skills to the test and fight man vs machine!

### Our DeFi Protocol

On top of having the Challenge reward system, we also have a DeFi wager market for players to make secondary betting. Individuals will be able to bet on the player they think will have the highest score that week. The earlier someone bets, the more weight that bet will have. An early bet can be worth quadrule that of a late bet.

At the end of the week, those who bet on the top three highest scoring players from the past seven days will win their wager. Rewards will be distributed from our smart contract in accordance to how much and how early the wager was made.

You can check out our live contract here:

```console
TODO, INCLUDE THE FUCKER
```

It's also in the /contracts folder.

# Documentation

Cadia's DeFi betting protocol and leaderboard is made on the Arbitrum testnet network. The reason why we chose to deploy on the Arbitrum testnet is because we plan to move onto Arbitrum Nova in the future, as it is perfectly suited for gaming. Its incredible convenience, speed, and affordable nature is perfect for minting on-chain achievements, prizes, and collectables, something we as a gaming platform plan to utilize in full effect.

Additonally, we use a combination of Arbitrum and Firebase for our database as we in the process of transitioning all of our backend to the blockchain. While it's more expensive to have our backend on web3, layer 2s have made it signficantly easier to host our services there, and the blockchain's immutable nature allows us to be both more decentralized and robust for our players. Our frontend is hosted by Heroku and made in React, which has allowed us to be flexible and creative in our website design. Finally, we utilize Zkaptcha's captcha images in both our gameplay and betting market to provide additional defence against potential botting and DDOS attacks.

Our game logic, website, and smart contracts have been tested vigoursly with extensive commenting. 
Take a look at them in the /contracts folder.

Again, feel free to try out our game at https://www.thecadia.xyz/

If you wish to run tests against our smart contracts, run

```console
TODO INCLUDE THIS PART AND THE PART ABOVE
```

If you wish to try out our game locally, you will need to have your own .envrc file with a firebase service account with full access and an open-ai api key. For security reasons, we cannot share ours with you on a public github, but please reach out to us if you need to run the game locally.

If you have a .envrc file, simpily run 
```console
foo@bar:~$ npm i
foo@bar:~$ npm run start:dev
```

## Team
Cadia is founded by four talented Princeton students looking to make a lasting impact on blockchain. Bofan Ji is the co-president of the Princeton Blockchain Club with research experience at Dragonfly Capital. Jackie Chen is the winner of the 2020 Princeton Mathematics Competition and has been programming on various blockchains for the past three years. Tharun Kumar Tiruppali Kalidoss is a young blockchain engineer with experience working at both Modulus Labs and Open AI. Carter Costic is a programming savant with the talents to make a remarkable website using React and Python.