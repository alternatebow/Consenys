import logo from './logo.svg';
import './App.css';
import React from "react"
import { Container, Row, Col, DropdownMenu, Dropdown, DropdownToggle, DropdownItem } from 'reactstrap';
import { render } from '@testing-library/react';
import { GAMBLE_ABI, GAMBLE_ADDRESS } from './config';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      betType: "Type of Bet"
    };
  }

  componentDidMount() {
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const accounts = await web3.eth.getAccounts();
    const gambleInstance = new web3.eth.Contract(GAMBLE_ABI, GAMBLE_ADDRESS);
    
  }

  toggle() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render() {
   return (
    <div className="App">
          <Container>
          <Row 
            md="4"
            sm="2"
            xs="1"
            className='dice-header' 
          >
            <Col>
            </Col>
            <Col
            >
              <img src={this.state.diceValue1} className="dice" alt="logo" />
            </Col>
            <Col
            >
              <img src={this.state.diceValue2} className="dice" alt="logo" />
            </Col>
            <Col>
            </Col>
          </Row>
          <Row
            className='display'
          >
            <Col>
            </Col>
            <Col>
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                  {this.state.betType}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => {this.setState({betType: "Pass"})}}>Pass</DropdownItem>
                  <DropdownItem onClick={() => {this.setState({betType: "No Pass"})} }>No Pass</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
            <Col  xs='auto'>
              <form>
                <label>
                  Bet Amount:
                  <input type="text"/>
                  <input type="submit" value="Bet" />
                </label>
              </form>
            </Col>
            <Col>
              <button>Roll!</button>
            </Col>
          </Row>
          <Row>
            Bet Type:
          </Row>
          <Row>
            Bet Amount:
          </Row>
          <Row>
            Point:
          </Row>
        </Container>
    </div>   
    ); 
  }
}

