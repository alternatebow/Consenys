const { assert } = require('chai')
const { expectRevert } = require('@openzeppelin/test-helpers')
const truffleAssert = require('truffle-assertions')

contract('Gamble', accounts => {
    const Gamble = artifacts.require('Gamble')
    const VRFCoordinatorMock = artifacts.require('VRFCoordinatorMock')
    const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
    const defaultAccount = accounts[0]
    const investor = accounts[1]
    let gamble, vrfCoordinatorMock, link, keyhash, fee
    
    beforeEach(async () => {
        keyhash = '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4'
        fee = '1000000000000000000'
        link = await LinkToken.new({ from: defaultAccount })
        vrfCoordinatorMock = await VRFCoordinatorMock.new(link.address, { from: defaultAccount })
        gamble = await Gamble.new(link.address, keyhash, vrfCoordinatorMock.address, fee, { from: defaultAccount })
        web3.eth.sendTransaction({from:investor, to:gamble.address, value: web3.utils.toWei('1', "ether")})

    })
    it('The contract is properly deployed with the right owner', async () => {
        let owner = await gamble.owner();
        assert.equal(defaultAccount, owner, "The owners are not the same!")
    })

    it('it revert without LINK', async () => {
        await expectRevert.unspecified(
            gamble.getRandomNumber({ from: defaultAccount })
        )
    })

    it('returns a random number with link', async () => {
        await link.transfer(gamble.address, web3.utils.toWei('1', 'ether'), { from: defaultAccount })
        //Load the contract with some ether for later tests and payouts
        await gamble.createGame(0, {from: defaultAccount, value: 1000000000000000})
        let transaction = await gamble.getRandomNumber({ from: defaultAccount })
        assert.exists(transaction.receipt.rawLogs)
        // This is the event that is emitted
        let requestId = transaction.receipt.rawLogs[3].topics[0]
        
        await vrfCoordinatorMock.callBackWithRandomness(requestId, '32', gamble.address, { from: defaultAccount })
        let roll2 = await gamble.getCurrentRollValues(2, {from: defaultAccount})
        assert.equal(roll2, (32 % 6) + 1)
    })

    it('It evaluate a bet and determines if winning bet', async () => {
        // Bet is a Pass bet, so winning numbers are 7 and 11 on first roll
        await gamble.createGame(0, {from: defaultAccount, value: 1000000000000000})
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
        await gamble.createGame(1, {from: defaultAccount, value: 1000000000000000})
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
    
})
