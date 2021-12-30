import logo from './logo.svg';
import './App.css';
import React from "react"
import dice1 from "./Dice_Images/dice-six-faces-one.png";
import dice2 from "./Dice_Images/dice-six-faces-two.png";
import dice3 from "./Dice_Images/dice-six-faces-three.png";
import dice4 from "./Dice_Images/dice-six-faces-four.png";
import dice5 from "./Dice_Images/dice-six-faces-five.png";
import dice6 from "./Dice_Images/dice-six-faces-six.png";

import { Container, Row, Col, DropdownMenu, Dropdown, DropdownToggle, DropdownItem, Button } from 'reactstrap';
import { GAMBLE_ABI, GAMBLE_ADDRESS } from './config';
import Web3 from 'web3';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    //this.handleAnte = this.handleAnte.bind(this);
    this.state = {
      account: "",
      contractInstance: "",
      diceValue1: dice1,
      diceValue2: dice2,
      dropdownOpen: false,
      betType: "Type of Bet",
      betAmount: "",
      point: "None",
      betPlaced: false,
      correctNetwork: false,
      roundOver: false
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

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const networkType = await web3.eth.net.getNetworkType();
    console.log(networkType)
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
  }

  toggle() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }
  
  async playGame(betType, betValue) {
    let bet = (betType == "Pass") ? 0 : 1;
    // Subscribe to all events from the contract
    this.state.contractInstance.events.BetPlaced(() => {
      this.setState({betPlaced: true});
      console.log(this.state.betPlaced)
    });
    this.state.contractInstance.events.DiceResults(function(error, event){console.log("Hello World")})
    this.state.contractInstance.events.Winner(() => {
      this.setState({betPlace: false})
    });
    this.state.contractInstance.events.Loser(() => {
        this.setState({betPlace: false})
      });
    this.state.contractInstance.events.Point(function(error, event){console.log("Hello World")});
    this.state.contractInstance.methods.createGame(bet).send({from: this.state.account, value: betValue});
    
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
              <form >
                <label>
                  Bet Amount <br></br>in wei <br></br> (min bet is 10000000000000)
                  </label>
                  <input type="text" value={this.state.betAmount} disabled={this.state.betPlaced} onChange={(e) => {
                    this.setState({betAmount: e.target.value})
                  }}></input>
              </form>
            </Col>
            <Col>
              <button onClick={
                () => {
                  if(this.state.betAmount < 10000000000000 && (this.state.betType != 'Pass' || this.state.betType != 'No Pass')) {
                    alert("Bet amount is too low!")
                  } else{
                    this.playGame(this.state.betType, this.state.betAmount);
                  } 
                }
                }>Roll!</button>
            </Col>
          </Row>
          <Row>
            Bet Type: {this.state.betType}
          </Row>
          <Row>
            Bet Amount: {this.state.betAmount}
          </Row>
          <Row>
            Point:
          </Row>
        </Container>
    </div>   
    ); 
  }
}

