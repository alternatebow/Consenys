import logo from './logo.svg';
import './App.css';
import React from "react"
import dice1 from "./Dice_Images_GIFS/dice-six-faces-one.png";
import dice2 from "./Dice_Images_GIFS/dice-six-faces-two.png";
import dice3 from "./Dice_Images_GIFS/dice-six-faces-three.png";
import dice4 from "./Dice_Images_GIFS/dice-six-faces-four.png";
import dice5 from "./Dice_Images_GIFS/dice-six-faces-five.png";
import dice6 from "./Dice_Images_GIFS/dice-six-faces-six.png";
import waiting from "./Dice_Images_GIFS/mr-bean-waiting.gif";

import { Container, Row, Col, DropdownMenu, Dropdown, DropdownToggle, DropdownItem, Button, Form, Label, Input } from 'reactstrap';
import { GAMBLE_ABI, GAMBLE_ADDRESS } from './config';
import Web3 from 'web3';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      account: "",
      contractInstance: "",
      diceValue1: dice1,
      diceValue2: dice2,
      diceList: [dice1, dice2, dice3, dice4, dice5, dice6],
      dropdownOpen: false,
      betType: "Type of Bet",
      betAmount: "",
      point: "None",
      betPlaced: false,
      rollFinished: true,
      correctNetwork: false,
      pending: false
    };

  }

  componentDidMount() {
    //  window.addEventListener('load', function() {
    //    if(window.ethereum) {
    //      this.loadBlockchainData();
    //    }
    // })
    this.loadBlockchainData();
  }

  //Load instance of contract and subscribe to the events
  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const networkType = await web3.eth.net.getNetworkType();
    if(networkType !== 'kovan'){
      alert('Must be on the kovan network!')
    } else {
      this.setState({correctNetwork: true});
    }
    /* Only uses the first account */
    const accounts = await web3.eth.getAccounts();
    this.setState({
      account: accounts[0],
      contractInstance: new web3.eth.Contract(GAMBLE_ABI, GAMBLE_ADDRESS)
    });
    
    // Subscribe to all events from the contract
    

    this.state.contractInstance.once('Winner', () => {
      this.setState({
        betPlaced: false,
      });
      alert("Winner!")
    });

    this.state.contractInstance.once('Loser', () => {
        this.setState({betPlaced: false});
        alert("Loser!")
    });

    this.state.contractInstance.once('Point', (error, event) => {
      this.setState({point: event.returnValues.point});
      alert("Your point is: " + this.state.point);
    });
  }

  toggle() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  async setGame(betType, betValue){
    let bet = (betType === "Pass") ? 0 : 1;
    this.state.contractInstance.once('BetPlaced', () => {
      this.setState({
        betPlaced: true,
        pending: false
      });
    });
    this.state.contractInstance.methods.createGame(bet).send({from: this.state.account, value: betValue});
    this.setState({
      pending: true
    })
  }
  
  async playGame() {

    let contractInstance = this.state.contractInstance;

    this.state.contractInstance.once('DiceResults', (error, event)  => {
      let rollOne = this.state.diceList[event.returnValues.roll1 - 1];
      let rollTwo = this.state.diceList[event.returnValues.roll2 - 1];
      this.setState({
        diceValue1: rollOne,
        diceValue2: rollTwo,
        rollFinished: true,
      });
      contractInstance.methods.evaluateRoll().send({from: this.state.account});
    });

    this.state.contractInstance.once('RollEvaluated', (error, event) => {
      this.setState({
        pending: false
      });
    });

    this.state.contractInstance.methods.getRandomNumber().send({from: this.state.account});
    this.state.contractInstance.methods.getRandomNumber().send({from: this.state.account});
    this.setState({
      pending: true
    })
  }
    
    

  render() {
   return (
    <div className="App" style={{
      visibility: this.state.correctNetwork ? 'visible' : 'hidden'
    }}>
      Craps Game
          <Container>
          <Row 
            className='dice-header' 
          >
            <Col
            >
              <img src={this.state.diceValue1} className="dice" alt="logo" />
            </Col>
            <Col
            >
              <img src={this.state.diceValue2} className="dice" alt="logo" />
            </Col>
          </Row>
          <br></br>
          <Row
            className='display'
          >
            <Col>
            <Button>Connect Wallet</Button>
            </Col>
            <Col>
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} disabled={this.state.betPlaced}>
                <DropdownToggle caret>
                  {this.state.betType}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => {this.setState({betType: "Pass"})}}>Pass</DropdownItem>
                  <DropdownItem onClick={() => {this.setState({betType: "No Pass"})} }>No Pass</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
            <br></br>
            <Col  xs='auto'>
              <Form >
                <Label>
                  Bet Amount in wei <br></br> (min bet is 10000000000000 wei)
                  </Label>
                  <Input type="text" value={this.state.betAmount} disabled={this.state.betPlaced} onChange={(e) => {
                    this.setState({betAmount: e.target.value})
                  }}></Input>
              </Form>
            </Col>
            <Col>
              <Button onClick={() => {
                if(this.state.betAmount < 10000000000000 && (this.state.betType !== 'Pass' || this.state.betType !== 'No Pass')) {
                  alert("Invalid Bet or Bet amount is too low!")
                } else {
                  this.setGame(this.state.betType, this.state.betAmount)
                }
                // this.state.contractInstance.methods.getRandomNumber().send({from: this.state.account});
                // this.state.contractInstance.methods.getRandomNumber().send({from: this.state.account});
                // this.state.contractInstance.methods.evaluateRoll().send({from: this.state.account});
                // this.state.contractInstance.methods.getCurrentRollValues(1).call({from: this.state.account}).then(console.log);
                // this.state.contractInstance.methods.getCurrentRollValues(2).call({from: this.state.account}).then(console.log);
              }
              } disabled={this.state.betPlaced}>
                Start Round
              </Button>
              <br></br><br></br>
              <Button onClick={() => {
                this.playGame();
              }} disabled={!(this.state.betPlaced && this.state.rollFinished) || this.state.pending}>Roll!</Button>
            </Col>
          </Row>
          <Row>
            Bet Type: {this.state.betType}
          </Row>
          <Row>
            Bet Amount: {this.state.betAmount}
          </Row>
          <Row>
            Point: {this.state.point}
          </Row>
        </Container>
        <img src={waiting} alt="Transaction Pending..." style={{visibility: this.state.pending ? 'visible' : 'hidden'}}/>
    </div>   
    ); 
  }
}

