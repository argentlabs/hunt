const HuntNft = artifacts.require("HuntNft");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(HuntNft);
};
