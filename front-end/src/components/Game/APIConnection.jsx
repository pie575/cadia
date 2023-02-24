import axios from "axios";

// gets the leaderboard data from backend. need to update url to local machine
const getLeaderboardData = (count) => {
  const leaderboardDataReturn = [];
  axios
    .get("url____", {
      params: {
        count: { count },
      },
    })
    .then((response) => {
      const inputFiles = response["scores"];
      for (let i = 0; i < inputFiles.length; i += 1)
        leaderboardDataReturn.push({ displayName: inputFiles[i][0], score: parseInt(inputFiles[i][1], 10) });
    });
  return leaderboardDataReturn;
};

// pushing a new leaderboard score 
const pushLeaderboardData = (name, score, walletID) => {
  const leaderboardDataReturn = [];
  let ret = -1;
  axios
    .post("url____", {
      params: {
        name: { name },
        score: {score},
        walletid: {walletID},
      },
    }).then((response) => {
      ret = response['status code'];
    })
  return ret;
};

const getChatGPTResponse = (communityCards, gptCards, playerMoney, currentBet = 0) => {
  const leaderboardDataReturn = [];
  axios
    .get("url____", {
      params: {
        count: { count },
      },
    })
    .then((response) => {
      const inputFiles = response["scores"];
      for (let i = 0; i < inputFiles.length; i += 1)
        leaderboardDataReturn.push({ displayName: inputFiles[i][0], score: parseInt(inputFiles[i][1], 10) });
    });
  return leaderboardDataReturn;
  //-1: fold
  //0: bets 0
  //x: bets
};