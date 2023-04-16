async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const BettingMarket = await ethers.getContractFactory("bettingMarket");
    const bettingMarket = await BettingMarket.deploy();
  
    console.log("betting Market address:", bettingMarket.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });