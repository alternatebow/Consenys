// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title A simulation of a single person craps game
/// @author Calvin S. Lee
/// @notice You can use this contract to simulate a craps game; betting with ether
/// @dev Currently only deployed on the Kovan network

contract Gamble is VRFConsumerBase, Ownable, ReentrancyGuard{
    mapping(uint256 => Round) public games;

    enum BetTypes{PASS, DONT_PASS}

    event DiceResults(uint roll1, uint roll2);

    event Winner(address roller, BetTypes bet, uint reward);

    event Loser(address roller, BetTypes bet);

    event Point(address roller, BetTypes bet, uint point);
    
    event BetPlaced(address bettor, BetTypes bet, uint amount);

    event RollEvaluated(address bettor, BetTypes bet, uint rollValue);

    event RequestedRandomness(bytes32 requestId);

    bytes32 internal keyHash;
    uint256 internal fee;

    /// @notice Counter for the current betting round
    uint256 public current = 1; 

    /// @notice Index that alternates which die gets assigned a value
    uint256 public rolledIndex = 0; 

    /// @notice Minimum bet is 0.01 Finney
    uint256 public minBet = 10000000000000; 
 
    
    /// @notice Enforces that the minimum bet is 1 Finney (0.001 ETH)
    /// @param ante The bet placed on the current round, reverts if too low 
    modifier atLeastMinBet(uint ante){
        require(ante >= minBet, "Minimum bet is too low");
        _;
    }

    struct Round {
        BetTypes typeBet;
        uint256 betAmount;
        uint rollOne;
        uint rollTwo;
        uint point;
        uint rollCounter;
        bool rollEvaluated; 
        bool roundComplete;
    }

    /// @dev Constructor inherits VRFConsumerBase
    /// @dev Network: Kovan
    /// @dev VRF coordinator address: 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9
    /// @dev LINK token address:                0xa36085F69e2889c224210F603D836748e7dC0088
    /// @dev Key Hash: 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4

    /// @param _linkTokenAddress Initialize the contract with the appropriate link address for network
    /// @param _vrfCoordinatorAddress Initialize contract with correct vrf coordinator (for random number)
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

    
    /// @notice Creates a betting round and maps it to games. Will only create a new round if the current round is finished.
    /// @param typeBet The type of bet for the current round; Pass or No Pass
    /// @dev Is a payable function and which the value is checked against the minimum bet to see if valid
    function createGame (BetTypes typeBet) public payable atLeastMinBet(msg.value) onlyOwner {
        if (!games[current].roundComplete) {
            games[current] = Round(typeBet, msg.value, 0, 0, 0, 0, true, true);
            emit BetPlaced(msg.sender, typeBet, msg.value);
        }
    }


    /// @notice Requests randomness from a user-provided seed
    function getRandomNumber() public onlyOwner returns (bytes32 requestId) {
        require(games[current].rollEvaluated == true, "Roll needs to be checked!");
        requestId = requestRandomness(keyHash, fee);
        emit RequestedRandomness(requestId);
    }

    
    /// @notice Checks values against the Bet type and determines a winner, loser or re-roll according to craps rules
    function evaluateRoll() public onlyOwner  {
        require(games[current].rollOne != 0 || games[current].rollTwo != 0, "Invalid Roll!");
        require(games[current].rollEvaluated == false, "Roll is already checked!");
        
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
                   emit Loser(msg.sender, games[current].typeBet);
                   current += 1;
               }
    
           } else if (games[current].typeBet == games[current].typeBet && games[current].point == 0) {
               if (sum == 2 || sum == 3 || sum == 12) {
                    payOut();
               } 
               if (sum == 7 || sum == 11){
                    emit Loser(msg.sender, games[current].typeBet);
                    current += 1;
               }
               
           } else if (games[current].typeBet == BetTypes.PASS && games[current].point != 0) {
               if (sum == 7) {
                   emit Loser(msg.sender, games[current].typeBet);
                   current += 1;
               }
               if (sum == games[current].point) {
                   payOut();  
               }
               
           } else if (games[current].typeBet == games[current].typeBet && games[current].point != 0) {
               if (sum == 7) {
                   payOut();
               }
               if (sum == games[current].point) {
                   emit Loser(msg.sender, games[current].typeBet);
                   current += 1;
               }  
            }
        }
        /// @dev Ensures that you must evaluate the roll before rolling again. (No do-overs)
        games[current].rollEvaluated = true;
        emit RollEvaluated(msg.sender, games[current].typeBet, sum);
     
    }
    
    
    /// @notice Pay out method, awarded if roller wins.
    /// @dev Applied nonReentrant modifier to provide protection against recursive reentrancy attack
    function payOut () internal onlyOwner nonReentrant  {
        current += 1;
        uint reward = 2 * games[current - 1].betAmount;
        payable(owner()).transfer(reward);
        emit Winner(msg.sender, games[current - 1].typeBet, reward);  
    }

    /** 
     * Requests the address of the Chainlink Token on this network 
     */
    function getChainlinkToken() public view returns (address) {
        return address(LINK);
    }

    fallback() external payable {}

    receive() external payable {}

    /// @notice Assigns a random number 1-6 to the roll values of the current round
    /// @dev Callback function used by VRF Coordinator
    /// @param requestId The address to recieve the random number data.
    /// @param randomness The random number returned.
    function fulfillRandomness (bytes32 requestId, uint256 randomness) internal override {
        games[current].rollCounter += 1;
        rolledIndex = rolledIndex % 2;
        if (rolledIndex == 0) {
            games[current].rollOne = (randomness % 6) + 1;
        } else {
            games[current].rollTwo = (randomness % 6) + 1;
        }
        rolledIndex += 1;
        
        if (games[current].rollCounter == 2){
            // Emits the roll of the two dice.
            emit DiceResults(games[current].rollOne, games[current].rollTwo);
            games[current].rollCounter = 0;
            games[current].rollEvaluated = false;
        }
    }
    
    /// @dev Getter function mainly used for testing purposes
    /// @return Returns the type of bet for the current round
    function getCurrentBetType() public view onlyOwner returns(BetTypes) {
            return games[current].typeBet;
        }

    function isRollEvaluated() public view onlyOwner returns(bool) {
        return games[current].rollEvaluated;
    }

    function isRoundOver() public view onlyOwner returns(bool) {
        return games[current].roundComplete;
    }

    /// @dev Getter function mainly used for testing purposes
    /// @param dieNum The die whose face value is being requested
    /// @return Returns the value of either die 1 or die 2
    function getCurrentRollValues (uint dieNum) public onlyOwner  view returns(uint) {
        require(dieNum == 1 || dieNum == 2, "Invalid die number");
        if (dieNum == 1) {
            return games[current].rollOne;
        } else {
            return games[current].rollTwo;
        }
        
    }
}
