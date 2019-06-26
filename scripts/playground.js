// Usage: truffle migrate && truffle exec ./scripts/playground.js --network development

const HuntNft = artifacts.require("HuntNft");
const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

function encodeMatchToken(_tokenId, _partner) {
  return web3.eth.abi.encodeFunctionCall(
    {
      name: "matchToken",
      type: "function",
      inputs: [
        {
          type: "uint256",
          name: "_tokenId"
        },
        {
          type: "address",
          name: "_partner"
        }
      ]
    },
    [_tokenId, _partner]
  );
}

async function main() {
  const accounts = await web3.eth.getAccounts();

  const hunt = await HuntNft.deployed();

  await hunt.setPossibleCombination(1, 2, 9);
  await hunt.setPossibleCombination(3, 4, 10);
  await hunt.setPossibleCombination(5, 6, 11);
  await hunt.setPossibleCombination(7, 8, 12);

  await hunt.setPossibleCombination(9, 10, 13);
  await hunt.setPossibleCombination(11, 12, 14);

  await hunt.setPossibleCombination(13, 14, 15);

  for (const typeId of [...Array(8)].map((_, i) => i + 1)) {
    await hunt.mint(accounts[typeId], typeId);
  }

  // lvl 0 -> 1
  // creates tokens 9, 10
  await hunt.matchToken(1, accounts[2], { from: accounts[1] });
  await hunt.matchToken(2, accounts[1], { from: accounts[2] });

  // lvl 0 -> 1
  // creates tokens 11, 12
  await hunt.methods["safeTransferFrom(address,address,uint256,bytes)"](
    ZERO_ADDR,
    ZERO_ADDR,
    0,
    encodeMatchToken(3, accounts[4]),
    { from: accounts[3] }
  );
  await hunt.methods["safeTransferFrom(address,address,uint256,bytes)"](
    ZERO_ADDR,
    ZERO_ADDR,
    0,
    encodeMatchToken(4, accounts[3]),
    { from: accounts[4] }
  );

  // lvl 1 -> 2
  // creates tokens 13, 14
  await hunt.matchToken(9, accounts[4], { from: accounts[1] });
  await hunt.matchToken(12, accounts[1], { from: accounts[4] });

  // lvl 0 -> 1
  // creates tokens 15, 16, 17, 18
  await hunt.matchToken(5, accounts[6], { from: accounts[5] });
  await hunt.matchToken(6, accounts[5], { from: accounts[6] });
  await hunt.matchToken(7, accounts[8], { from: accounts[7] });
  await hunt.matchToken(8, accounts[7], { from: accounts[8] });

  // lvl 1 -> 2
  // creates tokens 19, 20
  await hunt.matchToken(15, accounts[8], { from: accounts[5] });
  await hunt.matchToken(18, accounts[5], { from: accounts[8] });

  // lvl 2 -> 3
  // creates tokens 21, 22
  await hunt.matchToken(13, accounts[8], { from: accounts[1] });
  await hunt.matchToken(20, accounts[1], { from: accounts[8] });
}

module.exports = async function(callback) {
  try {
    await main();
    callback();
  } catch (error) {
    callback(error);
  }
};
