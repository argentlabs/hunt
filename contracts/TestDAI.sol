pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

/**
 * ERC20 test contract.
 */
contract TestDAI is ERC20 {

    string constant public symbol = "DAI";
    string constant public name = "DAI";
    uint8 public decimals = 18;

    constructor (address[] memory _initialAccounts, uint _supply) public {
        for(uint i = 0; i < _initialAccounts.length; i++) {
            _mint(_initialAccounts[i], _supply * 10**uint(decimals));
        }
    }

    function testTransfer(address recipient, uint256 amount) public returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }
}