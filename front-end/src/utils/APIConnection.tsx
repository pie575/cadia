// eslint-disable-next-line import/no-extraneous-dependencies
import axios from "axios";
import { Card } from "../engine/Card";

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
      const inputFiles = res.data.scores;
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

// getting chatGPT response given player input
const getChatGPTPrompt = (
  communityCards: Array<Card>,
  gptCards: Array<Card>,
  playerMoney: number,
  pastRounds: Array<Number>,
  chatGPTisBigBlind: boolean,
  opponentBet = 0,
) => {
  axios
    .get(`${BASE_URL}/chatgpt_prompt`, {
      params: {
        money: playerMoney,
        cards: gptCards,
        community: communityCards,
        bet: opponentBet,
        isBigBlind: chatGPTisBigBlind,
        past_rounds: pastRounds,
      },
    })
    .then((response) => {
      return response.data.prompt;
    });
};

// getting chatGPT prompt given player input
const getChatGPTResponse = (
  communityCards: Array<Card>,
  gptCards: Array<Card>,
  playerMoney: number,
  pastRounds: Array<Number>,
  chatGPTisBigBlind: boolean,
  opponentBet = 0,
) => {
  let value = -1;
  axios
    .post(`${BASE_URL}/chatgpt_response`, {
      params: {
        money: playerMoney,
        cards: gptCards,
        community: communityCards,
        bet: opponentBet,
        isBigBlind: chatGPTisBigBlind,
        past_rounds: pastRounds,
      },
    })
    .then((response) => {
      value = response.data.bet;
    });
  return value;
};

export { pushLeaderboardData, getLeaderboardData, getChatGPTResponse, getChatGPTPrompt };
