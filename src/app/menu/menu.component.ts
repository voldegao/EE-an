import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TooltipComponent, Position } from '@syncfusion/ej2-angular-popups';
import 'rxjs/add/operator/map'
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-Menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
 @Input() menuItem: number
 @Input() menuP: number

  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + window.localStorage.getItem('ESP_access_token')
    })
}

constructor(private http: HttpClient) { }
ngOnInit(): void {
   this.checkMenu()
  
}
logout(){
  localStorage.clear();
  window.location.reload()
}

menu1: any
menu2: any
menu3: any
menu4: any
menu5: any
selectMenu(id){
  this.menu1 = 0
  this.menu2 = 0
  this.menu3 = 0
  this.menu4 = 0
  this.menu5 = 0
  window.localStorage.setItem('menu', id);
  if(id == 1){
    this.menu1 = 1
  }else if(id == 2){
    this.menu2 = 1
  
  }else if(id == 3){
    this.menu3 = 1
  
  }else if(id == 4){
    this.menu4 = 1
  
  }else if(id == 5){
    this.menu5 = 1
  }

 
  
}

checkMenu(){
  this.menu1 = 0
  this.menu2 = 0
  this.menu3 = 0
  this.menu4 = 0
  this.menu5 = 0
  var id = parseInt(window.localStorage.getItem('menu'))
  if(id == 1){
    this.menu1 = 1
  }else if(id == 2){
    this.menu2 = 1
  
  }else if(id == 3){
    this.menu3 = 1
  
  }else if(id == 4){
    this.menu4 = 1
  
  }else if(id == 5){
    this.menu5 = 1
  }
  
}


}


