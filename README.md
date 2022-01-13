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


### Deployed Front-End
The dApp can be accessed at: 

<https://festive-kilby-1d4186.netlify.app/>

### Dependencies
Chainlink

openzeppelin
truffle/hdwallet-provider
create-react-app
dotenv

### How to play instructions:

## Running Unit Tests


## Screencast link

## Directory Structure

| Folder     | Contents                          |
|------------|-----------------------------------|
| Client     | Front End built w/ React          |
| Contracts  | Gamble Smart Contract & Mocks     |
| Migrations | Scripts to deploy Smart Contracts |
| Test       | Unit Testing using Chai           |


## Public Ethereum Wallet for certification
0x1C943aF50598E6cfa66970312f016e3F331d1f47