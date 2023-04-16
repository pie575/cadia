// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

/// @title ZKaptcha anti-bot interface
/// @notice Implements ZKaptcha for Betting market
interface ZKaptchaInterface {
	function verifyZkProof(
		 bytes calldata zkProof
	) external view returns (bool);
}

/// @title Betting contract for PokerGPT
/// @author Bofan Ji
/// @notice Made for players to bet on who they think has the highest score of the season
/// @dev All functions work properly but may be inefficent
/// @custom:experimental This is an experimental contract
contract bettingMarket is Ownable {
    using SafeMath for uint256;
    struct Bet {
        uint256 wager; /// the amount that the bettor bet on the player
        address bettor; /// address of the bettor
        uint256 weight; /// weight of the bet based on time multiplers and wager multipliers
    }

    /// mapping from player to the amount of bets on the player and the address of the bettor
    mapping(address => Bet[]) private betsTracking;
    ZKaptchaInterface zkaptcha;
    uint256 private totalWager; /// total wagers made this season
    uint256 private managementFees; /// total fees earned from bets
    uint256 private seasonStartTimestamp; /// Unix timestamp of start
    uint256 private seasonEndTimestamp; /// Unix timestamp of ending, determined by Owner
    uint256 MAXIMUM_BET_AMOUNT;
    uint256 MINIMUM_BET_AMOUNT;
    uint256 entryFee; /// entry fee for betting
    uint256 constant MILISECONDS_PER_WEEK = 24 * 7 * 3600 * 1000;

    event BetMade(address indexed player, uint256 betAmount, uint256 betTimeStamp);
    event SeasonStarted(uint256 seasonStartTimestamp);
    event SeasonEnded(uint256 seasonEndTimestamp);
    event BetSold(address indexed player, uint256 betAmount, uint256 sellPrice);
    event BetBought(address indexed player, uint256 betAmount, uint256 buyPrice);
    event ManagementFeeWithdrawn(address withdrawer, address to, uint256 amount);
    event PrizePoolDistributed(uint256 totalBetsonLosers);

    /// @dev The bet amounts are to prevent spams and potentical attacks. Can be adjusted by Owner
    constructor() {
        seasonStartTimestamp = 0;
        seasonEndTimestamp = 0;
        MAXIMUM_BET_AMOUNT = 10 ether;
        MINIMUM_BET_AMOUNT = 0.1 ether;
        entryFee = 0.01 ether;

        // INSTANTIATE THE INTERFACE
        zkaptcha = ZKaptchaInterface(0xf5DCa59461adFFF5089BE5068364eC10B86c2a88);
    }
    
    receive() external payable {}

    /// @notice Create a bet on another player, weighted more for early bets
    /// @dev For loop needs to be optimized such to prevent potential spam DDOS attack
    /// @param amount The amount of ether the wagerer puts down
    /// @param player The PokerGPT player the wagerer wishes to bet on 
    /// @param proof The zkaptcha proof
    function makeBets(uint256 amount, address player, bytes32[] memory proof) external payable {
        require(amount >= entryFee, "Bet amount lower than the entry fee"); 
        require(amount - entryFee >= MINIMUM_BET_AMOUNT, "Bet amount (minus entry fee) lower than the minimum bet amount");
        require(amount - entryFee <= MAXIMUM_BET_AMOUNT, "Bet amount (minus entry fee) higher than the maximum bet amount");
        require(seasonIsStarted(), "Season has not started yet");
        require(!seasonIsEnded(), "Season has ended");
        require(zkaptcha.verifyZkProof(abi.encodePacked(proof)));
        /// pay the entry fee to the contract and deduct it from the bet amount
        amount -= entryFee;
        managementFees += entryFee;
        /// calculate the weight of the bet based on time multiplers and wager multipliers
        uint256 betTimeStamp = block.timestamp;
        uint256 timeMultiplier = 1 + (betTimeStamp - seasonStartTimestamp).mul(3).div(MILISECONDS_PER_WEEK);
        // uint256 wagerMultiplier = 3 - 3 * numBetter / numPlayer;
        uint256 newWeight = timeMultiplier;
        /// if the bettor has already bet on the player, increment the amount of the bet
        bool bettorFound = false;
        for (uint256 i = 0; i < betsTracking[player].length; i++) {
            if (betsTracking[player][i].bettor == msg.sender) {
                /// calculate the average weight of the bet
                uint256 totalWeightedBet = betsTracking[player][i].weight.mul(betsTracking[player][i].wager) + newWeight.mul(amount);
                betsTracking[player][i].weight = totalWeightedBet.div((betsTracking[player][i].wager + amount));
                betsTracking[player][i].wager += amount;
                bettorFound = true;
                break;
            }            
        }

        /// if the bettor has not bet on the player, add a new bet
        if (bettorFound == false) {
            Bet memory bet = Bet({wager: amount, bettor: msg.sender, weight: newWeight});
            betsTracking[player].push(bet);
        }
        totalWager += amount;
        emit BetMade(player, amount, betTimeStamp);
    }

    /// @notice Start a new Season
    /// @dev Only for Owner
    /// @param _seasonEndTimestamp Unix timestamp for when to end
    function startSeason(uint256 _seasonEndTimestamp) external onlyOwner {
        require(seasonIsStarted() == false, "Season already started");
        require(_seasonEndTimestamp > block.timestamp, "End timestamp must be in the future");
        seasonStartTimestamp = block.timestamp;
        seasonEndTimestamp = _seasonEndTimestamp;
        emit SeasonStarted(seasonStartTimestamp);
    }
    
    /// @notice End Season, used to end season after time has passed
    /// @dev Only for Owner
    function endSeason() external onlyOwner {
        require(seasonIsStarted(), "Season not yet started");
        require(block.timestamp >= seasonEndTimestamp, "Season not yet ended");

        emit SeasonEnded(seasonEndTimestamp);
        seasonStartTimestamp = 0;
        seasonEndTimestamp = 0;
    }

    function seasonIsEnded() private view returns (bool) {
        return seasonEndTimestamp == 0 && block.timestamp >= seasonEndTimestamp;
    }

    function seasonIsStarted() private view returns (bool) {
        return seasonStartTimestamp != 0 && block.timestamp >= seasonStartTimestamp;
    }

    function getseasonEndTimestamp() external view returns (uint256) {
        return seasonEndTimestamp;
    }

    function getseasonStartTimestamp() external view returns (uint256) {
        return seasonStartTimestamp;
    }
    
    /// @notice Withdraw the management fee earned by the contract
    /// @dev Only for Owner
    /// @param to_ The address to withdraw the management fee to
    function withdrawManagementFee(address payable to_) external onlyOwner {
        to_.transfer(managementFees);

        emit ManagementFeeWithdrawn(msg.sender, to_, managementFees);
    }

    /// @notice Distribute Rewards to those who bet on the winning players
    /// @dev Owner only. Nested loops should to be optimized such to prevent potential spam DDOS attack
    /// @param winnerPlayers List of all the addresses considered winners. Usually limited to top 3
    function distributeRewards(address payable[] calldata winnerPlayers) external onlyOwner {
        require(seasonIsEnded() == true, "Season has not ended yet");
        require(winnerPlayers.length > 0, "No winners");
        /// assume the total bets on winnerPlayers are non-zero
        /// sum over the total amount of bets that are not on the winners
        uint256 totalBetsonWinners = 0;
        uint256 winnerBettorsWeightedSum = 0;
        for (uint256 i = 0; i < winnerPlayers.length; i++) {
            for (uint256 j = 0; j < betsTracking[winnerPlayers[i]].length; j++) {
                Bet memory winningBet = betsTracking[winnerPlayers[i]][j];
                address _bettor = winningBet.bettor;
                totalBetsonWinners += winningBet.wager;
                winnerBettorsWeightedSum += winningBet.weight.mul(winningBet.wager);
                /// transfer the original bet amount to each successful bettor
                console.log("Sending %s to %s", winningBet.wager, _bettor);
                (bool sent, ) = _bettor.call{value:winningBet.wager}("");
                require(sent, "Failed to send Ether");
            }
        }
        uint256 totalBetsonLosers = totalWager - totalBetsonWinners;
        /// distribute totalBetsonLosers to the successful bettors based on the proportion of their weighted bets over total weighted bets
        for (uint256 i = 0; i < winnerPlayers.length; i++) {
            for (uint256 j = 0; j < betsTracking[winnerPlayers[i]].length; j++) {
                Bet memory winningBet = betsTracking[winnerPlayers[i]][j];
                address _bettor = winningBet.bettor;

                uint256 claimofPrizePool = winningBet.wager.mul(winningBet.weight).div(winnerBettorsWeightedSum);
                /// transfer the proportional claim of the prize pool to each successful bettor
                console.log("Sending %s to %s", winningBet.wager, _bettor);
                (bool sent, ) = _bettor.call{value:claimofPrizePool.mul(totalBetsonLosers * 1.0)}("");
                require(sent, "Failed to send Ether");
            }
        }
        emit PrizePoolDistributed(totalBetsonLosers);
    }

    function getTotalBets() external view returns (uint256) {
        return totalWager;
    }

    function getTotalFees() external view returns (uint256) {
        return managementFees;
    }
    
    /// @notice Gets the amount of bets place on a player, in case no one bet on winner
    /// @dev For loop needs to be optimized such to prevent potential spam DDOS attack
    /// @param player The address of the player we want to check
    /// @return amount of total eth placed on player
    function getTotalBetsforPlayer(address player) external view returns (uint256) {
        uint256 totalBetsPlayer = 0;
        for (uint256 i = 0; i < betsTracking[player].length; i++) {
            totalBetsPlayer += betsTracking[player][i].wager;
        }
        return totalBetsPlayer;
    }

    /// @dev Used to adjust max bet ammounts by owner
    function resetMaxiumBetAmount(uint256 _maxBetAmount) external onlyOwner {
        MAXIMUM_BET_AMOUNT = _maxBetAmount;
    }

    /// @dev Used to adjust min bet ammounts by owner
    function resetMinimumBetAmount(uint256 _minBetAmount) external onlyOwner {
        MINIMUM_BET_AMOUNT = _minBetAmount;
    }

    /// @dev Used to adjust entry fees by owner
    function resetEntryFee(uint256 _entryFee) external onlyOwner {
        entryFee = _entryFee;
    }
}