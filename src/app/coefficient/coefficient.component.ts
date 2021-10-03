import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { GridComponent,ToolbarItems,PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ILoadedEventArgs, ChartTheme } from '@syncfusion/ej2-angular-charts';
import { PageEventArgs, PageService } from '@syncfusion/ej2-angular-grids'
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import { ChartComponent} from '@syncfusion/ej2-angular-charts';
import { ClickEventArgs } from '@syncfusion/ej2-navigations'
// import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-coefficient',
  templateUrl: './coefficient.component.html',
  styleUrls: ['./coefficient.component.scss']
})
export class CoefficientComponent implements OnInit {

  created(){ 
    this.grid.showSpinner(); 
  } 

  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + window.localStorage.getItem('ESP_access_token')
    })
}
public initialPage: Object;

constructor(private http: HttpClient) { }

@ViewChild('element') element;
public position = { X: 'Right' };

onCreate() {
this.element.show();
}

toolbar: ToolbarItems[] | object;
ngOnInit(): void {
  if (!window.localStorage.getItem('logged')) {
    window.location.href = "#/login";
  } 

  this.initialPage = { pageSizes: true, pageCount: 4 };
   this.chartData = [
      { month: 'Jan', sales: 35 }, { month: 'Feb', sales: 28 },
      { month: 'Mar', sales: 34 }, { month: 'Apr', sales: 32 },
      { month: 'May', sales: 40 }, { month: 'Jun', sales: 32 },
      { month: 'Jul', sales: 35 }, { month: 'Aug', sales: 55 },
      { month: 'Sep', sales: 38 }, { month: 'Oct', sales: 30 },
      { month: 'Nov', sales: 25 }, { month: 'Dec', sales: 32 }
  ];
  this.chartData2 = []
  this.primaryXAxis = {valueType: 'Category'};
  this.pageSettings = { pageCount:5,pageSize: 1,currentPage:1 };
  // this.pageSettings = { pageCount: this.pagecount,pageSize: this.pagesize,currentPage: this.currentpage };
  this.getdata(1)
  this.getArticle()
  this.getParams()
  this.toolbar = [
                  { text: 'Filtrer',prefixIcon: 'e-filter', id: 'Click' },
                  { text:this.dateDebut+' / '+this.dateFin,prefixIcon: 'e-date-time'},
                  'CsvExport',
                  'ExcelExport',
                  'Print',
                  'Search'
                ];

   

}

toolbarClick(args: ClickEventArgs): void {
  switch (args.item.text) {
      case 'Filtrer':
          this.FilterBtn()
          break;
      case 'PDF Export':
          this.grid.pdfExport();
          break;
      case 'Excel Export':
          this.grid.excelExport();
          break;
      case 'CSV Export':
          this.grid.csvExport();
          break;
  }
} 

dataLoading = true
dateDebut = this.debutYear()
dateFin = this.halfYear()
public data: Object[];

periode = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novenmbre','Décembre']
    
    datePeriode = [{id:0},{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9},{id:10},{id:11}]
    datePeriodesrc = this.datePeriode.slice(this.getMonthNumber(this.dateDebut),this.getMonthNumber(this.dateFin)+1)
   
    getDate(d){
      return this.periode[d]
    }



  //Filter Vatiables here



 

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



  //Filtre Params
  familles: any
  zones: any
  clients: any

  //filter inputs
  codeFilter = ""
  articleFilter = ""
  zoneFilter = ""
  familleFilter = ""
  clientFilter = ""
  classeFilter = ""
  stratFilter = ""
  datedFilter = ""
  datefFilter = ""
  bed = ""

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
    public refreshdata(): void {
      this.chart.series[0].dataSource = this.chartData2.slice(this.getMonthNumber(this.dateDebut),this.getMonthNumber(this.dateFin)+1);;
      this.chart.refresh();
    }

    getMonthNumber(x){
      var d = new Date(x)
      return d.getMonth()
    }

  //Modal Variables
   @ViewChild('Dialog')
  public Dialog: DialogComponent;
  public header: string = '';
  public showCloseIcon: Boolean = true;
  public width: string = '80%';
  public height: string = '87%';
  public target: string = '.control-section';
  

  //Filter Dialog
   @ViewChild('Filterdialog')
  public Filterdialog: DialogComponent;
  public headerFilter: string = 'Filtre';
   public showCloseIconFilter: Boolean = true;
  public widthFilter: string = '25%';
  public heightFilter: string = '64%';
  // public target: string = '.control-section';

  public FilterBtn = (): void => {
      this.Filterdialog.show();
  }


   public onOpenDialog = function(event: any,code): void {
    // Call the show method to open the Dialog
    this.selectedCode = code
    this.header = 'Coefficient de variation : '+this.selectedCode
    this.Dialog.show();
    // this.getdataForChart()
    this.getarticledata(1,code)
    };


  public toasts: { [key: string]: Object }[] = [
      {content: 'Donnée enregistrée avec succès.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
      {content: 'Problème d enregistrement des données.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' }
  ];

// Functions here

changeStrat(id,val){
  let postData = new FormData();
  postData.append('id',id);
  postData.append('strategie', val);
   this.http.post<any>('http://stepup.ma/espace-equipement-api/api/change/strategie',postData, this.httpOptions).map(res => res).subscribe(data => {
    console.log(data);
    this.element.show(this.toasts[0]);
  }, err => {
    console.log(JSON.stringify(err));
    this.dataLoading = false
    this.element.show(this.toasts[1]);
  });
}
changeClasse(id,val){
  let postData = new FormData();
  postData.append('id',id);
  postData.append('classe', val);
   this.http.post<any>('http://stepup.ma/espace-equipement-api/api/change/classe',postData, this.httpOptions).map(res => res).subscribe(data => {
    console.log(data);
    this.element.show(this.toasts[0]);
  }, err => {
    console.log(JSON.stringify(err));
    this.dataLoading = false
    this.element.show(this.toasts[1]);
  });
}


todayDate(){
  var d  = new Date()
  var x = d.toLocaleDateString()
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + 1
  // return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
}



sixMonths(){
  var d = new Date();
  d.setMonth(d.getMonth() - 6);
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + 1
  // return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
}


debutYear(){
  var d  = new Date()
  var m = d.getMonth()
  if(m>=6){
    if((m-5)<10){
      return d.getFullYear()+"-0"+(m-5)+"-01"
    }else{
      return d.getFullYear()+"-"+(m-5)+"-01"
    }
    
  }else{
    var v = 7+m
    if(v<10){
      return  (d.getFullYear()-1)+"-0"+v+"-01"
    }else{
      return  (d.getFullYear()-1)+"-"+v+"-01"
    }
   
  }
}
halfYear(){
  var d  = new Date()
  var m = d.getMonth()+1

  var lastday= new Date(d.getFullYear(), m, 0);
  var l =  lastday.getDate()
  if(m>9){
    return d.getFullYear()+'-'+m+'-'+l
  }else{
    return d.getFullYear()+'-0'+m+'-'+l
    
  }
}
finYear(){
  var d  = new Date()
  var x = d.toLocaleDateString()
  return d.getFullYear() + "-12-31"
}

rangeDateCv = []
getrangeDateCv(){
  var firstDate
  this.rangeDateCv = []
  if(this.datedFilter){
    firstDate = this.datedFilter
    var d = new Date(firstDate)
    if(d.getMonth()<=4){
      var p = d.getMonth()
      for(var i=0;i<11;i++){
        var o = p+8+i
        if(o>12){
          o = o-12
          this.rangeDateCv.push(o)
        }else{
          this.rangeDateCv.push(o)
        }   
      }
    }else{
      var p = d.getMonth()
      // console.log('month is ',p)
      for(var i=0;i<11;i++){
        var o = p+8+i
        if(o>12){
          o = o-12
          this.rangeDateCv.push(o)
        }else{
          this.rangeDateCv.push(o)
        }
      }
    }   
  }else{
    firstDate = this.dateDebut
    var d = new Date(firstDate)
    if(d.getMonth()<=4){
      var p = d.getMonth()
      for(var i=0;i<11;i++){
        var o = p+8+i
        if(o>12){
          o = o-12
          this.rangeDateCv.push(o)
        }else{
          this.rangeDateCv.push(o)
        }   
      }
    }else{
      var p = d.getMonth()
      for(var i=0;i<11;i++){
        var o = p+8+i
        if(o>12){
          o = o-12
          this.rangeDateCv.push(o)
        }else{
          this.rangeDateCv.push(o)
        }
      }
    }   
  }
  
  
}

dateDebutGraph(){
  var firstDate
  if(this.datedFilter){
    firstDate = this.datedFilter
    var d = new Date(firstDate)
    if(d.getMonth()<=4){
      var p = d.getMonth()
      this.rangeDateCv = [p+8,p+9,p+10,p+11,p+12,p+1,p+2,p+3,p+4,p+5,p+6]
      // console.log('llooool ',this.rangeDateCv)
      return (d.getFullYear()-1) + "-" + (d.getMonth()+8) + "-" + 1
    }else{
      // console.log(d.getFullYear() + "-" + (d.getMonth() - 4) + "-" + 1)
      return d.getFullYear() + "-" + (d.getMonth() - 4) + "-" + 1
    }   
  }else{
    firstDate = this.dateDebut
    var d = new Date(firstDate)
    if(d.getMonth()<=4){
      // console.log('voici la liste range des date :',(d.getFullYear()-1) + "-" + (d.getMonth()+8) + "-" + 1)
      return (d.getFullYear()-1) + "-" + (d.getMonth()+8) + "-" + 1
    }else{
      // console.log(d.getFullYear() + "-" + (d.getMonth() - 4) + "-" + 1)
      return d.getFullYear() + "-" + (d.getMonth() - 4) + "-" + 1
    }   
  }
  
}

zoni(zones,zonesd){
  var doo = []
  var per = this.getMonths()
  for(var i = 0;i<zones.length;i++){
    //var MoyZone = parseFloat(zones[i].MoyenneVente)
    // var NbreZone = parseFloat(zones[i].NombreVente)
    var zoneID = zones[i].zone_id
    var MoyZone = parseFloat(zones[i].Sumventes)/per

    var sum = 0
    for(var j=0;j<zonesd.length;j++){
      if(zonesd[j].zone_id == zoneID){
        var zoneSum = parseFloat(zonesd[j].Sumventes)
        var ecart = Math.pow((zoneSum - MoyZone), 2)
       
        sum = sum + ecart     
      }
    }
    var m: number = sum/per;
    var last = (Math.sqrt(m)/MoyZone).toFixed(2);
    var z = {zone:zones[i].zone.zone,cv:last}
    doo.push(z)
  }
  // console.log(doo)
  return doo
}

// Table data here
dataGlobal: any
 getdata(page){
   this.dataGlobal = []
   this.dataLoading = true
    let postData = new FormData();
    postData.append('dateDebut',this.dateDebut);
    postData.append('dateFin', this.dateFin);
    postData.append('code', this.codeFilter);
    postData.append('article', this.articleFilter);
    postData.append('famille', this.familleFilter);
    postData.append('client', this.clientFilter);
    postData.append('zone', this.zoneFilter);
    postData.append('classe', this.classeFilter);
    postData.append('startegie', this.stratFilter);
     this.http.post<any>('http://stepup.ma/espace-equipement-api/api/cv?page='+page, postData, this.httpOptions).map(res => res).subscribe(data => {
      // console.log(data);
      this.dataLoading = false
     this.data = data
     this.totalItems = data.total
     this.lastPage = Math.round(data.total/data.per_page )

     for(var i=0;i<data.length;i++){
      var x = {
        id:data[i].id,
        code:data[i].code,
        designation:data[i].designation,
        classe:data[i].classe,
        strategie:data[i].strategie,
        cv:Number(this.coefficientVariation(data[i].commande_c,data[i].commande_v[0])),
      }
      this.dataGlobal.push(x)
      
     }
     this.grid.refresh();
     console.log(this.dataGlobal)
     
     
    }, err => {
      console.log(JSON.stringify(err));
      this.dataLoading = false
    });
  }

  ArticleData: any
dataLoadingArticle = false
  getarticledata(page,code){
    this.dataLoadingArticle = true
    let postData = new FormData();
    postData.append('dateDebut',this.dateDebutGraph());
    postData.append('dateFin', this.dateFin);
    postData.append('code', code);
    postData.append('article', this.articleFilter);
    postData.append('famille', this.familleFilter);
    postData.append('client', this.clientFilter);
    postData.append('zone', this.zoneFilter);
    postData.append('classe', this.classeFilter);
    postData.append('startegie', this.stratFilter);
     this.http.post<any>('http://stepup.ma/espace-equipement-api/api/cv?page='+page, postData, this.httpOptions).map(res => res).subscribe(data => {
      this.dataLoadingArticle = false 
     this.ArticleData = data[0]
    //  console.log('loooooool')
     this.coefficientVariationArticle(this.ArticleData.commande_c,this.ArticleData.previsions_c)
     
    }, err => {
      console.log(JSON.stringify(err));
      this.dataLoadingArticle =false
    });
  }

  getArticlevente(id){
    if(this.ArticleData){
      var demandes = this.ArticleData.commande_d
     
      var info = demandes.filter(({Mois})=>Mois === id+1)
      if(info.length>0){
        var ventes = parseFloat(info[0].Sumventes)
        return ventes
      }else{
        return 0
      }
    }
   
    
  }
  getArticleprev(id){
    if(this.ArticleData){
      var prev = this.ArticleData.previsions
      var info = prev.filter(({mois})=>mois=== id+1)
      if(info.length>0){
        var prevision = parseFloat(info[0].Sumprevision)
        return prevision
      }else{
        return 0
      }
    }
   
  }
  getArticleecart(id){
    if(this.ArticleData){
    var ecart = this.getArticlevente(id)-this.getArticleprev(id)
    return ecart
  }
}


  filter(){
    this.dataGlobal = []
    let postData = new FormData();
    if(this.datedFilter == ''){
      this.dateDebut= this.sixMonths()
    }else{
      this.dateDebut = this.datedFilter
    }
    if(this.datefFilter == ''){
      this.dateFin = this.todayDate()
    }else{
      this.dateFin = this.datefFilter
    }

    this.dataLoading =true
    postData.append('dateDebut',this.dateDebut);
    postData.append('dateFin', this.dateFin);
    postData.append('code', this.codeFilter);
    postData.append('article', this.articleFilter);
    postData.append('famille', this.familleFilter);
    postData.append('client', this.clientFilter);
    postData.append('zone', this.zoneFilter);
    postData.append('classe', this.classeFilter);
    postData.append('startegie', this.stratFilter);
     this.http.post<any>('http://stepup.ma/espace-equipement-api/api/cv?page=1', postData, this.httpOptions).map(res => res).subscribe(data => {
      // console.log(data);
     this.data = data
     this.totalItems = data.total
     this.lastPage = Math.round(data.total/data.per_page )
     this.Filterdialog.hide()
     this.datePeriodesrc = this.datePeriode.slice(this.getMonthNumber(this.dateDebut),this.getMonthNumber(this.dateFin)+1)
     this.dataLoading =false
     for(var i=0;i<data.length;i++){
      var x = {
        id:data[i].id,
        code:data[i].code,
        designation:data[i].designation,
        classe:data[i].classe,
        strategie:data[i].strategie,
        cv:Number(this.coefficientVariation(data[i].commande_c,data[i].commande_v[0])),
      }
      this.dataGlobal.push(x)
      
     }
     this.grid.refresh();
     console.log(this.dataGlobal)
     
    }, err => {
      console.log(JSON.stringify(err));
      this.dataLoading =false
    });
  }

  getParams(){
     this.http.get<any>('http://stepup.ma/espace-equipement-api/api/params', this.httpOptions).map(res => res).subscribe(data => {
        this.familles = data.familles
        this.clients = data.clients
        this.zones = data.zones
    }, err => {
      console.log(JSON.stringify(err));
    });
  }

  getdataForChart(){

    if(this.datefFilter == ''){
      this.dateFin = this.halfYear()
    }else{
      this.dateFin = this.datefFilter
    }

    let postData = new FormData();
    postData.append('dateDebut',this.dateDebutGraph());
    postData.append('dateFin', this.dateFin);
    postData.append('code', this.selectedCode);
    
     this.http.post<any>('http://stepup.ma/espace-equipement-api/api/cvChart', postData, this.httpOptions).map(res => res).subscribe(data => {
       this.getrangeDateCv()
      this.setChartData(data)
     
    }, err => {
      console.log(JSON.stringify(err));
    });
  }

  periodeRange = []
  getperiodeR(){
    this.periodeRange = []
    var firstDate
    var first
    if(this.datedFilter){
      firstDate = this.datedFilter
      var d = new Date(firstDate)
      first =  d.getMonth()+1
    }else{
      firstDate = this.dateDebut
      var d = new Date(firstDate)
      first = d.getMonth()+1
    }
    for(var i =0;i<6;i++){
        var o = first+i
        if(o>12){
          this.periodeRange.push(o-12)
        }else{
          this.periodeRange.push(o)
        }
    }
    return this.periodeRange
  }
  cmdCV = []
  setCmd(commandes){
    this.cmdCV = []
    if(this.rangeDateCv){
      for(var i=0;i<this.rangeDateCv.length;i++){
        var cmd = commandes.filter(({Mois})=>Mois === this.rangeDateCv[i])
        if(cmd.length>0){
          this.cmdCV.push(cmd[0].Sumventes)
        }else{
          this.cmdCV.push(0)
        }
      }
    }
    // console.log('this is th final one :',this.cmdCV)
    return this.cmdCV
  }

  setChartData(data){
    if(this.data){
      var commandes = data[0].commande_d
      // console.log('this is commande d : ',commandes)
      var cmds = this.setCmd(commandes)
      var moisListe = this.getperiodeR()
      // console.log(moisListe)
      // console.log(this.chartData2)
      for(var i=0;i<moisListe.length;i++){
        var sum = 0
        var Moy = 0
        for(var k=i;k<6+i;k++){
          sum = sum + parseFloat(cmds[k])
        }
        Moy = sum/6
        // console.log('sum of : ',sum,Moy)
        var ecarts = 0
        for(var k=i;k<6+i;k++){
          ecarts = ecarts + Math.pow((parseFloat(cmds[k])-Moy),2)
        }
        var s = ecarts/6
        var cv = Math.sqrt(s)/Moy
        // console.log('this th CV done : ',cv)
        var indice = moisListe[i]-1
        this.chartData2[indice].cv = cv.toFixed(2)

      }
      this.refreshdata()
  }else{
    this.chartData2 = []
  }
  }
  
  cvChart(commandeg,data){
    var Moy: number = 0
    var per = this.getMonths()
    // console.log('la peride ::: ',per)
    
      Moy = parseFloat(commandeg.Sumventes)/per
   
   

    var item =  {"Sumventes": 0}
    var commanded = data.commande_d

    var dif = per-commanded.length
    if(dif>0){
      for(var j =0;j<dif;j++){
        commanded.push(item)
      }
    }

    // console.log('la moyenne est de : ',Moy)
    // console.log('this is commanded',commanded)
    var sum = 0;
    for(var i of commanded){
      var q: number = Math.pow((parseFloat(i.Sumventes)-Moy), 2)
      sum = sum+q
      // console.log('la somme ecart est de: ',sum)
    }
    var m: number = sum/per;
    // var m: number = sum/commandeg.NombreVente;
    return (Math.sqrt(m)/Moy).toFixed(2);
  
  
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

articleCVDetails: any
coefficientVariation(commandec,data){
    var Moy: number = 0
    var per = this.getMonths()
    var listeMois = this.getrangeDateMad()
    var dmd =[]
     
    for(var i =0;i<listeMois.length;i++){
      var demande = commandec.filter(({Mois})=>Mois===listeMois[i])
      if(demande.length>0){
        dmd.push(parseFloat(demande[0].Sumventes))
      }else{
        dmd.push(0)
      }
    }
    console.log('demande d Article :',dmd)
    if(data != undefined){
      Moy = parseFloat(data.Sumventes)/per
    }
    
   
    var sum = 0;
    for(var i=0;i<dmd.length;i++){
      var q: number = Math.pow((parseFloat(dmd[i])-Moy), 2)
      sum = sum+q
    }
    console.log('Moy ',Moy)
    var m: number = sum/listeMois.length;
    return (Math.sqrt(m)/Moy).toFixed(2);
  
  
} 
cvArticleDataDetails: any
coefficientVariationArticle(commandec,previsionsc){
  this.cvArticleDataDetails = []
    var Moy: number = 0
    var per = this.getMonths()
    var listeMois = this.getrangeDateMad()
    var f = listeMois.slice(5)
    var dmd =[]
    var prev = []
     
    for(var i =0;i<listeMois.length;i++){
      var demande = commandec.filter(({Mois})=>Mois===listeMois[i])
      var prevision = previsionsc.filter(({mois})=>mois===listeMois[i])
      if(demande.length>0){
        dmd.push(parseFloat(demande[0].Sumventes))
      }else{
        dmd.push(0)
      }
      if(prevision.length>0){
        prev.push(parseFloat(prevision[0].Sumventes))
      }else{
        prev.push(0)
      }
    }
   
    ////////////////
      //Liste des Moyenne par Periode de 6 Mois
      var Moys = []
      for(var i=0;i<6;i++){
        var sum = 0
        for(var k=i;k<6+i;k++){
          sum = sum + dmd[k]
        }
        Moys.push(sum/6)
      }
      // console.log('Liste des Moyennes :: ',Moys)
      //Liste des CV
      var cvFinal = []
      for(var i=0;i<6;i++){
        var s = 0
        for(var k=i;k<6+i;k++){
          var q: number = Math.pow((parseFloat(dmd[i])-Moys[i]), 2)
          s = s+q
        }
        var m: number = s/6;
        var cv = (Math.sqrt(m)/Moys[i]).toFixed(2);
       
        cvFinal.push(cv)
      }

      for(var i =0;i<6;i++){
        var o = f[i]-1
        if(previsionsc[5+i] != undefined && previsionsc.length>5){
          this.cvArticleDataDetails.push({
            periode:this.periode[o],
            demande:dmd[5+i],
            prevision:previsionsc[5+i].Sumprevision,
            mad:cvFinal[i]
  
          })
        }else{
          this.cvArticleDataDetails.push({
            periode:this.periode[o],
            demande:dmd[5+i],
            prevision:NaN,
            mad:cvFinal[i]
  
          })
        }
        
      }
      /////////
      this.CaculateDataSetArticleChart()
  
} 

CaculateDataSetArticleChart(){
  this.chartData2 = []   
  for(var i = 0;i<6;i++){
    this.chartData2[i] = {month:this.cvArticleDataDetails[i].periode,cv:this.cvArticleDataDetails[i].mad}
  }
  this.chart.series[0].dataSource = this.chartData2
  this.chart.refresh();
}

getMonths(){
    if(this.datedFilter && this.datefFilter){
      var date1 = new Date(this.datedFilter);
      var date2 = new Date(this.datefFilter);
      var Difference_In_Time = date2.getTime() - date1.getTime();
      var Difference = Difference_In_Time / (1000 * 3600 * 24*30);
      return Math.round(Difference)
    }else{
      var date2 = new Date(this.todayDate());
      var date1 = new Date(this.sixMonths());
      var Difference_In_Time = date2.getTime() - date1.getTime();
      var Difference = Difference_In_Time / (1000 * 3600 * 24*30);
      return Math.round(Difference)
    }
    
}

code ="170F"
dataArticle: any = []

getArticle(){
    let postData = new FormData();
    postData.append('dateDebut',this.dateDebut);
    postData.append('dateFin', this.dateFin);
    postData.append('code',this.code);
     this.http.post<any>('http://stepup.ma/espace-equipement-api/api/cv?page=1', postData, this.httpOptions).map(res => res).subscribe(data => {
      // console.log("data pour l'article : ",data);
     this.dataArticle = data[0].commande_d
    //  console.log(data.data[0].commande_d.length)

    //  for(var i=0;i<data.data[0].commande_d.length;i++){
    //   var sums = parseFloat(this.dataArticle[i].Sumventes)
    //   var moy = parseFloat(this.dataArticle[i].MoyenneVente)
    //   var res = Math.abs(sums-moy)/moy
    //   // console.log('Sums : ',sums)
    //   // console.log('moy : ',moy)
    //   // console.log('res : ',res)
    //   this.chartData2[i].cv=Math.round(res)
    //   // console.log(res)
    //  }
    //  console.log(this.chartData2)

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


