pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Metadata.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Enumerable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract HuntNft is ERC721, ERC721Metadata("Emoji Hunt", "HUNT"), ERC721Enumerable, Ownable {

    bytes4 constant internal MATCH_TOKEN_SIG = bytes4(keccak256("matchToken(uint256,address)"));

    mapping(uint256 => uint256) public types; // [tokenId] => [typeId]
    mapping(uint256 => mapping(uint256 => uint256)) public possibleCombinations; // [type1][type2] => [resultingType]

    mapping(address => Match) internal pendingMatches;

    uint256 public lastTokenId;

    uint256 public cashoutReward;
    address public cashoutToken;
    uint256 public cashableTypeId;

    struct Match {
        uint256 tokenId;
        address partner;
    }

    constructor() public {}

    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory _data) public {
        bytes4 sig;
        uint256 tokenId;
        address partner;
        assembly {
            sig := mload(add(_data, 0x20))
            tokenId := mload(add(_data, 0x24))
            partner := mload(add(_data, 0x44))
        }

        if (sig == MATCH_TOKEN_SIG) {
            matchToken(tokenId, partner);
        } else {
            super.safeTransferFrom(_from, _to, _tokenId, _data);
        }
    }

    function matchToken(uint256 _tokenId, address _partner) public {
        require(_isApprovedOrOwner(msg.sender, _tokenId), "HN: unauthorized caller for match");
        if(pendingMatches[_partner].partner == msg.sender) {
            uint256 partnerTokenId = pendingMatches[_partner].tokenId;
            uint256 resultingType = getResultingType(_tokenId, partnerTokenId);
            if(resultingType > 0) {
                _burn(_tokenId);
                _burn(partnerTokenId);
                _mintWithType(_partner, resultingType);
                _mintWithType(msg.sender, resultingType);
                delete pendingMatches[_partner];
                return;
            }
        }
        pendingMatches[msg.sender] = Match(_tokenId, _partner);
    }

    function getResultingType(uint256 _tokenId1, uint256 _tokenId2) public view returns (uint256 _resultingType) {
        uint256 typeId1 = types[_tokenId1];
        uint256 typeId2 = types[_tokenId2];
        uint256 minTypeId = typeId1 <= typeId2 ? typeId1 : typeId2;
        uint256 maxTypeId = typeId1 > typeId2 ? typeId1 : typeId2;
        return possibleCombinations[minTypeId][maxTypeId];
    }

    function cashout(uint256 _tokenId) external {
        require(_isApprovedOrOwner(msg.sender, _tokenId), "HN: unauthorized caller for cashout");
        require(cashableTypeId > 0 && types[_tokenId] == cashableTypeId, "HN: token is not cashable");
        _burn(_tokenId);
        if(cashoutToken != address(0)) {
            IERC20(cashoutToken).transfer(msg.sender, cashoutReward);
        } else {
            msg.sender.transfer(cashoutReward);
        }
    }

    //
    // Admin Methods
    //

    function mint(address _to, uint256 _typeId) external onlyOwner {
        _mintWithType(_to, _typeId);
    }

    function setPossibleCombination(
        uint256 _typeId1,
        uint256 _typeId2,
        uint256 _resultingTypeId
    )
        external
        onlyOwner
    {
        possibleCombinations[_typeId1][_typeId2] = _resultingTypeId;
    }

    function setCashout(
        address _token,
        uint256 _reward,
        uint256 _cashableTypeId
    )
        external
        onlyOwner
    {
        cashoutReward = _reward;
        cashoutToken = _token;
        cashableTypeId = _cashableTypeId;
    }

    function() external payable {}


    //
    // Internal Methods
    //

    function _mintWithType(address _to, uint256 _typeId) internal {
        types[++lastTokenId] = _typeId;
        _mint(_to, lastTokenId);
    }
}