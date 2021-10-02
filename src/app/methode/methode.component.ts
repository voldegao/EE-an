import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-methode',
  templateUrl: './methode.component.html',
  styleUrls: ['./methode.component.css']
})
export class MethodeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    if (!window.localStorage.getItem('logged')) {
      window.location.href = "#/login";
    } 
  }

}
