// eslint-disable-next-line import/no-extraneous-dependencies
import axios from "axios";

const BASE_URL = "http://localhost:3001";

interface LeaderboardData {
  displayName: string;
  score: number;
}

// gets the leaderboard data from backend. need to update url to local machine
const getLeaderboardData = (scoreCount: number) => {
  const leaderboardDataReturn: LeaderboardData[] = [];
  axios
    .get(`${BASE_URL}/leaderboard`, {
      params: {
        count: { scoreCount },
      },
    })
    .then((res) => {
      console.log(res);
      const inputFiles = res.data;
      for (let i = 0; i < inputFiles.length; i += 1)
        leaderboardDataReturn.push({ displayName: inputFiles[i][0], score: parseInt(inputFiles[i][1], 10) });
    });
  return leaderboardDataReturn;
};

// pushing a new leaderboard score
const pushLeaderboardData = (name: string, score: number, walletId: string) => {
  axios
    .post(`${BASE_URL}/leaderboard`, {
      name: { name },
      score: { score },
      walletid: { walletId },
    })
    .then((res) => {
      return res;
    });
};

// const getChatGPTResponse = (communityCards, gptCards, playerMoney, currentBet = 0) => {
//   const leaderboardDataReturn = [];
//   axios
//     .get("url____", {
//       params: {
//         count: { count },
//       },
//     })
//     .then((response) => {
//       const inputFiles = response["scores"];
//       for (let i = 0; i < inputFiles.length; i += 1)
//         leaderboardDataReturn.push({ displayName: inputFiles[i][0], score: parseInt(inputFiles[i][1], 10) });
//     });
//   return leaderboardDataReturn;
//   // -1: fold
//   // 0: bets 0
//   // x: bets
// };

export { pushLeaderboardData, getLeaderboardData };
