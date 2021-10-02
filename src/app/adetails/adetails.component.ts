import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ILoadedEventArgs, ChartTheme } from '@syncfusion/ej2-angular-charts';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import { ChartComponent} from '@syncfusion/ej2-angular-charts';
import { EditService, ToolbarService, PageService, NewRowPosition, PageEventArgs, EditSettingsModel  } from '@syncfusion/ej2-angular-grids';


@Component({
  selector: 'app-adetails',
  templateUrl: './adetails.component.html',
  styleUrls: ['./adetails.component.scss']
})
export class AdetailsComponent implements OnInit {

   httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + window.localStorage.getItem('ESP_access_token')
    })
  }
  @ViewChild('confirmDialog')
  public confirmDialog: DialogComponent;

  public confirmHeader: string = 'Suppression';
  public showCloseIcon: Boolean = false;
  public visible: Boolean = true;
  public hidden: Boolean = false;
  public confirmCloseIcon: Boolean = true;
  public target: string = '.control-section';
  public confirmWidth: string = '400px';
  public animationSettings: Object = { effect: 'None' };
  public hide: any;

  causeID: any
  public confirmBtnClick = (id): void => {
        this.confirmDialog.show();
        this.causeID = id
    }
    closeConfirm(){
      this.confirmDialog.hide()
    }
    deleteCause(){
      console.log(this.causeID)
      var id = this.causeID
      let postData = new FormData();
      postData.append('id',id.toString());
      this.http.post<any>('http://localhost:8000/api/article/causes/delete', postData, this.httpOptions).map(res => res).subscribe(data => {
        if(data){
          this.closeConfirm()
          this.getcauses(this.articleID)
        }
        
        }, err => {
          console.log(JSON.stringify(err));
    });
    }
    causeEditStat = false
    theCauseID: any
    editCause(id){
      this.formShow = true
      this.causeEditStat = true
      this.theCauseID = id
      this.http.get<any>('http://localhost:8000/api/article/cause/info/'+id, this.httpOptions).map(res => res).subscribe(data => {
        console.log(data)
        this.formDate = data[0].date
        this.formAction = data[0].action
        this.formCause = data[0].cause
      
      }, err => {
        console.log(JSON.stringify(err));
      });
    }

   getFamilles(){
     this.http.get<any>('http://localhost:8000/api/familles', this.httpOptions).map(res => res).subscribe(data => {
      this.familles = data
      this.getArticles()
     
    }, err => {
      console.log(JSON.stringify(err));
    });
  }

public editSettings: EditSettingsModel;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    if (!window.localStorage.getItem('logged')) {
      window.location.href = "#/login";
    } 
    this.chartData = [
      { month: 'Janvier', prevision: 0 }, { month: 'Février', prevision: 0 },
      { month: 'Mars', prevision: 0 }, { month: 'Avril', prevision: 0 },
      { month: 'Mai', prevision: 0 }, { month: 'Juin', prevision: 0 },
      { month: 'Juuillet', prevision: 0 }, { month: 'Aout', prevision: 0 },
      { month: 'Septembre', prevision: 0 }, { month: 'Octobre', prevision: 0 },
      { month: 'Novembre', prevision: 0 }, { month: 'Decembre', prevision: 0 }
    ];
this.chartData2 = [
      { month: 'Janvier', demande: 0 }, { month: 'Février', demande: 0 },
      { month: 'Mars', demande: 0 }, { month: 'Avril', demande: 0 },
      { month: 'Mai', demande: 0 }, { month: 'Juin', demande: 0 },
      { month: 'Juillet', demande: 0 }, { month: 'Aout', demande: 0 },
      { month: 'Septembre', demande: 0 }, { month: 'Octobre', demande: 0 },
      { month: 'Novembre', demande: 0 }, { month: 'Decembre', demande: 0 }
    ];    
    this.primaryXAxis = {valueType: 'Category'};

    this.getFamilles()
    // this.getFamilledata(1)
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true , newRowPosition: 'Top' };

  }

  //Familles Data
  dateDebut = this.debutYear()
  dateFin = this.halfYear()
  familles: any
  famille = "1"
  code = ""
  data: any
  getArticleName ="Nom Article"
  formShow = false
  formDate: any
  formAction: any
  formCause: any


  debutYear(){
  var d  = new Date()
  return d.getFullYear() + "-01-01"
}
halfYear(){
  var d  = new Date()
  var x = d.toLocaleDateString()
  return d.getFullYear() + "-06-30"
}

  periode = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Décembre']



  filter(){
    // console.log('p ',this.dateDebut,this.dateFin)
    // console.log('first month : ',this.getMonthNumber(this.dateDebut))
    // console.log('last month : ',this.getMonthNumber(this.dateFin))
    this.getArticledata()
    this.datePeriodesrc = this.datePeriode.slice(this.getMonthNumber(this.dateDebut),this.getMonthNumber(this.dateFin)+1)
  }
      
  datePeriode = [{id:0},{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9},{id:10},{id:11}]
  datePeriodesrc = []
  getDate(d){
    return this.periode[d]
  }
  // getPrevisions(d){
  //   if(this.data){
  //     if(this.data.previsions.length>0){
  //       var previsions = this.data.previsions
  //       for(var i = 0;i<previsions.length;i++){
  //          if(previsions[i].mois == d+1){
  //           var resu: any = parseFloat(previsions[i].Sumprevision)
  //           return resu.toFixed(0)
  //          } 
  //       }
  //     }    
  //   }
    
  // }
  getPrevisions(d){
    if(this.data){
      if(this.data.previsions.length>0){
        var previsions = this.data.previsions
        const result = previsions.find( ({ mois }) => mois === d+1 );
        if(result){
          var resu: any = parseFloat(result.Sumprevision)
          return resu.toFixed(0)
        }else{
          return 0
        }
      }    
    }
    
  }
  getDemandes(d){
    if(this.data){
      if(this.data.commande_d.length>0){
        var demandes = this.data.commande_d
        const result = demandes.find( ({ Mois }) => Mois === d+1 );
        if(result){
          var resu: any = parseFloat(result.Sumventes)
          return resu.toFixed(0)
        }else{
          return 0
        }
      }else{
        return 0
      }
      
     
    }
  }
  // getDemandes(d){
  //   if(this.data){
  //     if(this.data.commande_d.length>0){
  //       var demandes = this.data.commande_d
  //       for(var i = 0;i<demandes.length;i++){
  //           if(demandes[i].Mois == d+1){
  //            var resu: any = parseFloat(demandes[i].Sumventes)
  //             return resu.toFixed(0)
  //           }
  //       }
  //     }
      
     
  //   }
  // }
  cumuleSave: any = 0
  totalCumule: any = 0
  getEcartCumule(d){
    if(this.data){
      if(this.data.commande_g.length>0){
        if(d == 0){
          var ecart: any = this.getDemandes(d)- this.getPrevisions(d)
          this.cumuleSave = ecart
          this.totalCumule = ecart + this.totalCumule
          return ecart
        }else{
          var ecart: any = this.getDemandes(d)- this.getPrevisions(d) + this.cumuleSave
          this.cumuleSave = ecart
          this.totalCumule = ecart + this.totalCumule
          return ecart
        }
      }
      
     
    }
  }

  // Chart Variables
  public primaryXAxis: any;
  public chartData: any;
  public chartData2: any;
  public marker: Object = {visible: true,height: 10,width: 10};
  public tooltip: Object = {enable: true};
  selectedCode: any
  @ViewChild('chart')
  public chart: ChartComponent;
  public title: string = 'Sales Comparision';

 

  articles: any 

 setFamille(famille){
  this.famille = famille
  this.formShow = false
  // console.log(this.famille)
  this.getArticles()
  // this.getFamilledata(1)
 }   

 setArticle(code,id){
  this.code = code
  this.articleID = id
  this.formShow = false
  // console.log(this.famille)
   this.getArticledata()
   this.getcauses(this.articleID)
 }   


 getArticles(){
    let postData = new FormData();
    postData.append('famille',this.famille);
    this.http.post<any>('http://localhost:8000/api/famille/articles', postData, this.httpOptions).map(res => res).subscribe(data => {
       this.articles = data[0].articles
       this.onSearchChange('')
      }, err => {
        console.log(JSON.stringify(err));
  });
 }

 getArticledata(){
  this.resetChart()
    let postData = new FormData();
    postData.append('dateDebut', this.dateDebut);
    postData.append('dateFin',this.dateFin);
    postData.append('code',this.code);
    this.http.post<any>('http://localhost:8000/api/biais', postData, this.httpOptions).map(res => res).subscribe(data => {
      if(data.data.length > 0){
        this.data = data.data[0]
        this.getArticleName = data.data[0].designation
        this.datePeriodesrc = this.datePeriode.slice(this.getMonthNumber(this.dateDebut),this.getMonthNumber(this.dateFin)+1)
        this.chartData = []   
        this.chartData2 = [] 
        this.chart.series[0].dataSource = this.chartData
        this.chart.series[1].dataSource = this.chartData2
        this.chart.refresh();
        this.coefficientVariationArticle(data.data[0].commande_d,data.data[0].previsions)
        // this.getdataForChart()
        // this.getdataForChart2()
      }else{
        this.resetChart()
      }
      
       
      }, err => {
        console.log(JSON.stringify(err));
  });
}

rangeDateMad = []
getrangeDateMad(){
  var firstDate
  this.rangeDateMad = []
  if(this.dateDebut){
    firstDate = this.dateDebut
    var d = new Date(firstDate)
    if(d.getMonth()<=4){
      var p = d.getMonth()
      for(var i=0;i<11;i++){
        var o = p+8+i
        if(o>12){
          o = o-12
          this.rangeDateMad.push(o)
        }else if(o>24){
          o = o-24
          this.rangeDateMad.push(o)
        }else{
          this.rangeDateMad.push(o)
        }
      }
   }else{
      var p = d.getMonth()
      for(var i=0;i<11;i++){
        var o = p+8+i
        if(o>12 && o<=24){
          o = o-12
          this.rangeDateMad.push(o)
        }else if(o>24){
          o = o-24
          this.rangeDateMad.push(o)
        }else{
          this.rangeDateMad.push(o)
        }
      }
    }   
  }
  // console.log('la liste des mois est : ',this.rangeDateMad)
  return this.rangeDateMad
}


cvArticleDataDetails: any
coefficientVariationArticle(commandec,previsions){

  this.cvArticleDataDetails = []
    var Moy: number = 0
    var per = this.getMonths()
    var prevision = previsions
    var listeMois = this.getrangeDateMad()
    var f = listeMois.slice(5)
    var dmd =[]
    //  console.log('les demanes btute : ',commandec)
    for(var i =0;i<per;i++){
      var demande = commandec.filter(({Mois,Year})=>Mois===prevision[i].mois && Year === prevision[i].Year)
      // console.log('kik ',demande)
      if(demande.length>0){
        dmd.push(parseFloat(demande[0].Sumventes))
      }else{
        dmd.push(0)
      }
    }
    // console.log('dmd ',dmd)
      var ecartCumule = 0
      if(per<=6){
        for(var i =0;i<per;i++){
          var ecart = dmd[i]-parseFloat(prevision[i].Sumprevision)
          ecartCumule = ecartCumule + ecart
          var o = f[i]-1
          this.cvArticleDataDetails.push({
            monthID:o,
            periode:this.periode[o],
            demande:dmd[i],
            prevision:prevision[i].Sumprevision,
            ecart:ecart.toFixed(2),
            ecartCumule:ecartCumule.toFixed(2),
  
          })
        }
      }else{
        for(var i =0;i<6;i++){
          var ecart = dmd[i]-parseFloat(prevision[i].Sumprevision)
          ecartCumule = ecartCumule + ecart
          var o = f[i]-1
          this.cvArticleDataDetails.push({
            monthID:o,
            periode:this.periode[o],
            demande:dmd[i],
            prevision:prevision[i].Sumprevision,
            ecart:ecart.toFixed(2),
            ecartCumule:ecartCumule.toFixed(2),
  
          })
        }
      }
      
     
      this.cumuleSave = ecartCumule
      // this.CaculateDataSetArticleChart()
      this.chartData = []   
      this.chartData2 = []   
      for(var i = 0;i<f.length;i++){
        this.chartData.push({month:this.cvArticleDataDetails[i].periode,prevision:this.cvArticleDataDetails[i].prevision})
        this.chartData2.push({month:this.cvArticleDataDetails[i].periode,demande:this.cvArticleDataDetails[i].demande})
      }
      this.chart.series[0].dataSource = this.chartData
      this.chart.series[1].dataSource = this.chartData2
      this.chart.refresh();
  
} 










getdataForChart(){
   
    if(this.data){
      if(this.data.previsions.length>0){
        var previsions = this.data.previsions
        for(var i=0;i<this.getMonths();i++){
          var index = previsions[i].mois - 1
          var sum = parseFloat(previsions[i].Sumprevision)
          this.chartData[index].prevision = sum
        }
        this.refreshdata()

      }else{
        this.resetChart()
      }
    }
  }

  getdataForChart2(){
       
    if(this.data){
      if(this.data.commande_d.length>0){
        var demandes = this.data.commande_d
        for(var i=0;i<demandes.length;i++){
          var index = demandes[i].Mois - 1
          var sum = parseFloat(demandes[i].Sumventes)
          this.chartData2[index].demande = sum
        }
        this.refreshdata()

      }else{
        this.resetChart()
      }
    }
  }

 
  
  public refreshdata(): void {
      this.chart.series[0].dataSource = this.chartData.slice(this.getMonthNumber(this.dateDebut),this.getMonthNumber(this.dateFin)+1);;
      this.chart.series[1].dataSource = this.chartData2.slice(this.getMonthNumber(this.dateDebut),this.getMonthNumber(this.dateFin)+1);;
      this.chart.refresh();
    }

getMonths(){
    var date1 = new Date(this.dateDebut);
    var date2 = new Date(this.dateFin);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference = Difference_In_Time / (1000 * 3600 * 24*30);
    return Math.round(Difference)
}

getMonthNumber(x){
  var d = new Date(x)
  return d.getMonth()
}
resetChart(){
  this.chartData = [
    { month: 'Janvier', prevision: 0 }, { month: 'Février', prevision: 0 },
    { month: 'Mars', prevision: 0 }, { month: 'Avril', prevision: 0 },
    { month: 'Mai', prevision: 0 }, { month: 'Juin', prevision: 0 },
    { month: 'Juillet', prevision: 0 }, { month: 'Aout', prevision: 0 },
    { month: 'Septembre', prevision: 0 }, { month: 'Octobre', prevision: 0 },
    { month: 'Novembre', prevision: 0 }, { month: 'Decembre', prevision: 0 }
  ];
this.chartData2 = [
    { month: 'Janvier', demande: 0 }, { month: 'Février', demande: 0 },
    { month: 'Mars', demande: 0 }, { month: 'Avril', demande: 0 },
    { month: 'Mai', demande: 0 }, { month: 'Juin', demande: 0 },
    { month: 'Juillet', demande: 0 }, { month: 'Aout', demande: 0 },
    { month: 'Septembre', demande: 0 }, { month: 'Octobre', demande: 0 },
    { month: 'Novembre', demande: 0 }, { month: 'Decembre', demande: 0 }
  ];    

  this.refreshdata()
  this.datePeriodesrc = []
  }

  @ViewChild('Dialogform')
  public Dialogform: DialogComponent;
   public headerform: string = '';
  public showCloseIconform: Boolean = true;
  public widthform: string = '40%';
  public heightform: string = '40%';
  public targetform: string = '.control-section';
articleID: any 
  public onOpenDialogform = function(id): void {
    this.articleID = id
    this.Dialogform.show();
  };


  addcause(){
    this.formShow = true
    this.formAction = ''
    this.formCause = ''
    this.formDate = ''
  }
  closecause(){
    this.formShow = false
    this.formAction = ''
    this.formCause = ''
    this.formDate = ''
  }
  validateCause(){
      let postData = new FormData();
      postData.append('date',this.formDate)
      postData.append('cause',this.formCause);
      postData.append('action',this.formAction);
      if(this.causeEditStat == true){
        // console.log('Edit this $hit')
        this.http.post<any>('http://localhost:8000/api/article/causes/update/'+this.theCauseID, postData, this.httpOptions).map(res => res).subscribe(data => {
            // console.log(data)
            this.getcauses(this.articleID)
            this.causeEditStat = false
            this.formShow = false
            }, err => {
              console.log(JSON.stringify(err));
        }); 
      }else{
        // console.log('new one yes')
        postData.append('article_id',this.articleID);
        this.http.post<any>('http://localhost:8000/api/article/causes/create', postData, this.httpOptions).map(res => res).subscribe(data => {
            // console.log(data)
            this.getcauses(this.articleID)
            this.formShow = false
            }, err => {
              console.log(JSON.stringify(err));
        }); 
        // console.log('new one yes')
      }
      
  }
  causesData: any
  getcausesData(id){
    if(this.causesData){
      return this.causesData.filter(({mois})=>mois===id+1)
    }
   
  }
  getcauses(id){
    this.causesData = []
    let postData = new FormData();
      postData.append('datedebut',this.dateDebut);
      postData.append('datefin',this.dateFin)
    this.http.post<any>('http://localhost:8000/api/article/causes/'+id,postData, this.httpOptions).map(res => res).subscribe(data => {
      // console.log(data)
      this.causesData = data
     }, err => {
       console.log(JSON.stringify(err));
 }); 
  }

  searchWord: any = ''
  articlesFiltred: any = []
  onSearchChange(searchWord){
    var art = this.articles.filter(({code})=>code.includes(searchWord))
    console.log(art)
    this.articlesFiltred = art
  }

}
