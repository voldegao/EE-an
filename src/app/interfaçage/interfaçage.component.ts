import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-interfaçage',
  templateUrl: './interfaçage.component.html',
  styleUrls: ['./interfaçage.component.scss']
})
export class InterfaçageComponent implements OnInit {

  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + window.localStorage.getItem('ESP_access_token')
    })
  }

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  familles: any
  zones: any
  articles: any
  ventes: any
  cmds: any
  achats: any
  achatsplan: any
  familleLoading: any = false
  zoneLoading: any = false
  articleLoading: any = false
  venteLoading: any = false
  cmdLoading: any = false
  achatLoading: any = false
  achatplanLoading: any = false

  clearData(){
    this.familles = []
    this.zones = []
    this.articles = []
    this.ventes = []
    this.cmds = []
    this.achats = []
    this.achatsplan = []
  }

  getFamilles(){
    this.clearData()
    this.familleLoading = true
    this.http.get<any>('http://localhost/espace_equipement/familles', this.httpOptions).map(res => res).subscribe(data => {
      this.familles = data
      this.familleLoading = false
    }, err => {
      console.log(JSON.stringify(err));
    });
  }

  getZones(){
    this.clearData()
    this.zoneLoading = true
    this.http.get<any>('http://localhost/espace_equipement/zones', this.httpOptions).map(res => res).subscribe(data => {
      this.zones = data
      this.zoneLoading = false
    }, err => {
      console.log(JSON.stringify(err));
    });
  }

  getArticles(){
    this.clearData()
    this.articleLoading = true
    this.http.get<any>('http://localhost/espace_equipement/articles', this.httpOptions).map(res => res).subscribe(data => {
      this.articles = data
      this.articleLoading = false
    }, err => {
      console.log(JSON.stringify(err));
    });
  }
  getVentes(){
    this.clearData()
    this.venteLoading = true
    this.http.get<any>('http://localhost/espace_equipement/ventes2', this.httpOptions).map(res => res).subscribe(data => {
      this.ventes = data
      this.venteLoading = false
    }, err => {
      console.log(JSON.stringify(err));
    });
  }

  getCmds(){
    this.clearData()
    this.cmdLoading = true
    this.http.get<any>('http://localhost/espace_equipement/ventes/planifie', this.httpOptions).map(res => res).subscribe(data => {
      this.cmds = data
      this.cmdLoading = false
    }, err => {
      console.log(JSON.stringify(err));
    });
  }
  getAchats(){
    this.clearData()
    this.achatLoading = true
    this.http.get<any>('http://localhost/espace_equipement/achats', this.httpOptions).map(res => res).subscribe(data => {
      this.achats = data
      this.achatLoading = false
    }, err => {
      console.log(JSON.stringify(err));
    });
  }
  getAchatsplan(){
    this.clearData()
    this.achatplanLoading = true
    this.http.get<any>('http://localhost/espace_equipement/achats/planifie', this.httpOptions).map(res => res).subscribe(data => {
      this.achatsplan = data
      this.achatplanLoading = false
    }, err => {
      console.log(JSON.stringify(err));
    });
  }



  //interfaçcage Ventes Grnde Liste
  
  

}
