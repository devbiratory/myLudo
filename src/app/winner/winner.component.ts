import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.scss']
})
export class WinnerComponent implements OnInit {

  @Input() winningTeam:string
  @Output() playAgain = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
    console.log('winning team is '+this.winningTeam)
  }
  
  playGameAgain(){
    this.playAgain.next();
  }
}
