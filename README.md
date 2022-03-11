# Consensys -- Final Project (Single Player Craps Game)

## An craps simulation for a single player on the kovan test network.

## Project Details

### Problem
When it comes to gambling, the common adage "The house always wins" is not simply a phrase to warn against playing at a casino in the long run, it is a system where mathematically speaking, casinos and bookeepers are virtually guaranteed to make a profit regardless of the results or bets placed. This is  because casinos (both in-person and online) have what is called, 'House advantage'. What this means is that over the long run,  casinos are not paying out winning  bets according to their 'true odds'. For example, on any roll of the die, their is an equal probability (1/6) that the face 1 through 6 will appear and accordingly the 'true payout' should be 6 times the original bet. However, this does not happen as the casino would not earn much profit if it were to pay out the true odds, so instead they pay a percentage of it; this portion of the true payout that they keep is known as the 'House edge'. 

With blockchain technology, gambling dapps utilizing smart contracts can elminate the involvement of the casino taking a portion of the payout, as well as ensure provably fair games, instant payouts and anonimity. Due to the decentralized nature of interactions on a dApp, all transactions would not involve a central provider who controls the game and handles the money, instead it would strictly be between the game and the players with the wagers handled by smart contracts acting as an escrow.

### Design

For this project, the idea is to build a dApp that simulates a single player craps game in which the smart contract automates:
1. Creates the game and handles the bet made
2. Rolling the dice (via Chainlink VRF to generate two random numbers 1-6)
3. Evaluates each roll to determine winner/loser 
4. Pays the reward to the player if a winning bet was made. 
 

### Features to be implemented
Side bets intended to be added in the future which would allow for more variety and better simulate the intricacies of betting at an actual craps table.

Allowing for multiple players to play and place their own bets with/against the shooter as well as their own side bets.

Will most likely re-deploy this dApp on the Polygon (Matic) Mumbai Testnet. Was told that the VRF response times were much faster.


### Demo
The dApp can be accessed at: 

<https://festive-kilby-1d4186.netlify.app/>

### Dependencies

Ensure you have Node.js 16.6.2 or newer 

<https://nodejs.org/en/download/>

### How to setup locally:
*   ``` git clone https://github.com/alternatebow/blockchain-developer-bootcamp-final-project.git``` 
* Change into the directory 
*   ```npm start```
* ```npm run client-install```
*   ```npm run client ```

### How to play:
1. Press the 'Connect Wallet' Button (Make sure you are on the Kovan Network) 
2. Use the Type of Bet Dropdown Menu to select a type of bet. 

* Pass Bet: Wins a 7 or 11 on the first roll to win. Loses on a 2, 3 or 12

* No Pass Bet: Wins a 2, 3 or 12. Loses on 7 or 11.
3. Use the input field to adjust how many Finney (0.001 ETH) to bet. 
4. When the 'Roll' button turns blue, click on it and confirm the 2 transaction 
    (It will say 'Random Number')
5. This part will take a bit of time (Chainlink's VRF uses a request and receive data cylcle). Once the two random numbers are generated it should display as die faces and Metamask will prompt a transaction confirmation (This will be to evaluate the roll as a winner or loser)
6. If the roll is neither a winning or losing number, that number is considered the 'point'. 
* If bet was Pass: Wins on point number. Loses on 7. 
* No Pass Bet: Wins on 7. Loses on point number.
7. Repeat steps 5-7 until you win or lose.
8. If you decide to quit the game. You may choose to click the 'Cancel Round' button to end the game. (It will count as a losing bet however!)
9. If for whatever reason, Kovan fails a transaction, click on the 'Unstuck' button to redo the transaction. If that fails, you will have to click the 'Cancel Round' button to 'restart' the game.

## Running Local Unit Tests 
Run the following commands on your terminal: 

1. ``` git clone https://github.com/alternatebow/blockchain-developer-bootcamp-final-project.git```

2. ```npm install```  (This will install your dependencies)

3. ```ganache-cli``` 
(Ensure port is on 8545 on the 'ganache' network in your truffle-config.js)

4. In a seperate terminal ```truffle migrate --network ganache```

5. ```truffle test --network ganache``` (which will run the command 'npx truffle test') 

## Screencast link
Available on request

## Directory Structure

| Folder     | Contents                          |
|------------|-----------------------------------|
| Client     | Front End built w/ React          |
| Contracts  | Gamble Smart Contract & Mocks     |
| Migrations | Scripts to deploy Smart Contracts |
| Test       | Unit Testing using Chai           |


## Public Ethereum Wallet for certification
0x1C943aF50598E6cfa66970312f016e3F331d1f47
