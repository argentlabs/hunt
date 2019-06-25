const HuntNft = artifacts.require("HuntNft");

module.exports = function(deployer) {
  deployer.deploy(HuntNft);
};
