import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pyramidale',
  templateUrl: './pyramidale.component.html',
  styleUrls: ['./pyramidale.component.scss']
})
export class PyramidaleComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  number = 1300000



CurrencyFormat(number)
{
   return number.toLocaleString()
}


}
