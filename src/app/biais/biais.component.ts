import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';

import { PageEventArgs, PageService } from '@syncfusion/ej2-angular-grids'

@Component({
  selector: 'app-biais',
  templateUrl: './biais.component.html',
  styleUrls: ['./biais.component.css']
})
export class BiaisComponent implements OnInit {

  constructor(private http: HttpClient) { }

  httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + window.localStorage.getItem('ESP_access_token')
      })
  }
  
    public data: Object[];
    public pageSettings: PageSettingsModel;

    @ViewChild('grid')
    public grid: GridComponent;

    getdata(){
      let postData = new FormData();
      postData.append('dateDebut', this.dateDebut);
      postData.append('dateFin',this.dateFin);
       this.http.post<any>('http://localhost:8000/api/biais?page='+this.currentpage, postData, this.httpOptions).map(res => res).subscribe(data => {
        // console.log(data);
       this.data = data.data
       
      }, err => {
        console.log(JSON.stringify(err));
      });
    }

  dateDebut = this.debutYear()
  dateFin = this.halfYear()
  currentpage = 1
  pagecount = 1
  pagesize = 10

debutYear(){
  var d  = new Date()
  return d.getFullYear() + "-01-01"
}
halfYear(){
  var d  = new Date()
  var x = d.toLocaleDateString()
  return d.getFullYear() + "-06-30"
}

  ngOnInit(): void {
    if (!window.localStorage.getItem('logged')) {
      window.location.href = "#/login";
    } 
    this.pageSettings = { pageCount:1,pageSize: 10,currentPage:this.currentpage };
    // this.pageSettings = { pageCount: this.pagecount,pageSize: this.pagesize,currentPage: this.currentpage };
    this.getdata()
  }


 

  biais(demandes,previsions){
      var EcartTotal = 0
      if(previsions.length>0){
        EcartTotal = parseFloat(demandes[0].Sumventes)-parseFloat(previsions[0].Sumprevision)
      }else{
        EcartTotal = -1
      }
      return EcartTotal
  }
  biaispercent(demandes,previsions){
    if(previsions.length>0){
        var percent = 100*this.biais(demandes,previsions)/parseFloat(demandes[0].Sumventes)
        return percent.toFixed(2)+' %'
      }else{
        return -1
      }
      
  }
  coefficientVariation(sumvente,data){
    var periode = this.getMonths()
    if(periode>1){
      var Moy = sumvente/periode;
      var commanded = data.commande_d
      var sum = 0;
      for(var i of commanded){
        var q = Math.pow((parseFloat(i.Sumventes)-Moy), 2)
        sum = sum+q
      }
      var m = sum/periode;
      return (Math.sqrt(m)/Moy).toFixed(2);
    }else{
        var Moy = parseFloat(data.commande_d[0].MoyenneVente)
        var periode: number = parseFloat(data.commande_d[0].NombreVente)
        var sum = 0;
        for(var i of data.commandes){
          var q = Math.pow((parseFloat(i.quantite)-Moy), 2)
          sum = sum+q
        }
        var m = sum/periode;
        return (Math.sqrt(m)/Moy).toFixed(2);
    }
    
  } 

  getMonths(){
      var date1 = new Date(this.dateDebut);
      var date2 = new Date(this.dateFin);
      var Difference_In_Time = date2.getTime() - date1.getTime();
      var Difference = Difference_In_Time / (1000 * 3600 * 24*30);
      return Difference
  }
  
  

}
