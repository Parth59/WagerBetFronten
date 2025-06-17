//export const BETTING_CONTRACT_ADDRESS = "0x700b6a60ce7eaaea56f065753d8dcb9653dbad35"
//export const DESTINATION_CHAIN_ID = 902
//export const DESTINATION_RPC_URL = "http://127.0.0.1:9546"

export const BETTING_CONTRACT_ADDRESS = "0x80eCd58D3C6Ffa3e2B598C0a75492e2127D1c72c"
export const DESTINATION_CHAIN_ID = 420120001
export const DESTINATION_RPC_URL = "https://interop-alpha-1.optimism.io"

export const BETTING_CONTRACT_ABI = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "betCounter",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "bets",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "creatorChainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "joinerChainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "creator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "joiner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "resolver",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "description",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "stake",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "winner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "status",
        "type": "uint8",
        "internalType": "enum WagerBet.BetStatus"
      },
      {
        "name": "expiryTimestamp",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "checkAndHandleExpiredBet",
    "inputs": [
      {
        "name": "betId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createBet",
    "inputs": [
      {
        "name": "_destinationChainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "description",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_expiryTimestamp",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_resolver",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "createBetOnMainBlockchain",
    "inputs": [
      {
        "name": "_sendETHMsgHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "newBet",
        "type": "tuple",
        "internalType": "struct WagerBet.Bet",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "creatorChainId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "joinerChainId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "creator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "joiner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "resolver",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "stake",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "winner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "status",
            "type": "uint8",
            "internalType": "enum WagerBet.BetStatus"
          },
          {
            "name": "expiryTimestamp",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "emergencyWithdraw",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getActiveBets",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct WagerBet.Bet[]",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "creatorChainId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "joinerChainId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "creator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "joiner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "resolver",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "stake",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "winner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "status",
            "type": "uint8",
            "internalType": "enum WagerBet.BetStatus"
          },
          {
            "name": "expiryTimestamp",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllUserBets",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct WagerBet.Bet[]",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "creatorChainId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "joinerChainId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "creator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "joiner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "resolver",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "stake",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "winner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "status",
            "type": "uint8",
            "internalType": "enum WagerBet.BetStatus"
          },
          {
            "name": "expiryTimestamp",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBetResolver",
    "inputs": [
      {
        "name": "betId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBetsByCreator",
    "inputs": [
      {
        "name": "creator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct WagerBet.Bet[]",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "creatorChainId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "joinerChainId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "creator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "joiner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "resolver",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "stake",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "winner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "status",
            "type": "uint8",
            "internalType": "enum WagerBet.BetStatus"
          },
          {
            "name": "expiryTimestamp",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBetsByJoiner",
    "inputs": [
      {
        "name": "joiner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct WagerBet.Bet[]",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "creatorChainId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "joinerChainId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "creator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "joiner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "resolver",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "stake",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "winner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "status",
            "type": "uint8",
            "internalType": "enum WagerBet.BetStatus"
          },
          {
            "name": "expiryTimestamp",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isBetExpired",
    "inputs": [
      {
        "name": "betId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "joinBet",
    "inputs": [
      {
        "name": "_destinationChainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "betId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "creator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "joiner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "stake",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "joinBetOnMainBlockchain",
    "inputs": [
      {
        "name": "_sendETHMsgHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "betId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "creator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "joiner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "stake",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "resolveBet",
    "inputs": [
      {
        "name": "_destinationChainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "betId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "winner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "resolveBetOnMainBlockchain",
    "inputs": [
      {
        "name": "betId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "winner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "resolver",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "BetCreated",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "creator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "description",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "stake",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "expiryTimestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "resolver",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BetExpired",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BetJoinedDetailed",
    "inputs": [
      {
        "name": "betId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "creator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "joiner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "stake",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "joinerChainId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "status",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum WagerBet.BetStatus"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BetResolved",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "winner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "CallerNotL2toL2CrossDomainMessenger",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidCrossDomainSender",
    "inputs": []
  },
  {
    "type": "error",
    "name": "RequiredMessageNotSuccessful",
    "inputs": [
      {
        "name": "msgHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  }
];

/*
export const BETTING_CONTRACT_ABI = [
    {
      "type": "constructor",
      "inputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "betCounter",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "bets",
      "inputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "id",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "creatorChainId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "joinerChainId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "creator",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "joiner",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "resolver",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "description",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "stake",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "winner",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "status",
          "type": "uint8",
          "internalType": "enum WagerBet.BetStatus"
        },
        {
          "name": "expiryTimestamp",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "checkAndHandleExpiredBet",
      "inputs": [
        {
          "name": "betId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "createBet",
      "inputs": [
        {
          "name": "_destinationChainId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "description",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "_expiryTimestamp",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_resolver",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "createBetOnMainBlockchain",
      "inputs": [
        {
          "name": "_sendETHMsgHash",
          "type": "bytes32",
          "internalType": "bytes32"
        },
        {
          "name": "newBet",
          "type": "tuple",
          "internalType": "struct WagerBet.Bet",
          "components": [
            {
              "name": "id",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "creatorChainId",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "joinerChainId",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "creator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "joiner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "resolver",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "description",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "stake",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "winner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum WagerBet.BetStatus"
            },
            {
              "name": "expiryTimestamp",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "emergencyWithdraw",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getAllUserBets",
      "inputs": [
        {
          "name": "user",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct WagerBet.Bet[]",
          "components": [
            {
              "name": "id",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "creatorChainId",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "joinerChainId",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "creator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "joiner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "resolver",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "description",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "stake",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "winner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum WagerBet.BetStatus"
            },
            {
              "name": "expiryTimestamp",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getActiveBets",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct WagerBet.Bet[]",
          "components": [
            {
              "name": "id",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "creatorChainId",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "joinerChainId",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "creator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "joiner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "resolver",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "description",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "stake",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "winner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum WagerBet.BetStatus"
            },
            {
              "name": "expiryTimestamp",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getBetResolver",
      "inputs": [
        {
          "name": "betId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getBetsByCreator",
      "inputs": [
        {
          "name": "creator",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct WagerBet.Bet[]",
          "components": [
            {
              "name": "id",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "creatorChainId",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "joinerChainId",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "creator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "joiner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "resolver",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "description",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "stake",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "winner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum WagerBet.BetStatus"
            },
            {
              "name": "expiryTimestamp",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getBetsByJoiner",
      "inputs": [
        {
          "name": "joiner",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct WagerBet.Bet[]",
          "components": [
            {
              "name": "id",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "creatorChainId",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "joinerChainId",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "creator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "joiner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "resolver",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "description",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "stake",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "winner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum WagerBet.BetStatus"
            },
            {
              "name": "expiryTimestamp",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "isBetExpired",
      "inputs": [
        {
          "name": "betId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "joinBet",
      "inputs": [
        {
          "name": "_destinationChainId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "betId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "creator",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "joiner",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "stake",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "joinBetOnMainBlockchain",
      "inputs": [
        {
          "name": "_sendETHMsgHash",
          "type": "bytes32",
          "internalType": "bytes32"
        },
        {
          "name": "betId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "creator",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "joiner",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "stake",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "resolveBet",
      "inputs": [
        {
          "name": "_destinationChainId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "betId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "winner",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "resolveBetOnMainBlockchain",
      "inputs": [
        {
          "name": "betId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "winner",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "resolver",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "BetCreated",
      "inputs": [
        {
          "name": "id",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "creator",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "description",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "stake",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "expiryTimestamp",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "resolver",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "BetExpired",
      "inputs": [
        {
          "name": "id",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "BetJoinedDetailed",
      "inputs": [
        {
          "name": "betId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "creator",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "joiner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "stake",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "joinerChainId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "status",
          "type": "uint8",
          "indexed": false,
          "internalType": "enum WagerBet.BetStatus"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "BetResolved",
      "inputs": [
        {
          "name": "id",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "winner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "CallerNotL2toL2CrossDomainMessenger",
      "inputs": []
    },
    {
      "type": "error",
      "name": "InvalidCrossDomainSender",
      "inputs": []
    },
    {
      "type": "error",
      "name": "RequiredMessageNotSuccessful",
      "inputs": [
        {
          "name": "msgHash",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ]
    }
  ];
  */