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
        color: 'red',
        players: {
          0: {
            status: "B || M || W",
            position: '1 - 6'
          },
          1: {
            status: "B || M || W",
            position: '1 - 6'
          },
          2: {
            status: "B || M || W",
            position: '1 - 6'
          },
          3: {
            status: "B || M || W",
            position: '1 - 6'
          }
        }
      },
      T2: {
        color: 'blue',
        players: {
          0: {
            status: "B || M || W",
            position: '1 - 6'
          },
          1: {
            status: "B || M || W",
            position: '1 - 6'
          },
          2: {
            status: "B || M || W",
            position: '1 - 6'
          },
          3: {
            status: "B || M || W",
            position: '1 - 6'
          }
        }
      },
    },
    currentTeam: '',
    isRollAwaited: false,
    currentRoll: '1-6',
    isGameOn: false,
    isWinner: 'T1 || T2'
  }
  constructor() { }

  ngOnInit() {

    console.log(this.database)
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
}