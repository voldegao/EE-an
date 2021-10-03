import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';

import { PageEventArgs, PageService } from '@syncfusion/ej2-angular-grids'

@Component({
  selector: 'app-mad',
  templateUrl: './mad.component.html',
  styleUrls: ['./mad.component.css']
})
export class MadComponent implements OnInit {

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
       this.http.post<any>('http://stepup.ma/espace-equipement-api/api/mad?page='+this.currentpage, postData, this.httpOptions).map(res => res).subscribe(data => {
        // console.log(data);
       this.data = data.data
       
      }, err => {
        console.log(JSON.stringify(err));
      });
    }

  dateDebut = '2021-01-01'
  dateFin = '2021-01-30'
  currentpage = 1
  pagecount = 1
  pagesize = 10



  ngOnInit(): void {
    this.pageSettings = { pageCount:1,pageSize: 10,currentPage:this.currentpage };
    // this.pageSettings = { pageCount: this.pagecount,pageSize: this.pagesize,currentPage: this.currentpage };
    this.getdata()
  }

  mad(demandes,previsions){
      var ecarts = 0
      var periode = Math.round(this.getMonths())
      if(periode>=1){
        if(previsions.length>0){
          for(var i=0;i<demandes.length;i++){
            ecarts = ecarts + Math.abs(parseFloat(demandes[i].Sumventes)-parseFloat(previsions[i].Sumprevision))
          }   
          return (ecarts/periode).toFixed(2);  
        }else{
          ecarts = -1
          return NaN;
        }
        
      }else{
        return NaN;
      }
  }

   tracksignal(demandes,previsions){
      var tracks = 0
      var periode = Math.round(this.getMonths())
      var mad: any = this.mad(demandes,previsions)
      if(periode>=1){
        if(previsions.length>0 && mad != NaN){
          for(var i=0;i<demandes.length;i++){
            var a: number = parseFloat(demandes[i].Sumventes)
            var b: number = parseFloat(previsions[i].Sumprevision)

            tracks = tracks + ((a-b)/mad)
          }   
          return (tracks).toFixed(2);  
        }else{
          return NaN;
        }
        
      }else{
        return NaN;
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
