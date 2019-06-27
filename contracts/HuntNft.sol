pragma solidity ^0.5.0;

// import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
// import "./TestDAI.sol";

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Metadata.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Enumerable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract HuntNft is ERC721, IERC721Metadata, ERC721Enumerable, Ownable {

    bytes4 constant internal MATCH_TOKEN_SIG = bytes4(keccak256("matchToken(uint256,address)"));
    string constant public name = "Emoji Hunt";
    string constant public symbol = "HUNT";

    mapping(uint256 => uint256) public types; // [tokenId] => [typeId]
    mapping(uint256 => mapping(uint256 => uint256)) public possibleCombinations; // [type1][type2] => [resultingType]
    mapping(uint256 => uint256) public duals;

    mapping(address => Match) internal pendingMatches;

    uint256 public lastTokenId;
    uint256 public maxTypeId;

    uint256 public cashoutReward;
    address public cashoutToken;
    uint256 public cashableTypeId;

    string public baseURI;

    struct Match {
        uint256 tokenId;
        address partner;
    }

    constructor() public {}

    //
    // Metadata
    //

    function tokenURI(uint256 _tokenId) external view returns (string memory) {
        return getURIForType(types[_tokenId]);
    }

    function dualTokenURI(uint256 _tokenId) external view returns (string memory) {
        return getURIForType(duals[types[_tokenId]]);
    }

    function  getURIForType(uint256 _typeId) public view returns (string memory) {
        return string(abi.encodePacked(baseURI, uint2str(_typeId)));
    }

    function uint2str(uint256 _i) internal pure returns (string memory _uintAsString) {
        uint256 i = _i;
        if (i == 0) {
            return "0";
        }
        uint256 j = i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len - 1;
        while (i != 0) {
            bstr[k--] = byte(uint8(48 + i % 10));
            i /= 10;
        }
        return string(bstr);
    }

    // function uint2str(uint256 data) internal pure returns (string memory) {
    //     bytes memory bytesString = new bytes(32);
    //     for (uint256 j = 0; j < 32; j++) {
    //         byte char = byte(bytes32(data * 2 ** (8 * j)));
    //         if (char != 0) {
    //             bytesString[j] = char;
    //         }
    //     }
    //     return string(bytesString);
    // }

    //
    // Match
    //

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
        uint256 minTypeId_ = typeId1 <= typeId2 ? typeId1 : typeId2;
        uint256 maxTypeId_ = typeId1 > typeId2 ? typeId1 : typeId2;
        return possibleCombinations[minTypeId_][maxTypeId_];
    }

    //
    // Cash Out
    //

    function cashout(uint256 _tokenId) external {
        require(_isApprovedOrOwner(msg.sender, _tokenId), "HN: unauthorized caller for cashout");
        require(isCashable(_tokenId), "HN: token is not cashable");
        _burn(_tokenId);
        if(cashoutToken != address(0)) {
            // uint256 x = IERC20(cashoutToken).balanceOf(address(this));//cashoutReward);
            // require(IERC20(cashoutToken).balanceOf(address(this)) == 1000000000000000000000, "ERR: BALANCE");
            // IERC20(cashoutToken).transfer(msg.sender, 1);
            IERC20(cashoutToken).transfer(msg.sender, cashoutReward);
            // TestDAI(cashoutToken).testTransfer(msg.sender, 1);//cashoutReward);
        } else {
            msg.sender.transfer(cashoutReward);
        }
    }

    // function cashout_test(uint256 _tokenId) external returns (bool _ret) {
    //     // (bool s, ) = cashoutToken.call.gas(100000)(abi.encodeWithSignature("transfer(address,uint256)", msg.sender, 1));
    //     // IERC20(cashoutToken).transfer.gas(50000)(msg.sender, 1);
    //     return true;
    // }

    function isCashable(uint256 _tokenId) public view returns (bool) {
        return cashableTypeId > 0 &&
            types[_tokenId] == cashableTypeId &&
            _exists(_tokenId) && (
                cashoutToken != address(0) && IERC20(cashoutToken).balanceOf(address(this)) >= cashoutReward ||
                cashoutToken == address(0) && address(this).balance >= cashoutReward
            );
    }

    //
    // Admin
    //

    function setBaseURI(string calldata _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function mint(address _to, uint256 _typeId) external onlyOwner {
        require(_typeId <= maxTypeId, "HN: Invalid _typeId");
        _mintWithType(_to, _typeId);
    }

    function mintRandomType(address _to) external onlyOwner {
        _mintWithType(_to, (uint160(_to) % maxTypeId) + 1);
    }

    function setPossibleCombination(
        uint256 _typeId1,
        uint256 _typeId2,
        uint256 _resultingTypeId
    )
        external
        onlyOwner
    {
        require(_typeId1 <= _typeId2, "HN: wrong _typeId order");
        possibleCombinations[_typeId1][_typeId2] = _resultingTypeId;
        if(_typeId2 > maxTypeId) maxTypeId = _typeId2;
        duals[_typeId1] = _typeId2;
        duals[_typeId2] = _typeId1;
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
    // Internal
    //

    function _mintWithType(address _to, uint256 _typeId) internal {
        types[++lastTokenId] = _typeId;
        _mint(_to, lastTokenId);
    }
}