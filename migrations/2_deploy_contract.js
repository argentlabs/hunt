const HuntNft = artifacts.require("HuntNft");
const DAI = artifacts.require("TestDAI");
const BASE_URI = "https://cloud-test.argent-api.com/v1/hunt/";

module.exports = async function(deployer, network, accounts) {
  console.log("Deploying Contracts...");
  await deployer.deploy(HuntNft);
  const hunt = await HuntNft.deployed();
  // console.log("hunt.address", hunt.address);
  await deployer.deploy(DAI, [hunt.address, accounts[0]], 2000);
  const dai = await DAI.deployed();

  console.log("Setting metadata...");
  await hunt.setBaseURI(BASE_URI);

  console.log("Setting Reward...");
  await hunt.setCashout(dai.address, web3.utils.toWei("500"), 15);

  console.log("Setting Possible combinations...");
  await hunt.setPossibleCombination(1, 2, 9);
  await hunt.setPossibleCombination(3, 4, 10);
  await hunt.setPossibleCombination(5, 6, 11);
  await hunt.setPossibleCombination(7, 8, 12);

  await hunt.setPossibleCombination(9, 10, 13);
  await hunt.setPossibleCombination(11, 12, 14);

  await hunt.setPossibleCombination(13, 14, 15);
};
