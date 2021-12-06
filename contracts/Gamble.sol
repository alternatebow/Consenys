// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Gamble is VRFConsumerBase, Ownable, ReentrancyGuard{
    mapping(uint256 => Round) public games;

    enum BetTypes{PASS, DONT_PASS}

    event DiceResults(uint roll1, uint roll2);

    event Winner(address roller, BetTypes bet);

    event Loser(address roller, BetTypes bet);

    event Point(address roller, BetTypes bet, uint point);
    
    event Withdraw(address admin, uint amount);
    
    event BetPlaced(address bettor, uint amount);

    
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public current = 1;
    uint256 public rolledIndex = 1;
    uint256 public minBet = 1000000000000000; // Minimum bet is 1 Finney
    uint256 public randomResult;
    event RequestedRandomness(bytes32 requestId);
    
    modifier atLeastMinBet(uint ante){
        require(ante >= minBet, "Minimum bet is too low");
        _;
    }

    struct Round {
        uint256 betAmount;
        BetTypes typeBet;
        uint rollOne;
        uint rollTwo;
        uint point;
        bool rollFinished;
    }
    /**
     * Constructor inherits VRFConsumerBase
     * 
     * Network: Kovan
     * Chainlink VRF Coordinator address: 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9
     * LINK token address:                0xa36085F69e2889c224210F603D836748e7dC0088
     * Key Hash: 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4
     */
    constructor(address _linkTokenAddress, bytes32 _keyHash, 
    address _vrfCoordinatorAddress, uint256 _fee)
        public
        VRFConsumerBase(
            _vrfCoordinatorAddress,
            _linkTokenAddress)
    {
        keyHash = _keyHash;
        fee = _fee;
    }

    function getCurrentBetType() public view onlyOwner returns(BetTypes) {
        return games[current].typeBet;
    }
    
    function createGame (BetTypes typeBet) public payable atLeastMinBet(msg.value) onlyOwner {
        if (games[current].rollOne == 0) {
            games[current] = Round(msg.value, typeBet, 0, 0, 0, false);
            emit BetPlaced(msg.sender, msg.value);
        }
    }

    /** 
     * Requests randomness from a user-provided seed
     */
    function getRandomNumber() public returns (bytes32 requestId) {
        requestId = requestRandomness(keyHash, fee);
        emit RequestedRandomness(requestId);
    }

    function evaluateRoll() public onlyOwner  {
        require(games[current].rollFinished, "Roll has not been completed yet!");

        emit DiceResults(games[current].rollOne, games[current].rollTwo);
        
        uint sum = games[current].rollOne + games[current].rollTwo;
        
        if (games[current].point == 0 && !(sum == 2 || sum == 3 || sum == 7 || sum == 11 || sum == 12)) {
            games[current].point = sum;
            emit Point(owner(), games[current].typeBet, games[current].point);
        } else {
        
            if (games[current].typeBet == BetTypes.PASS && games[current].point == 0) {
               if (sum == 7 || sum == 11){
                    payOut();
               } 
               if (sum == 2 || sum == 3 || sum == 12) {
                   emit Loser(msg.sender, BetTypes.PASS);
                   current += 1;
               }
    
           } else if (games[current].typeBet == BetTypes.DONT_PASS && games[current].point == 0) {
               if (sum == 2 || sum == 3 || sum == 12) {
                    payOut();
               } 
               if (sum == 7 || sum == 11){
                    emit Loser(msg.sender, BetTypes.PASS);
                    current += 1;
               }
               
           } else if (games[current].typeBet == BetTypes.PASS && games[current].point != 0) {
               if (sum == 7) {
                   emit Loser(msg.sender, BetTypes.PASS);
                   current += 1;
               }
               if (sum == games[current].point) {
                   payOut();  
               }
               
           } else if (games[current].typeBet == BetTypes.DONT_PASS && games[current].point != 0) {
               if (sum == 7) {
                   payOut();
               }
               if (sum == games[current].point) {
                   emit Loser(msg.sender, BetTypes.DONT_PASS);
                   current += 1;
               }  
            }
        }   
    }

    function getCurrentRollValues (uint dieNum) public onlyOwner  view returns(uint) {
        require(dieNum == 1 || dieNum == 2, "Invalid die number");
        if (dieNum == 1) {
            return games[current].rollOne;
        } else {
            return games[current].rollTwo;
        }
        
    }

    function payOut () internal onlyOwner  {
        current += 1;
        payable(owner()).transfer(2 * games[current].betAmount);
        emit Winner(msg.sender, games[current - 1].typeBet);
        
    }
    /** 
     * Requests the address of the Chainlink Token on this network 
     */
    function getChainlinkToken() public view returns (address) {
        return address(LINK);
    }

    fallback() external payable {}

    receive() external payable {}
    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness (bytes32 requestId, uint256 randomness) internal override {
        rolledIndex = rolledIndex % 2;
        if (rolledIndex == 0) {
            games[current].rollOne = (randomness % 6) + 1;
        } else {
            games[current].rollTwo = (randomness % 6) + 1;
        }
        rolledIndex += 1;
        if (games[current].rollOne != 0 && games[current].rollTwo != 0){
            games[current].rollFinished = true;
        }
    }
}
