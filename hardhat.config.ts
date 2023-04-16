import { HardhatUserConfig, extendEnvironment } from "hardhat/config";

// PLUGINS
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";

// Process Env Variables
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const PK = process.env.PK;
const ALCHEMY_ID = process.env.ALCHEMY_ID;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",

  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_ID}`,
        blockNumber: 17040052,
      },
    },

    mainnet: {
      accounts: PK ? [PK] : [],
      chainId: 1,
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_ID}`,
    },

    arbitriumOne: {
      accounts: PK ? [PK] : [],
      chainId: 42161,
      url: `https://https://arb1.arbitrum.io/rpc`,
    },

    arbitriumGoerli: {
      accounts: PK ? [PK] : [],
      chainId: 421613,
      url: `https://goerli-rollup.arbitrum.io/rpc`,
    },
  },
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
}

extendEnvironment((hre) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (hre as any).reset = async (
    jsonRpcUrl: string,
    blockNumber: number
  ): Promise<void> => {
    await hre.network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl: jsonRpcUrl,
            blockNumber: blockNumber,
          },
        },
      ],
    });
  };
});

export default config;