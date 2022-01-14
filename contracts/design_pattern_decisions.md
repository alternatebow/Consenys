## Design_Pattern_Decisions

<p> For this project, I chose to utilize importing inheritances and interfaces, Oracles to receive off-chain data as well as using Access Control design patterns. <p>

1. The main contract ```Gamble.sol``` inherits the VRFconsumerBase interface for it's use of the ```getRandomNumber()``` function. The contract also inherits from the @openzeppelin ```Ownable.sol``` contract as well as the ```ReentrancyGuard.sol``` contract.

2. I utilized Chainlink's VRF (Verifiable Random Function) which uses a decentralized oracle network to generate a pair of random numbers and the cryptographic proof of how that number was determined.

3. As mentioned prior, I implemented Access Control designs with the ```Ownable.sol``` contract to restrict a couple of functions' access; namely the ```withdrawEther(uint256 amount)``` and the ```withdrawLink(uint256 amount)``` functions.