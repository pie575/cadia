import { expect } from "chai";
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import { Contract, Signer } from "ethers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

import hre = require("hardhat");

const BigNumber = require('bignumber.js');

const { ethers } = hre;

describe("bettingMarket", function () {
  let owner: Signer;
  let bettor1: Signer;
  let bettor1Address: string;
  let bettor2: Signer;
  let bettor2Address: string;
  let player1: Signer;
  let player1Address: string;
  let player2: Signer;
  let player2Address: string;
  let player3: Signer;
  let player3Address: string;
  let bettingMarket: Contract;
  let dummyProof2: string;
  let dummyProof: string;

  beforeEach(async function () {
    [owner, bettor1, bettor2, player1, player2, player3] = await ethers.getSigners();
    const BettingMarket = await ethers.getContractFactory("bettingMarket");
    bettingMarket = await BettingMarket.deploy();
    await bettingMarket.deployed();
    bettor1Address = await bettor1.getAddress();
    bettor2Address = await bettor2.getAddress();
    player1Address = await player1.getAddress();
    player2Address = await player2.getAddress();
    player3Address = await player3.getAddress();
    // dummyProof2 = "AAAAAAAAAAAAAAAAUnGbexRhyMpMsr/DrKI2JiHXfrkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAByAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAgedpxhic+7jymE1CmDCMij79i7gkKOQng0rTMUmw8EBghR/m+063jvCLUMytsQYGhuStsLiCekquaT4tXyhE+GvHCSZLYL6CRQVAfIHdgUSu+v7bTkNDSPjEJXtLdLsMkWOue6wSIZnadyL8kdHqwOiolyBmk/RYQ+se/PQwZDCXLo5tC4nja6wxvFppvj1sgX2uZ0/QXhBPTGptUGSLbLxiUWzNiaArsiOPpQYgGT3yNYJkqHAGXZVy7j7xxEOcrDuC2WFH7DAROBhc4oCuM43cTg9xvSVjQnfkzgfcHORikyE2uPMmNTdgGcA1lmaaR425DtySnSPyt8Pk9lHcBGfbhoWITDQ0ru6bKgP2WFV9vBb7fnQmQWkVF6RIr/eEmjzWm2fWrmGIMpCJ3QFx/UUjqd/FBonz6Egm//5gwTQVvyE3aBYMwHO2DHDHm1gM8FEngwX1+Cx7P0mLXUvRcDZxTIZfvSoYCvXnG2ZZniD+CoLJuFcm1NYmRFgwr6Dkqzkjs+NTOoaaYZThBpEeaJD/SZmsxbovfSW6JPf5dwQwJL0Jp/+L6Ci+lhI3tT5J2DDcJYWbx+EmKREkjTOh9HHVXnjPmhgzenEvnXzFERy6xyzFo4GLqtDplamSsWUMFqc8l6Kk4r8fATWLmnJXwp9UlPDcfeax4OreltmK2yxmsaCUKyIVmqX/LlxwvYSniXm4jlitF1h53NIgKVNVEABrBiUNLlVX7TfE2NTtWp9miGwXNTHLwXa0WKnNH/EwvPr0r2qD4qJm+E35afnwKRi8t0ZdltrUcMdctfxBvkieU8mTbb7pfJA1AEVz+EpZcuXYzmbisrMT6CZ1jVNR7AqpmQ86k+LupKOujUdCH2E8hAt3pmmaa5puD5jpABAQGaOku0eD9KJ62Da8DoDQQGE4sHqE9UyQudwlQ/DkQDg+7+401NMc/826oQyvcemxl8NsZzPgj6e9zYiCM3CiQKDrHLrfg5IOzmceeQBQ66e8ngCEHONeixLRsoVzWOWMdplUrxAihhaiT4eZB/u8P931x9r6rX3FPTkNQ+Swk5y1uUD45YCUHnhUNAxXGdtHJtPj63gejrWDpGIdHpv8RLjRL5fPx7XmLlDiK6v1vtarrpSZcHeWYlOnUxD6smQAuNEvl8/HteYuUOIrq/W+1quulJlwd5ZiU6dTEPqyZACDHgraDXN3I0c5B8FiMpQhMC+SI4F7AXpEmmGXqZInLHodCZ4W6BpTNK4vbnJ3RzEbLJu8AHE9oZMjOIywQe18H6RXn2HtThkxSoZOFPNeAIbhIEXnL4jP43qdOQOxzaQNXJXKdtXirKDWhR/6zVe7D8WEPjN3MV/uVn2oKSbqpLPCsDtb7d/NOvEses+aF31twpv7AXCskb/ukfEXd8YwDnvt0LGa21JoZkrDnrfyc7IAfRBeERX7GtWRGqYEXYhBX0eUt++EaMYRmHTXwwNE2+zHXD3l8+pz7A5rqTVpLCZcwx9aAwgNqd4c0Wev8M3X7gL97zy7hJfZIcDhCN/8MoBUKLMM6IBABVNy6x8HYkw/Wogrza+FfDxe8YXlNEg==";
    // function stringToBytes32(str: string): string {
    //   const utf8Bytes = new TextEncoder().encode(str);
    //   const bytes32 = new Uint8Array(32);
    //   bytes32.set(utf8Bytes.slice(0, 32));
    //   return '0x' + Array.prototype.map.call(bytes32, x => ('00' + x.toString(16)).slice(-2)).join('');
    // }
    // dummyProof = stringToBytes32(dummyProof2);
    
  });

  describe("Testing makeBets()", function () {
    beforeEach(async function () {
      const endTimestamp =  Math.floor(Date.now() / 1000) + 5;
      await bettingMarket.connect(owner).startSeason(endTimestamp);
    });

    it("should add a new bet", async function () {
      await bettingMarket.connect(bettor1).makeBets(ethers.utils.parseEther("0.2"), player1Address, { value: ethers.utils.parseUnits("0.2", "ether") });
      const totalBets = await bettingMarket.getTotalBets();
      const totalFees = await bettingMarket.getTotalFees();
      expect(totalBets).to.deep.equal(ethers.BigNumber.from("190000000000000000"));
      expect(totalFees).to.deep.equal(ethers.BigNumber.from("10000000000000000"));
      const totalBetsforPlayer = await bettingMarket.getTotalBetsforPlayer(player1Address);
      expect(totalBetsforPlayer).to.deep.equal(ethers.BigNumber.from("190000000000000000"));
    });

    it("should update an existing bet", async function () {
      await bettingMarket.connect(bettor1).makeBets(ethers.utils.parseEther("0.3"), player1Address, { value: ethers.utils.parseUnits("0.3", "ether") });
      await bettingMarket.connect(bettor1).makeBets(ethers.utils.parseEther("0.2"), player1Address, { value: ethers.utils.parseUnits("0.2", "ether") });
      const totalBets = await bettingMarket.getTotalBets();
      const totalFees = await bettingMarket.getTotalFees();
      expect(totalBets).to.deep.equal(ethers.BigNumber.from("480000000000000000"));
      expect(totalFees).to.deep.equal(ethers.BigNumber.from("20000000000000000"));
      const totalBetsforPlayer = await bettingMarket.getTotalBetsforPlayer(player1Address);
      expect(totalBetsforPlayer).to.deep.equal(ethers.BigNumber.from("480000000000000000"));
    });

    it("should revert if bet amount lower than the entry fee", async function () {
      expect(bettingMarket.connect(bettor1).makeBets(ethers.utils.parseEther("0.1"), player1Address, dummyProof)).to.be.revertedWith("Bet amount lower than the entry fee");
    });

    it("should revert if bet amount higher than the maximum bet amount", async function () {
      expect(bettingMarket.connect(bettor1).makeBets(ethers.utils.parseEther("2.1"), player1Address, dummyProof)).to.be.revertedWith("Bet amount (minus entry fee) higher than the maximum bet amount");
    });

    it("should revert if bet amount (minus entry fee) lower than the minimum bet amount", async function () {
      expect(bettingMarket.connect(bettor1).makeBets(ethers.utils.parseEther("0.1"), player1Address, dummyProof)).to.be.revertedWith("Bet amount (minus entry fee) lower than the minimum bet amount");
    });
  });

  describe("Testing startSeason()", function () {  
    it("Should not start the season with an end timestamp in the past", async function () {
      const pastEndTimestamp = Math.floor(Date.now() / 1000) - 1000000;
      await expect(bettingMarket.connect(owner).startSeason(pastEndTimestamp)).to.be.revertedWith(
        "End timestamp must be in the future"
      );
    });
  
    it("Should not allow non-owner to start the season", async function () {
      const nonOwner = bettor1;
      const endTimestamp = Math.floor(Date.now() / 1000) + 5;
      await expect(bettingMarket.connect(nonOwner).startSeason(endTimestamp)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
      
    it("Should start the season with the correct event emitted", async function () {
      const expectedEndTimestamp = Math.floor(Date.now() / 1000) + 5;
      await expect(bettingMarket.connect(owner).startSeason(expectedEndTimestamp)).to.emit(bettingMarket, "SeasonStarted");
    });
  });
  

  describe("Testing endSeason()", function () {
    it("Should revert if called before starting the season", async function () {
      await expect(bettingMarket.connect(owner).endSeason()).to.be.revertedWith("Season not yet started");
    });

    it("Should revert if the caller is not the owner", async function () {
      const endTimeStamp = Math.floor(Date.now() / 1000) + 5;
      await bettingMarket.connect(owner).startSeason(endTimeStamp);
      await expect(bettingMarket.connect(bettor1).endSeason()).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if called before the season end timestamp", async function () {
      const endTimeStamp = Math.floor(Date.now() / 1000) + 5;
      await bettingMarket.connect(owner).startSeason(endTimeStamp);
      await expect(bettingMarket.connect(owner).endSeason()).to.be.revertedWith("Season not yet ended");
    });
  
    it("Should emit SeasonEnded event and update the seasonEndTime to 0", async function () {
      const endTimeStamp = Math.floor(Date.now() / 1000) + 5;
      await bettingMarket.connect(owner).startSeason(endTimeStamp);
      const seasonEndTimestamp = await bettingMarket.getseasonEndTimestamp();
      time.increaseTo(seasonEndTimestamp);
      await expect(bettingMarket.connect(owner).endSeason())
        .to.emit(bettingMarket, "SeasonEnded")
        .withArgs(seasonEndTimestamp);

      const newSeasonEndTime = await bettingMarket.getseasonEndTimestamp();
      expect(newSeasonEndTime).to.equal(0);
    });
  });

  describe("Testing distributeRewards()", function () {
    let bettor1WeightedBet: typeof BigNumber;
    let bettor2WeightedBet: typeof BigNumber;
    let player1WeightedBet: typeof BigNumber;
    let player2WeightedBet: typeof BigNumber;
    let player3WeightedBet: typeof BigNumber;

    beforeEach(async function () {
      // Start a new season
      const endTimestamp = Math.floor(Date.now() / 1000) + 100000;
      const MILISECONDS_PER_WEEK = 24 * 7 * 3600 * 1000;

      const seasonStartTimestamp = await time.latest();
      // seasonStartTimestamp = seasonStartTimestamp.toNumber();
      await bettingMarket.connect(owner).startSeason(endTimestamp);

      // Place some bets with varying timestamps
      await time.increaseTo(seasonStartTimestamp + 10000);
      await bettingMarket.connect(bettor1).makeBets(ethers.utils.parseEther("1"), player1Address, { value: ethers.utils.parseEther("1")});
      const bettor1Timestamp = await time.latest();
      bettor1WeightedBet = ethers.utils.parseUnits("1", 18).mul(bettor1Timestamp - seasonStartTimestamp).mul(3).div(MILISECONDS_PER_WEEK);
      
      await time.increaseTo(seasonStartTimestamp + 20000);
      await bettingMarket.connect(bettor2).makeBets(ethers.utils.parseEther("10"), player1Address, { value: ethers.utils.parseEther("2")});
      const bettor2Timestamp = await time.latest();
      bettor2WeightedBet = ethers.utils.parseEther("2").mul(bettor2Timestamp - seasonStartTimestamp).mul(3).div(MILISECONDS_PER_WEEK);

      await time.increaseTo(seasonStartTimestamp + 30000);
      await bettingMarket.connect(player1).makeBets(ethers.utils.parseEther("3"), player3Address, { value: ethers.utils.parseEther("3")});
      const player1Timestamp = await time.latest();
      player1WeightedBet = ethers.utils.parseEther("3").mul(player1Timestamp - seasonStartTimestamp).mul(3).div(MILISECONDS_PER_WEEK);

      await time.increaseTo(seasonStartTimestamp + 40000);
      await bettingMarket.connect(player2).makeBets(ethers.utils.parseEther("4"), player2Address, { value: ethers.utils.parseEther("4")});
      const player2Timestamp = await time.latest();
      player2WeightedBet = ethers.utils.parseEther("4").mul(player2Timestamp - seasonStartTimestamp).mul(3).div(MILISECONDS_PER_WEEK);

      await time.increaseTo(seasonStartTimestamp + 50000);
      await bettingMarket.connect(player3).makeBets(ethers.utils.parseEther("5"), player2Address, { value: ethers.utils.parseEther("5")});
      const player3Timestamp = await time.latest();
      player3WeightedBet = ethers.utils.parseEther("5").mul(player3Timestamp - seasonStartTimestamp).mul(3).div(MILISECONDS_PER_WEEK);

      // End the season
      await time.increaseTo(seasonStartTimestamp + 100000);
      await bettingMarket.connect(owner).endSeason();
    });

    it("should distribute rewards correctly via agent simulation", async function () {
      // Suppose player 1 and 3 win the primary market, so bettor 1, bettor 2, and player 1 won the secondary market
      // Calculate the total amount of bets on the winning outcome
      const totalLosingBets = ethers.utils.parseEther("4").add(ethers.utils.parseEther("5"));
      // Calculate the total reward pool
      const totalWeightedBets = bettor1WeightedBet.add(bettor2WeightedBet).add(player1WeightedBet).add(player2WeightedBet).add(player3WeightedBet);
      // Calculate the expected rewards for each bettor: principal + reward (bettorWeightedBet / totalWeightedBets * rewardPool)
      const expectedRewardsBettor1 = ethers.utils.parseEther("1").add(totalLosingBets.mul(bettor1WeightedBet).div(totalWeightedBets));
      const expectedRewardsBettor2 = ethers.utils.parseEther("10").add(totalLosingBets.mul(bettor2WeightedBet).div(totalWeightedBets));
      const expectedRewardsPlayer1 = ethers.utils.parseEther("3").add(totalLosingBets.mul(player1WeightedBet).div(totalWeightedBets));
      const expectedRewardsPlayer2 = ethers.utils.parseEther("0");
      const expectedRewardsPlayer3 = ethers.utils.parseEther("0");
      
      /// Check the balances before the rewards are distributed
      const bettor1Balance = await ethers.provider.getBalance(bettor1Address);
      const bettor2Balance = await ethers.provider.getBalance(bettor2Address);
      const player1Balance = await ethers.provider.getBalance(player1Address);
      const player2Balance = await ethers.provider.getBalance(player2Address);
      const player3Balance = await ethers.provider.getBalance(player3Address);

      // Distribute the rewards
      const winnerPlayers = [player1Address, player3Address];
      await bettingMarket.connect(owner).distributeRewards(winnerPlayers);

      // Check the balances before the rewards are distributed
      const bettor1Balance2 = await ethers.provider.getBalance(bettor1Address);
      const bettor2Balance2 = await ethers.provider.getBalance(bettor2Address);
      const player1Balance2 = await ethers.provider.getBalance(player1Address);
      const player2Balance2 = await ethers.provider.getBalance(player2Address);
      const player3Balance2 = await ethers.provider.getBalance(player3Address);

      // Check that the balances have increased for bettor1, bettor2 and player1 who won 
      expect(bettor1Balance2.gt(bettor1Balance));
      expect(bettor2Balance2.gt(bettor2Balance));
      expect(player1Balance2).gt(player1Balance);
      // Check that the balances have not changed for player2 and player3 who lost
      expect(player2Balance2).to.deep.equal(player2Balance);
      expect(player3Balance2).to.deep.equal(player3Balance);
    });
  
  });
});
