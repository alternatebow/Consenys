## Avoiding_common_attacks

<p>The common attacks that I chose to defend my contract against were preventing Re-entrancy attacks (checking for state changes before making external calls), and using modifiers only for validation.<p>

1. In the ```Gamble.sol``` contract, in the ```evaluateRoll()``` function, a function call ```payOut()``` is made that rewards the bettor's address ether, but there is an nonReentrant modifier to prevent re-rentrancy attacks.

2. In the ```withdrawEther``` and ```withdrawLink``` functions, the onlyOwner modifier is added to validate the the caller is indeed the owner (the address that deployed the contract) in order to access it.  
In the ```createGame``` function, the modifier ```atLeastMinBet``` is added in order to validate the at least 1 Finney was wagered before playing.