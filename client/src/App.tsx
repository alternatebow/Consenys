import React, { useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import dice1 from './Dice_Images/dice-six-faces-one.png';
import dice2 from './Dice_Images/dice-six-faces-two.png';
import dice3 from './Dice_Images/dice-six-faces-three.png';
import dice4 from './Dice_Images/dice-six-faces-four.png';
import dice5 from './Dice_Images/dice-six-faces-five.png';
import dice6 from './Dice_Images/dice-six-faces-six.png';
import { Container, Row, Col, DropdownMenu, Dropdown, DropdownToggle, DropdownItem } from 'reactstrap';
import {ChakraProvider, extendTheme} from "@chakra-ui/react";
import Layout from "./components/Layout";
import ConnectButton from './components/ConnectButton';
import { render } from '@testing-library/react';


export default class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      diceValue1: dice1,
      diceValue2: dice2,
      dropdownOpen: false,
      betType: "Type of Bet"
    };
  }

  componentDidMount() {
    this.setState(
      {
        diceValue1: dice1,
        diceValue2: dice2
      }
      )
  }

  toggle() {
    this.setState((prevState: any) => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render() {
   return (
    <div className="App">
      <header className="App-header">
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
              <ConnectButton/>
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
      </header>
    </div>   
    ); 
  }
}
  

