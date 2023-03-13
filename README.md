# Cadia

Cadia is an on-chain arcade gaming platform on DeSo Blockchain that offers browser-based, plug-and-play arcade games with leadership boards. Compared to traditional web2 gaming platforms, we allow users to collect their in-game achievements not just as non-portable scores on leaderboards, but as NFTs that can be collected, owned, and monetized. Players can showcase their skills and engage with others through our in-game network, where they can collect leadership board achievements as NFTs, share gameplay strategies, and endorse other players with likes and follows.

Our first game is a poker strategy game called PokerGPT that allows you to play Texas Hold'em against ChatGPT.

## Openfund Link

https://openfund.com/d/cadia

And yes, we are about to moon.

## Developer Toolchain

1. Environment variables
   1. Create a file named `.envrc` in the root directory and populate it based on `.envrc.sample`. Note the use of single quotes about the `FIREBASE_CREDENTIALS` (just replace the empty object with the one from the config file).
   2. Install [direnv](https://direnv.net/) by following the directions on the site
   3. Run `direnv allow` in the root directory
   4. You should be able to run the backend server now
