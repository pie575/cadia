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
        count: scoreCount,
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

// getting prompt for chatGPT without card information
const getChatGPTPrompt = async (
  communityCards: Array<Card>,
  gptCards: Array<Card>,
  playerMoney: number,
  pastRounds: Array<Number>,
  chatGPTisBigBlind: boolean,
  opponentBet: number,
  chatGPTCurrentBet: number,
  bigBlindAmount: number,
) => {
  let ret = "";
  try {
    const response = await axios.post(`${BASE_URL}/chatgpt_prompt`, {
      money: playerMoney,
      cards: gptCards,
      community: communityCards,
      bet: opponentBet,
      isBigBlind: chatGPTisBigBlind,
      past_rounds: pastRounds,
      chatGPTCurrentBet,
      bigBlindAmount,
    });
    console.log(`prompt: ${response.data.prompt}`);
    ret = response.data.prompt;
  } catch (error) {
    console.log("error: ", error);
  }
  return ret;
};

// getting chatGPT response given player input
const getChatGPTResponse = async (
  communityCards: Array<Card>,
  gptCards: Array<Card>,
  playerMoney: number,
  pastRounds: Array<Number>,
  chatGPTisBigBlind: boolean,
  opponentBet: number,
  chatGPTCurrentBet: number,
  bigBlindAmount: number,
) => {
  let value = { bet: -1, response: "dummy response" };
  console.log("calling axios");
  try {
    const response = await axios.post(`${BASE_URL}/chatgpt_response`, {
      money: playerMoney,
      cards: gptCards,
      community: communityCards,
      bet: opponentBet,
      isBigBlind: chatGPTisBigBlind,
      past_rounds: pastRounds,
      chatGPTCurrentBet,
      bigBlindAmount,
    });
    console.log("response: ", response);
    value = response.data;
  } catch (error) {
    console.log("error: ", error);
  }
  console.log("value: ", value);
  return value;
};

export { pushLeaderboardData, getLeaderboardData, getChatGPTResponse, getChatGPTPrompt };
