import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/map'
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router,) { }

  ngOnInit(): void {
    window.localStorage.setItem('login', 'true');
    if (window.localStorage.getItem('logged') == 'true') {

      var location = window.localStorage.getItem('ESP_superVision_location');
      if (location == 'biais') {
        this.router.navigate(['biais']);
      } else if (location == 'mad') {
        this.router.navigate(['mad']);
      } else if (location == 'biaisfamille') {
        this.router.navigate(['biaisfamille']);
      } else if (location == 'biaisarticle') {
        this.router.navigate(['biaisarticle']);
      } else if (location == 'stocksecurite') {
        this.router.navigate(['stocksecurite']);
      } else if (location == 'statistique') {
        this.router.navigate(['statistique']);
      }
      else {
        this.router.navigate(['home']);
      }
    }

    if (window.localStorage.getItem('ESP_access_token')) {
      this.check_auth();
    }
  }
  email: any
  password: any

  check_auth(){
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + window.localStorage.getItem('ESP_access_token')
      })
    };

    this.http.get<any>('http://stepup.ma/espace-equipement-api/api/validate/auth', httpOptions).map(res => res).subscribe(data => {
      if (data == 1) {
        console.log('success...');
        window.localStorage.setItem('ESP_token_valid', 'true');
        window.localStorage.setItem('login', 'false');
        window.location.reload();
      } else {
        console.log('not success...');
        console.log(data);
        console.log(JSON.stringify(data));
      }
    }, err => {
      console.log(JSON.stringify(err));
    });
  }
  login(){
    console.log(this.email,this.password)
    let postData = new FormData();
      postData.append('email', this.email);
      postData.append('password',this.password);
       this.http.post<any>('http://stepup.ma/espace-equipement-api/api/login', postData).map(res => res).subscribe(data => {
        console.log(data);
        if (data.access_token) {
         
          window.localStorage.setItem('ESP_access_token', data.access_token);
          window.localStorage.setItem('login', 'false');
          window.localStorage.setItem('logged', 'true');
          window.localStorage.setItem('ESP_token_valid', 'true');
          // this.router.navigate(['commandes']);
          window.location.reload();
        } else {
          console.log('incorect login ')
        }
       
      }, err => {
        console.log(JSON.stringify(err));
      });
  }
}
