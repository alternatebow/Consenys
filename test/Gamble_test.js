const { assert } = require('chai')
const { expectRevert } = require('@openzeppelin/test-helpers')
const truffleAssert = require('truffle-assertions')

contract('Gamble', accounts => {
    const Gamble = artifacts.require('Gamble')
    const VRFCoordinatorMock = artifacts.require('VRFCoordinatorMock')
    const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
    // const defaultAccount = '0x4C13DbD6cDA197dad4204Bd9c869a6b7a51C159A'
    // const investor = '0x4C13DbD6cDA197dad4204Bd9c869a6b7a51C159A'
    const defaultAccount = accounts[0]
    const investor = accounts[1]
    let gamble, vrfCoordinatorMock, link, keyhash, fee
    
    beforeEach(async () => {
        keyhash = '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4'
        fee = '1000000000000000000'
        link = await LinkToken.new({ from: defaultAccount })
        vrfCoordinatorMock = await VRFCoordinatorMock.new(link.address, { from: defaultAccount })
        gamble = await Gamble.new(link.address, keyhash, vrfCoordinatorMock.address, fee, { from: defaultAccount })
        web3.eth.sendTransaction({from:investor, to:gamble.address, value: web3.utils.toWei('0.01', "Ether")})

    })
    it('The contract is properly deployed with the right owner', async () => {
        let owner = await gamble.owner();
        assert.equal(defaultAccount, owner, "The owners are not the same!")
    })

    it('returns two random numbers with link', async () => {
        await link.transfer(gamble.address, web3.utils.toWei('2', 'ether'), { from: defaultAccount })
        //Load the contract with some ether for later tests and payouts
        await gamble.createGame(1, {from: defaultAccount, value: 10000000000000})
        let transaction = await gamble.getRandomNumber({ from: defaultAccount })
        assert.exists(transaction.receipt.rawLogs)
        // This is the event that is emitted
        let requestId = transaction.receipt.rawLogs[3].topics[0]
        
        await vrfCoordinatorMock.callBackWithRandomness(requestId, '32', gamble.address, { from: defaultAccount })
        let roll = await gamble.getCurrentRollValues(1, {from: defaultAccount})
        
        let transactionTwo = await gamble.getRandomNumber({ from: defaultAccount })
        assert.exists(transactionTwo.receipt.rawLogs)
       
        let requestIdTwo = transactionTwo.receipt.rawLogs[3].topics[0]
        
        await vrfCoordinatorMock.callBackWithRandomness(requestIdTwo, '45', gamble.address, { from: defaultAccount })
        let rollTwo = await gamble.getCurrentRollValues(2, {from: defaultAccount})
        assert.equal(roll, (32 % 6) + 1)
        assert.equal(rollTwo, (45 % 6) + 1)
        await gamble.evaluateRoll({from: defaultAccount})
    })

    it('It evaluate a bet and determines if winning bet', async () => {
        // Bet is a Pass bet, so winning numbers are 7 and 11 on first roll
        await gamble.createGame(0, {from: defaultAccount, value: 10000000000000})
        let bet = await gamble.getCurrentBetType()
        await link.transfer(gamble.address, web3.utils.toWei('2', 'ether'), { from: defaultAccount })
        let firstRoll = await gamble.getRandomNumber({from: defaultAccount})
        let requestIdOne = firstRoll.receipt.rawLogs[3].topics[0]
        await vrfCoordinatorMock.callBackWithRandomness(requestIdOne, '57', gamble.address, {from: defaultAccount})
        
        let secondRoll = await gamble.getRandomNumber({from: defaultAccount})
        let requestIdTwo = secondRoll.receipt.rawLogs[3].topics[0]
        await vrfCoordinatorMock.callBackWithRandomness(requestIdTwo, '74', gamble.address, {from: defaultAccount})
        
        let tx = await gamble.evaluateRoll({from: defaultAccount})
  
        truffleAssert.eventEmitted(tx, 'Winner', async (ev) => {
            return ev.roller === await gamble.owner() && ev.bet === bet
        })
        assert.equal(0, bet, "Bet types are not the same!")
    })
        
    it('It evaluates a losing bet', async () => {
        await gamble.createGame(1, {from: defaultAccount, value: 10000000000000})
        let bet = await gamble.getCurrentBetType()
        
        await link.transfer(gamble.address, web3.utils.toWei('2', 'ether'), { from: defaultAccount })
        let firstRoll = await gamble.getRandomNumber({from: defaultAccount})
        let requestIdOne = firstRoll.receipt.rawLogs[3].topics[0]
        await vrfCoordinatorMock.callBackWithRandomness(requestIdOne, '46', gamble.address, {from: defaultAccount})
        
        
        let secondRoll = await gamble.getRandomNumber({from: defaultAccount})
        let requestIdTwo = secondRoll.receipt.rawLogs[3].topics[0]
        await vrfCoordinatorMock.callBackWithRandomness(requestIdTwo, '13', gamble.address, {from: defaultAccount})

        let tx = await gamble.evaluateRoll({from: defaultAccount})
        
        truffleAssert.eventEmitted(tx, 'Loser', async (ev) => {
            return ev.roller === await gamble.owner() && ev.bet === bet
        })
        assert.equal(1, bet, "Bet types are not the same!")
    })

    it('It evaluates a bet involving a point', async () => {
        await gamble.createGame(1, {from: defaultAccount, value: 10000000000000})
        let bet = await gamble.getCurrentBetType()
        
        await link.transfer(gamble.address, web3.utils.toWei('4', 'ether'), { from: defaultAccount })
        let firstRoll = await gamble.getRandomNumber({from: defaultAccount})
        let requestIdOne = firstRoll.receipt.rawLogs[3].topics[0]
        await vrfCoordinatorMock.callBackWithRandomness(requestIdOne, '89', gamble.address, {from: defaultAccount})
        
        
        let secondRoll = await gamble.getRandomNumber({from: defaultAccount})
        let requestIdTwo = secondRoll.receipt.rawLogs[3].topics[0]
        await vrfCoordinatorMock.callBackWithRandomness(requestIdTwo, '105', gamble.address, {from: defaultAccount})

        let tx = await gamble.evaluateRoll({from: defaultAccount})
        let point
         truffleAssert.eventEmitted(tx, 'Point', async (ev) => {
            point = ev.point
            return ev.roller == gamble.owner() && ev.bet == bet
        })
        assert.equal(point, 10, "Point is not as expected!")

        let thirdRoll = await gamble.getRandomNumber({from: defaultAccount})
        let requestIdThree = thirdRoll.receipt.rawLogs[3].topics[0]
        await vrfCoordinatorMock.callBackWithRandomness(requestIdThree, '97', gamble.address, {from: defaultAccount})
        
        
        let fourthRoll = await gamble.getRandomNumber({from: defaultAccount})
        let requestIdFour = fourthRoll.receipt.rawLogs[3].topics[0]
        await vrfCoordinatorMock.callBackWithRandomness(requestIdFour, '244', gamble.address, {from: defaultAccount})

        let reward
        let tx2 = await gamble.evaluateRoll({from: defaultAccount})
         truffleAssert.eventEmitted(tx2, 'Winner', async (ev) => {
             reward = ev.reward
            return ev.roller == gamble.owner() && ev.bet == bet
        })
        assert.equal(reward, 20000000000000, "Incorrect payout" );

    })
    
})
