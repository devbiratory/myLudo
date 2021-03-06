import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  // status B || M || W 
  // position 0 { T2: 0 }, { T2: 2 }
  database: any = {
    teams: {
      T1: {
        color: '',
        players: {
          0: {
            status: "B",
            position: 0
          },
          1: {
            status: "B",
            position: 0
          },
          2: {
            status: "B",
            position: 0
          },
          3: {
            status: "B",
            position: 0
          }
        }
      },
      T2: {
        color: '',
        players: {
          0: {
            status: "B",
            position: 0
          },
          1: {
            status: "B",
            position: 0
          },
          2: {
            status: "B",
            position: 0
          },
          3: {
            status: "B",
            position: 0
          }
        }
      },
    },
    possibleColors: ['red', 'blue', 'yellow', 'green'],
    currentTeam: '',
    isRollAwaited: false,
    currentRoll: 0,
    isGameOn: false,
    isWinner: 'T1' // T1 || T2
  }
  danceBlockObj: any = {}
  databaseOriginal: any = {}
  constructor() {

    this.makePlayBlocks();
    this.databaseOriginal = JSON.parse(JSON.stringify(this.database))
  }

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
  // turn game variable on 
  // update started player
  startTheGame() {

    this.database.isGameOn = true;
    // update current player
    this.updateStarterPlayer()
  }
  // update player chosen
  // turn isRollAwaited on now 
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
    console.log(this.database.currentTeam + ' to play')
  }
  // check how much to roll and set in db
  // combination of isRollAwaited and currentRoll is formed which is what will make the function that makes the giti move work because this is what will be checked there
  roll() {

    // update currentRoll (1 - 6)
    // const currentRoll = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    const currentRoll = this.randomNumberGiver(0, 15)
    this.database.currentRoll = currentRoll;
    // this.database.currentRoll = 6;

    console.log('rolled a ' + this.database.currentRoll)
    this.database.isRollAwaited = false;

    this.checkIfTeamCanMoveAfterRoll()
  }
  checkIfTeamCanMoveAfterRoll() {

    // because 6 means that yeah it can move
    if (this.database.currentRoll !== 6) {
      // if any player is of the status M
      let canMove = false;
      const currentTeam = this.database.currentTeam
      for (const player in this.database.teams[currentTeam].players) {
        if (this.database.teams[currentTeam].players[player].status === 'M') {
          canMove = true;
        }
      }
      if (!canMove) {
        this.changeTeamTurn()
        this.database.isRollAwaited = true;
      }
    }
  }
  /*
  * @parms
  * Team name : T1 || T2 
  * index: which player number in the team 0-3
  */
  moveIt(team: any, index: number) {

    // only proceed if the team whose turn it is, is the one who called to moveIt
    if (team !== this.database.currentTeam) {
      return
    }
    //if we are here means we can go forward because the 'if this team can move at all' check has already happened
    if ((this.database.teams[team].players[index].status === 'B') && (this.database.currentRoll !== 6)) {
      return
    }

    // if it's a 6 and the player is at 'B' then we only update the status
    // then only the basic steps, no changing the turn
    // also update the dance block
    if ((this.database.teams[team].players[index].status === 'B') && (this.database.currentRoll === 6)) {

      this.database.teams[team].players[index].status = 'M'

      // 0 here
      this.updateDanceBlock(this.database.teams[team].players[index].position, this.database.teams[team].players[index], this.database.teams[team].color, team, index)

      this.database.isRollAwaited = true;
      this.checkIfReached(team);
      this.checkIfWon(team);
      return
    }

    // now here move it as much then turn isRollAwaited off and currentRoll 0
    // update status to M and W and overall win checks here
    // update status to M means its moving

    this.database.teams[team].players[index].status = 'M'

    let previousVal = parseInt(this.database.teams[team].players[index].position)
    this.database.teams[team].players[index].position = previousVal + parseInt(this.database.currentRoll)
    // if position change, update in the corresponding dance block
    this.updateDanceBlock(this.database.teams[team].players[index].position, this.database.teams[team].players[index], this.database.teams[team].color, team, index)


    this.database.isRollAwaited = true;
    this.checkIfReached(team);
    this.checkIfWon(team);

    this.changeTeamTurn()
  }

  changeTeamTurn() {

    // check who it is 
    // check total and move it 
    const currentTeam = this.database.currentTeam
    const teamsArr = ['T1', 'T2']
    const currentTeamIndex = teamsArr.indexOf(currentTeam)

    if (this.database.currentRoll !== 6) {

      // change team means set a new team in its place
      teamsArr.splice(currentTeamIndex, 1)
      this.database.currentTeam = teamsArr[0]
    }
    else {
      // do nothing bro we got a 6
      console.log('do nothing bro we got a 6')
    }
  }

  randomNumberGiver(min, max) {
    // include enpoints
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  updateDanceBlock(index, playerObj, color, team, playerNo) {

    let a = arguments
    // remake the dance floor  
    // go through each one, if the team player match, remove them
    // so in the next step they are going to get re added in their new position
    let removedOne = false
    for (let block in this.danceBlockObj) {

      if (this.danceBlockObj[block].length) {

        this.danceBlockObj[block].forEach((stat, statKey) => {

          if ((stat.team === team) && (stat.playerNo === playerNo)) {
            this.danceBlockObj[block].splice(statKey, 1)
          }
          else {

            if ((stat.team !== team)) {

              if (!removedOne) {
                if (parseInt(block) == parseInt(index)) {

                  this.danceBlockObj[block].splice(statKey, 1)
                  removedOne = true

                  this.backToBase(stat)
                }
              }
            }
          }
        });
      }
    }

    // now adding them in their new position
    playerObj['color'] = color
    playerObj['team'] = team
    playerObj['playerNo'] = playerNo
    if (this.danceBlockObj[index]) {
      this.danceBlockObj[index].push(playerObj)
    }
  }

  backToBase(stat) {

    this.database.teams[stat.team].players[stat.playerNo].status = 'B';
    this.database.teams[stat.team].players[stat.playerNo].position = 0;
  }

  makePlayBlocks() {
    for (let i = 0; i < 50; i++) {
      this.danceBlockObj[i] = []
    }
  }

  getPlayersClass(danceBlock) {

    const numberClassGiver = {
      0: 'zero',
      1: 'one',
      2: 'two',
      3: 'three',
      4: 'four',
      5: 'five',
      6: 'six',
      7: 'seven',
      8: 'eight',
    }
    return numberClassGiver[danceBlock.length]
  }

  // basically the idea here is to give it an object and get back an array 
  generateArray(obj) {
    return Object.keys(obj).map((key) => { return obj[key] });
  }

  checkIfReached(team: string) {

    for (let player in this.database.teams[team].players) {

      if (this.database.teams[team].players[player].position >= 50) {

        console.log('teams each stufdff')

        this.database.teams[team].players[player].status = 'W'
        console.log(this.database.teams[team].players)
      }
    }
  }

  checkIfWon(team: string) {

    let ifWon = true
    for (let player in this.database.teams[team].players) {

      if (this.database.teams[team].players[player].position < 50)
        ifWon = false
    }
    if (ifWon) {
      this.presentTheWinningTeam(team)

    }
  }
  presentTheWinningTeam(team: string) {

    // make this team win and redirect
    this.database.currentTeam = ''
    this.database.currentTeam = false
    this.database.currentRoll = 0
    this.database.isGameOn = false
    this.database.isWinner = team
  }

  playAgain() {

    this.database = JSON.parse(JSON.stringify(this.databaseOriginal))
    this.databaseOriginal = JSON.parse(JSON.stringify(this.database))
    this.database.isWinner = ''
    this.assignColors()
  }
}