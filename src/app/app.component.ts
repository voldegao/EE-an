import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  title = 'esp';

  ngOnInit(): void {
    if (!window.localStorage.getItem('logged')) {
      window.location.href = "#/login";
    } 
  }
}
