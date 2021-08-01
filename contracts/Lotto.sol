//SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract Lotto {
    address public administrator;
    address payable[] public participants;
    
    constructor() {
        administrator = msg.sender;
    }
    
    function participate() public payable {
        require(msg.value > 0.01 ether, "A minimum payment of .01 ether must be sent to enter the lottery");
        participants.push(payable(msg.sender));
    }
    
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, participants)));
    }
    
    function drawLotto() public restricted {
        address contractAddress = address(this);
        uint index = random() % participants.length;
        
        participants[index].transfer(contractAddress.balance);
        participants = new address payable[](0);
    }
    
    function getParticipants() public view returns (address payable[] memory) {
        return participants;
    }
    
    modifier restricted() {
        require(msg.sender == administrator, "Only administrator can call this function.");
        _;
    }
}