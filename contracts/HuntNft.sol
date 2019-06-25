pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Metadata.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract HuntNft is ERC721, ERC721Metadata("Emoji Hunt", "HUNT"), Ownable {

    bytes4 constant internal REQUEST_COMBINATION = bytes4(keccak256("requestCombination(uint256,address)"));
    bytes4 constant internal APPROVE_COMBINATION = bytes4(keccak256("approveCombination(uint256,uint256)"));

    mapping(uint256 => uint256) types; // [tokenId] => [typeId]
    mapping(uint256 => mapping(uint256 => uint256)) possibleCombinations; // [type1][type2] => [resultingType]
    mapping(uint256 => address) pendingCombinations;

    uint256 lastTokenId;

    event CombinationRequested(address indexed _combiner, uint256 _tokenId1);
    event CombinationApproved(address indexed _combiner, address indexed _owner2, uint256 _resultingTypeId);


    constructor()  public {
        
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory _data) external {
        (bytes4 methodId, uint256 tokenId1, uint256 param2) = abi.decode(_data,(bytes4, uint256, uint256));
        if (methodId == REQUEST_COMBINATION) {
            requestCombination(tokenId1, address(param2));
        } else if (methodId == APPROVE_COMBINATION) {
            approveCombination(tokenId1, param2);
        } else {
            super.safeTransferFrom(_from, _to, _tokenId, _data);
        }
    }

    function requestCombination(uint256 _tokenId1, address _combiner) public {
        require(_isApprovedOrOwner(msg.sender, _tokenId1), "HN: unauthorized caller for requestCombination");
        pendingCombinations[_tokenId1] = _combiner;
        emit CombinationRequested(_combiner, _tokenId1);
    }

    function approveCombination(uint256 _tokenId1, uint256 _tokenId2) public {
        require(_isApprovedOrOwner(msg.sender, _tokenId2), "HN: unauthorized caller for approvedCombination");
        require(pendingCombinations[_tokenId1] == msg.sender, "HN: no pending combination");
        uint256 resultingType = possibleCombinations[types[_tokenId1]][types[_tokenId2]];
        require(resultingType > 0, "HN: impossible combination");
        address owner1 = ownerOf(_tokenId1);
        _burn(_tokenId1);
        _burn(_tokenId2);
        _mintWithType(owner1, resultingType);
        _mintWithType(msg.sender, resultingType);
        emit CombinationApproved(msg.sender, owner1, resultingType);
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

    //
    // Internal Methods
    //

    function _mintWithType(address _to, uint256 _typeId) internal {
        types[++lastTokenId] = _typeId;
        _mint(_to, lastTokenId);
    }
}