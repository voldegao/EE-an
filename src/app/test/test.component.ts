import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ILoadedEventArgs, ChartTheme } from '@syncfusion/ej2-angular-charts';
import { PageEventArgs, PageService } from '@syncfusion/ej2-angular-grids'
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + window.localStorage.getItem('ESP_access_token')
      })
  }

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
     this.chartData = [
        { month: 'Jan', sales: 35 }, { month: 'Feb', sales: 28 },
        { month: 'Mar', sales: 34 }, { month: 'Apr', sales: 32 },
        { month: 'May', sales: 40 }, { month: 'Jun', sales: 32 },
        { month: 'Jul', sales: 35 }, { month: 'Aug', sales: 55 },
        { month: 'Sep', sales: 38 }, { month: 'Oct', sales: 30 },
        { month: 'Nov', sales: 25 }, { month: 'Dec', sales: 32 }
    ];
    this.chartData2 = [
        { month: 'Jan', cv: 0 }, { month: 'Fev', cv: 0 },
        { month: 'Mar', cv: 0 }, { month: 'Avr', cv: 0 },
        { month: 'Mai', cv: 0 }, { month: 'Jui', cv: 0 },
        { month: 'Jul', cv: 0 }, { month: 'Aout', cv: 0 },
        { month: 'Sep', cv: 0 }, { month: 'Oct', cv: 0 },
        { month: 'Nov', cv: 0 }, { month: 'Dec', cv: 10 }
  ]
    this.primaryXAxis = {valueType: 'Category'};
    this.pageSettings = { pageCount:5,pageSize: 1,currentPage:1 };
    // this.pageSettings = { pageCount: this.pagecount,pageSize: this.pagesize,currentPage: this.currentpage };
    this.getdata(1)
    this.getArticle()
  }




    //Filter Vatiables here
    dateDebut = '2021-01-01'
    dateFin = '2021-12-31'
    public data: Object[];
   

    // GRid Variables
    @ViewChild('grid')
    public grid: GridComponent;
    public pageSettings: PageSettingsModel;

    //Pagination Variables here
    totalItems= 0
    lastPage=0
    currentPage = 1
    pagecount = 4
    pagesize = 1

    // Chart Variables
    public primaryXAxis: any;
    public chartData: any;
    public chartData2: any;
    public marker: Object = {visible: true,height: 10,width: 10};
    public tooltip: Object = {enable: true};

    //Modal Variables
     @ViewChild('Dialog')
    public Dialog: DialogComponent;
     public header: string = 'About SYNCFUSION Succinctly Series';
    public showCloseIcon: Boolean = true;
    public width: string = '70%';
    public height: string = '75%';
    public target: string = '.control-section';
    public BtnClick = (): void => {
        this.Dialog.show();
    }

     public onOpenDialog = function(event: any): void {
// Call the show method to open the Dialog
this.Dialog.show();
  };




  // Functions here
 



  // Table data here
   getdata(page){
      let postData = new FormData();
      postData.append('dateDebut', this.dateDebut);
      postData.append('dateFin',this.dateFin);
       this.http.post<any>('http://stepup.ma/espace-equipement-api/api/cv?page='+page, postData, this.httpOptions).map(res => res).subscribe(data => {
        console.log(data);
       this.data = data.data
       this.totalItems = data.total
       this.lastPage = Math.round(data.total/data.per_page )
       
      }, err => {
        console.log(JSON.stringify(err));
      });
    }


 // Calcul Scientifique here
  coefficientVariation(sumvente,data){
    var periode: number = this.getMonths()
    if(periode>1){
      var Moy: number = sumvente/periode;
      var commanded = data.commande_d
      var sum = 0;
      for(var i of commanded){
        var q: number = Math.pow((parseFloat(i.Sumventes)-Moy), 2)
        sum = sum+q
      }
      var m: number = sum/periode;
      return (Math.sqrt(m)/Moy).toFixed(2);
    }else{
        var Moy: number = parseFloat(data.commande_d[0].MoyenneVente)
        var periode: number = data.commande_d[0].NombreVente
        var sum = 0;
        for(var i of data.commandes){
          var q: number = Math.pow((parseFloat(i.quantite)-Moy), 2)
          sum = sum+q
        }
        var m: number = sum/periode;
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

  code ="170F"
  dataArticle: any = []
  
  getArticle(){
      let postData = new FormData();
      postData.append('dateDebut', this.dateDebut);
      postData.append('dateFin',this.dateFin);
      postData.append('code',this.code);
       this.http.post<any>('http://stepup.ma/espace-equipement-api/api/cv?page=1', postData, this.httpOptions).map(res => res).subscribe(data => {
        console.log("data pour l'article : ",data);
       this.dataArticle = data.data[0].commande_d
       console.log(data.data[0].commande_d.length)

       for(var i=0;i<data.data[0].commande_d.length;i++){
        var sums = parseFloat(this.dataArticle[i].Sumventes)
        var moy = parseFloat(this.dataArticle[i].MoyenneVente)
        var res = Math.abs(sums-moy)/moy
        console.log('Sums : ',sums)
        console.log('moy : ',moy)
        console.log('res : ',res)
        this.chartData2[i].cv=Math.round(res)
        console.log(res)
       }
       console.log(this.chartData2)

      }, err => {
        console.log(JSON.stringify(err));
      });
    }



  //Pagination Functions here
   checkFirstpage(){
      if(this.currentPage == 1){
        return true
      }else{
        return false
      }
    }
  checkLastpage(){
    if(this.currentPage == this.lastPage){
      return true
    }else{
      return false
    }
  }
  nextPage(){
    if(this.currentPage<this.lastPage){
      this.currentPage = this.currentPage+1
      this.getdata(this.currentPage)
    }  
  }
  prevPage(){
    if(this.currentPage>1){
      this.currentPage = this.currentPage-1
      this.getdata(this.currentPage)
    }  
  }
  golastPage(){
    this.currentPage = this.lastPage
    this.getdata(this.lastPage)
  }
  gofirstPage(){
    this.currentPage = 1
    this.getdata(1)
  }


}
