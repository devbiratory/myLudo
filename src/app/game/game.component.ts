import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  database: any = {
    teams: {
      T1: {
        color: '',
        players: {
          0: {
            status: "B || M || W",
            position: '0 - 50'
          },
          1: {
            status: "B || M || W",
            position: '0 - 50'
          },
          2: {
            status: "B || M || W",
            position: '0 - 50'
          },
          3: {
            status: "B || M || W",
            position: '0 - 50'
          }
        }
      },
      T2: {
        color: '',
        players: {
          0: {
            status: "B || M || W",
            position: '0 - 50'
          },
          1: {
            status: "B || M || W",
            position: '0 - 50'
          },
          2: {
            status: "B || M || W",
            position: '0 - 50'
          },
          3: {
            status: "B || M || W",
            position: '1 - 6'
          }
        }
      },
    },
    possibleColors: ['red', 'blue', 'yellow', 'green'],
    currentTeam: '',
    isRollAwaited: false,
    currentRoll: '1-6',
    isGameOn: false,
    isWinner: 'T1 || T2'
  }
  constructor() { }

  ngOnInit() {

    console.log(this.database)

    // function to set colors randomly, only supply how many teams are playing
    this.assignColors();
  }

  assignColors() {

    let totalTeams = Object.keys(this.database.teams).length
    let resArr = []
    let self = this

    let randomColorIndexesArr = getNewRandomArr();
    function getNewRandomArr() {

      let randomNumber = self.randomNumberGiver(0, 3)
      if (!resArr.includes(randomNumber)) {

        resArr.push(randomNumber)
        if (resArr.length === totalTeams) {

          return resArr;
        }
        else {
          return getNewRandomArr()
        }
      }
      else {

        return getNewRandomArr()
      }
    }

    let colorCount = 0;
    for (let team in this.database.teams) {

      this.database.teams[team].color = this.database.possibleColors[randomColorIndexesArr[colorCount]]
      colorCount++;
    }
  }
  startTheGame() {

    this.database.isGameOn = true;
    // update current player
    this.updateStarterPlayer()
  }
  updateStarterPlayer() {

    // see how many teams are there      
    const totalTeams = Object.keys(this.database.teams).length

    // random between 1 and the number of teams
    // Math.floor(Math.random() * (max - min + 1)) + min; // include enpoints
    const randomTurnNumber = Math.floor(Math.random() * (2 - 1 + 1)) + 1;

    // assign current player from random number generated
    const playerChosen = 'T' + randomTurnNumber;
    this.database.currentTeam = playerChosen
    this.database.isRollAwaited = true;
  }

  roll() {

    // update currentRoll (1 - 6)
    const currentRoll = Math.floor(Math.random() * (6 - 1 + 1)) + 1;

    if (currentRoll !== 6) {
      setTimeout(() => {
        this.setMovement(this.database.currentTeam, currentRoll);
      }, 1200);
      this.changeTeamTurn() // only after the movement is done
    }
    else {

      setTimeout(() => { // timeout to simulate actual player movement
        this.setMovement(this.database.currentTeam, currentRoll);
      }, 1200);
    }

  }

  setMovement(team, diceRoll) {

    if (diceRoll === 6) {
      console.log('player ' + team + ' goes again')
    }
    else {
      console.log('change players')
    }
  }
  changeTeamTurn() {

    // check who it is 
    // check total and move it 
    const currentTeam = this.database.changeTeamTurn
    console.log('trying to change team turn current team is')
  }
  randomNumberGiver(min, max) {
    // include enpoints
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}