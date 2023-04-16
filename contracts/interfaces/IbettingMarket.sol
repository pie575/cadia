// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

interface IbettingMarket {
    event BetMade(address indexed player, uint256 betAmount);

    event SeasonStart(uint256 seasonStartTimestamp);

    event SeasonEnd(uint256 seasonEndTimestamp);

    event BetSold(address indexed player, uint256 betAmount, uint256 sellPrice);

    event BetBought(address indexed player, uint256 betAmount, uint256 buyPrice);

    function makeBets(uint256 betAmount, address player) external payable;

    function distributeRewards(address payable[] calldata winnerWallets) external payable;

    function startSeason() external;

    function endSeason() external;

    function withdrawManagementFee(address payable to_) external;
     
    function isSeasonEnded() external view returns(bool);
     
    function getTotalbets() external view returns(uint256);

    function getTotalFees() external view returns (uint256);

    function getseasonEndTimestamp() external view returns (uint256);

    function getseasonStartTimestamp() external view returns (uint256);

    function getTotalBetsforPlayer(address player) external view returns(uint256);

    function resetMaxiumBetAmount(uint256 _maxBetAmount) external;

    function resetMinimumBetAmount(uint256 _minBetAmount) external;

    function resetEntryFee(uint256 _entryFee) external;

}