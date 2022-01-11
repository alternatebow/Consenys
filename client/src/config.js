export const GAMBLE_ADDRESS = "0xD9FE8f1BB7B836B06568e2eF2b11FFc7BA776878"

export const GAMBLE_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_linkTokenAddress",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "_keyHash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "_vrfCoordinatorAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "bettor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum Gamble.BetTypes",
        "name": "bet",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "BetPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "roll1",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "roll2",
        "type": "uint256"
      }
    ],
    "name": "DiceResults",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "roller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum Gamble.BetTypes",
        "name": "bet",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reward",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "number",
        "type": "uint256"
      }
    ],
    "name": "HardBetWinner",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "roller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum Gamble.BetTypes",
        "name": "bet",
        "type": "uint8"
      }
    ],
    "name": "Loser",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "roller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum Gamble.BetTypes",
        "name": "bet",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "point",
        "type": "uint256"
      }
    ],
    "name": "Point",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      }
    ],
    "name": "RequestedRandomness",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "bettor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum Gamble.BetTypes",
        "name": "bet",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rollValue",
        "type": "uint256"
      }
    ],
    "name": "RollEvaluated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "bettor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum Gamble.BetTypes",
        "name": "sideBet",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "number",
        "type": "uint256"
      }
    ],
    "name": "SideBetPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "roller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum Gamble.BetTypes",
        "name": "bet",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reward",
        "type": "uint256"
      }
    ],
    "name": "SixEightBetWinner",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "roller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum Gamble.BetTypes",
        "name": "bet",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reward",
        "type": "uint256"
      }
    ],
    "name": "Winner",
    "type": "event"
  },
  {
    "stateMutability": "payable",
    "type": "fallback",
    "payable": true
  },
  {
    "inputs": [],
    "name": "current",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "games",
    "outputs": [
      {
        "internalType": "enum Gamble.BetTypes",
        "name": "typeBet",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "betAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "sixEightBet",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "hardBet",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rollOne",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rollTwo",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "point",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "hardNum",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rollCounter",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "rollEvaluated",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "roundComplete",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "sixEightBetOn",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "hardBetOn",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "minBet",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "minSideBet",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "randomness",
        "type": "uint256"
      }
    ],
    "name": "rawFulfillRandomness",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rolledIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "enum Gamble.BetTypes",
        "name": "typeBet",
        "type": "uint8"
      }
    ],
    "name": "createGame",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "enum Gamble.BetTypes",
        "name": "sideBet",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "number",
        "type": "uint256"
      }
    ],
    "name": "placeSideBet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [],
    "name": "getRandomNumber",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "evaluateRoll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sideBetEvaluation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "quitGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdrawEther",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdrawLink",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getChainlinkToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getCurrentBetType",
    "outputs": [
      {
        "internalType": "enum Gamble.BetTypes",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "confirmSixEightBet",
    "outputs": [
      {
        "internalType": "enum Gamble.BetTypes",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "confirmHardBet",
    "outputs": [
      {
        "internalType": "enum Gamble.BetTypes",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getHardNum",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "isRollEvaluated",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "isRoundOver",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "dieNum",
        "type": "uint256"
      }
    ],
    "name": "getCurrentRollValues",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
]