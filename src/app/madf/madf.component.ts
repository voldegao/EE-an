import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ChartComponent} from '@syncfusion/ej2-angular-charts';

import { PageEventArgs, PageService } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-madf',
  templateUrl: './madf.component.html',
  styleUrls: ['./madf.component.scss']
})
export class MadfComponent implements OnInit {

  constructor(private http: HttpClient) { }

   httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + window.localStorage.getItem('ESP_access_token')
      })
  }
  
  @ViewChild('gridarticleo')
  public gridarticleo: GridComponent;
  toolbar: string[]


   public initialPage: Object;
    public data: any;
    public familleNameDetail: any;
    dataDetails: any
    detailFamilleTS: any
    public dataFamille: any;
    public pageSettings: PageSettingsModel;

    dateDebut = this.debutYear()
    dateFin = this.halfYear()
    periode = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novenmbre','Décembre']
    
    datePeriode = [{id:0},{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9},{id:10},{id:11}]
    datePeriodesrc = this.datePeriode.slice(this.getMonthNumber(this.dateDebut),this.getMonthNumber(this.dateFin)+1)
    
    getMonthNumber(x){
      var d = new Date(x)
      return d.getMonth()
    }
    getDate(d){
      return this.periode[d]
    }

    filter(){
      // console.log('p ',this.dateDebut,this.dateFin)
      // console.log('first month : ',this.getMonthNumber(this.dateDebut))
      // console.log('last month : ',this.getMonthNumber(this.dateFin))
      // console.log(this.dateDebut,this.dateFin)
      this.getdataFamille(1)
      this.datePeriodesrc = this.datePeriode.slice(this.getMonthNumber(this.dateDebut),this.getMonthNumber(this.dateFin)+1)
      this.getrangeDateMad()
     
    }

    @ViewChild('grid')
    public grid: GridComponent;


    debutYear(){
      var d  = new Date()
      return d.getFullYear() + "-01-01"
    }
    halfYear(){
      var d  = new Date()
      var x = d.toLocaleDateString()
      return d.getFullYear() + "-06-30"
    }
    finYear(){
      var d  = new Date()
      var x = d.toLocaleDateString()
      return d.getFullYear() + "-12-31"
    }

    fin(){
      var d = new Date(),
        month =d.getMonth(),
        day = '',
        year = d.getFullYear();
        if(d.getMonth() == 0){
          var lstday = new Date((year-1), 12, 0).getDate()
          return (year-1)+'-12'+'-'+lstday
        }else{
          var lstday = new Date(year,month, 0).getDate()
          if(month<10){
            return year+'-0'+month+'-'+lstday
          }else{
            return year+'-'+month+'-'+lstday
          }
          
        }
     }
    
     debut(){
        var d = new Date(),
        thedate,
        month =(d.getMonth() -5),
        day = '1',
        year = d.getFullYear();
      if (month < 1){
        month = 12-Math.abs(month);
        year = d.getFullYear()-1
        if(month<10){
          var monthstr = '-0'+month
          return year+monthstr+'-01'
        }else{
          var monthstr = '-'+month
          return year+monthstr+'-01'
        }
      }else{
        if(month<10){
          var monthstr = '-0'+month
          return year+monthstr+'-01'
        }else{
          var monthstr = '-'+month
          return year+monthstr+'-01'
        }
      } 
     }
    
    rangeDateMad = []
    getrangeDateMad(){
      var firstDate
      this.rangeDateMad = []
      if(this.dateDebutq){
        firstDate = this.dateDebutq
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

    dataTableDetails: any
    CalculateData(){
      var range = this.rangeDateMad;
      var demandes = this.dataDetails.commande_c
      var prevision = this.dataDetails.previsions_c
      var dmd = []
      this.getrangeDateMad() // pour 
      var dateslice = []
      dateslice = this.getrangeDateMad()
      // console.log('date slice : ',dateslice.slice(5))
      var f = dateslice.slice(5)
      var data = []
      var periode = []
     
      for(var i =0;i<prevision.length;i++){
        var demande = demandes.filter(({Mois,Year})=>Mois===prevision[i].mois && Year===prevision[i].Year)
        if(demande.length>0){
          dmd.push(parseFloat(demande[0].Sumventes))
        }else{
          dmd.push(0)
        }
      }
      // console.log('voici la liste des demandes : ',dmd)
      // console.log('voici la liste des previsions : ',prevision)

      var madFinal = []
      for(var i=0;i<6;i++){
        var madMois = 0
        var abs = 0
        for(var k=i;k<6+i;k++){
          abs = abs + Math.abs(dmd[k]-parseFloat(prevision[k].Sumprevision))
        }
        madMois = abs/6
        madFinal.push(madMois)
      }
      for(var i =0;i<6;i++){
        var o = f[i]-1
        periode.push(this.periode[o])
        var tracking = (dmd[5+i]- parseFloat(prevision[5+i].Sumprevision))/madFinal[i] 
        data.push({
          periode:this.periode[o],
          demande:dmd[5+i],
          prevision:prevision[5+i].Sumprevision,
          mad:madFinal[i].toFixed(2),
          tracking:tracking.toFixed(2)

        })
      }
      // console.log('et voici a liste des mois : ',periode)
      // console.log('data here : ',data)
      // console.log('voici la liste des MAD : ',madFinal)
      this.dataTableDetails = data
      this.CaculateDataSetChart()
    }
    CaculateDataSetChart(){
     
      for(var i = 0;i<6;i++){
        this.chartData2[i] = {month:this.dataTableDetails[i].periode,MAD:this.dataTableDetails[i].mad }
        this.chartDataa[i] = {month:this.dataTableDetails[i].periode,prev:this.dataTableDetails[i].prevision}
        this.chartDatab[i] = {month:this.dataTableDetails[i].periode,dmd:this.dataTableDetails[i].demande}
      }
      this.chart.series[0].dataSource = this.chartDataa
      this.chart.series[1].dataSource = this.chartDatab
      this.chart.series[2].dataSource = this.chartData2
      this.chart.refresh();
    }


    getrangeDateBiaisE(){
      var firstDate
      const rangeDateMad = []
      if(this.dateDebutq){
        firstDate = this.dateDebutq
        var d = new Date(firstDate)
        if(d.getMonth()<=4){
          var p = d.getMonth()
          for(var i=0;i<11;i++){
            var o = p+8+i
            if(o>12){
              o = o-12
              var date = {
                mois:o,
                year:d.getFullYear()
              }
              rangeDateMad.push(date)
            }else if(o>24){
              o = o-24
              var date = {
                mois:o,
                year:(d.getFullYear()+1)
              }
              rangeDateMad.push(date)
            }else{
              var date = {
                mois:o,
                year:(d.getFullYear()-1)
              }
              rangeDateMad.push(date)
            }
          }
       }else{
          var p = d.getMonth()
          for(var i=0;i<11;i++){
            var o = p+8+i
            if(o>12 && o<=24){
              o = o-12
              var date = {
                mois:o,
                year:d.getFullYear()
              }
              rangeDateMad.push(date)
            }else if(o>24){
              o = o-24
              var date = {
                mois:o,
                year:(d.getFullYear()+1)
              }
            }else{
              var date = {
                mois:o,
                year:(d.getFullYear()-1)
              }
              rangeDateMad.push(date)
            }
          }
        }   
      }
    
      
      // console.log('la liste des mois est : ',this.rangeDateMad)
      return rangeDateMad
    }
    dataTableArticleDetails: any
    CalculateDataArticle(){
      var range = this.rangeDateMad;
      var demandes = this.articleDataDetail.commande_c
      var prevision = this.articleDataDetail.previsions_c
      // console.log('la liste des commande et des previsions :: ',demandes,prevision)
      var dmd = []
      this.getrangeDateMad() // pour 
      // console.log('la liste des periodes est de :: ',this.getrangeDateMad())
      var dateslice = []
      dateslice = this.getrangeDateBiaisE()
      var f = dateslice.slice(5)
      var data = []
      var periode = []

      // console.log('le date slice :::',dateslice)
     
      for(var i =0;i<dateslice.length;i++){
        var demande = demandes.filter(({Mois,Year})=>Mois===dateslice[i].mois && Year===dateslice[i].year)
        if(demande.length>0){
          dmd.push(parseFloat(demande[0].Sumventes))
        }else{
          dmd.push(0)
        }
      }

      var madFinal = []
      if(prevision.length>0 && prevision.length == dmd.length){
        for(var i=0;i<6;i++){
          var madMois = 0
          var abs = 0
          for(var k=i;k<6+i;k++){
  
            abs = abs + Math.abs(dmd[k]-parseFloat(prevision[k].Sumprevision))
          }
          madMois = abs/6
          madFinal.push(madMois)
        }
        for(var i =0;i<6;i++){
          var o = f[i].mois-1
          periode.push(this.periode[o])
          var tracking = (dmd[5+i]- parseFloat(prevision[5+i].Sumprevision))/madFinal[i] 
          data.push({
            periode:this.periode[o],
            demande:dmd[5+i],
            prevision:prevision[5+i].Sumprevision,
            mad:madFinal[i].toFixed(2),
            tracking:tracking.toFixed(2)
  
          })
        }
        this.dataTableArticleDetails = data
        this.CaculateDataSetArticleChart()
       
      }else{
        this.dataTableArticleDetails = []
        this.chartm.series[0].dataSource = []
        this.chartm.series[1].dataSource = []
        this.chartm.series[2].dataSource = []
        this.chartm.refresh();
        return null
      }
      
      
      
      
    }
    CaculateDataSetArticleChart(){
     
      for(var i = 0;i<6;i++){
        this.chartDatai[i] = {month:this.dataTableArticleDetails[i].periode,MAD:this.dataTableArticleDetails[i].mad }
        this.chartDatau[i] = {month:this.dataTableArticleDetails[i].periode,prev:this.dataTableArticleDetails[i].prevision}
        this.chartDatay[i] = {month:this.dataTableArticleDetails[i].periode,dmd:this.dataTableArticleDetails[i].demande}
      }
      this.chartm.series[0].dataSource = this.chartDatau
      this.chartm.series[1].dataSource = this.chartDatay
      this.chartm.series[2].dataSource = this.chartDatai
      this.chartm.refresh();
    }
    
    dateDebutGraph(){
      var firstDate
      firstDate = this.debut()
      var d = new Date(firstDate)
      if(d.getMonth()<=4){
        // console.log('voici la liste range des date :',(d.getFullYear()-1) + "-" + (d.getMonth()+8) + "-" + 1)
        return (d.getFullYear()-1) + "-" + (d.getMonth()+8) + "-" + 1
      }else{
        console.log(d.getFullYear() + "-" + (d.getMonth() - 4) + "-" + 1)
        return d.getFullYear() + "-" + (d.getMonth() - 4) + "-" + 1
      }   
    }

    periodeRange = []
    getperiodeR(){
      this.periodeRange = []
      var firstDate
      var first

      firstDate = this.dateDebut
      var d = new Date(firstDate)
      first = d.getMonth()+1

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
      if(this.rangeDateMad){
        for(var i=0;i<this.rangeDateMad.length;i++){
          var cmd = commandes.filter(({Mois})=>Mois === this.rangeDateMad[i])
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
      if(this.dataDetails){
        var commandes = this.dataDetails.commande_g
        var previsions = this.dataDetails.previsions
        // console.log('this is commande d : ',commandes)
        // console.log('the previsions is here : ',previsions)
        var cmds = this.setCmd(commandes)
        var moisListe = this.getperiodeR()
        // console.log(moisListe)
        // console.log(this.chartData2)
        var f = []
        for(var i=0;i<moisListe.length;i++){
          
          var ecarts = 0
          for(var k=i;k<6+i;k++){
            ecarts = ecarts + Math.abs(parseFloat(cmds[k])-parseFloat(previsions[k].Sumprevision))
          }
          var mad = ecarts/6
          // var indice = moisListe[i]-1
          // this.chartData3[indice].cv = cv.toFixed(2)
          f.push(mad)
  
        }
        
        // console.log('ths is the mad array : ',f) 
       

        this.refreshdata()
    }else{
      this.chartData2 = [
        { month: 'Jan', cv: 0 }, { month: 'Fev', cv: 0 },
        { month: 'Mar', cv: 0 }, { month: 'Avr', cv: 0 },
        { month: 'Mai', cv: 0 }, { month: 'Jui', cv: 0 },
        { month: 'Jul', cv: 0 }, { month: 'Aout', cv: 0 },
        { month: 'Sep', cv: 0 }, { month: 'Oct', cv: 0 },
        { month: 'Nov', cv: 0 }, { month: 'Dec', cv: 0 }
    ]
    }
    }












    getdata(){
      let postData = new FormData();
      postData.append('dateDebut', this.debut());
      postData.append('dateFin',this.fin());
       this.http.post<any>('http://localhost:8000/api/mad?page='+this.currentpage, postData, this.httpOptions).map(res => res).subscribe(data => {
        // console.log(data);
       this.data = data.data
       
      }, err => {
        console.log(JSON.stringify(err));
      });
    }

    dataLoading = true
    dataLoadingArticle = false
    getdataFamille(id){
      this.dataLoading = true
      let postData = new FormData();
      postData.append('dateDebut', this.debut());
      postData.append('dateFin',this.fin());
       this.http.post<any>('http://localhost:8000/api/madFamille?page='+id, postData, this.httpOptions).map(res => res).subscribe(data => {
        // console.log(data);
       this.dataFamille = data;
       this.dataLoading = false
       
      }, err => {
        console.log(JSON.stringify(err));
        this.dataLoading = false
      });
    }

    getdataFamilleDetails(id){
      
      let postData = new FormData();
      postData.append('dateDebut',this.dateDebutGraph());
      postData.append('dateFin',this.fin());
      postData.append('famille',this.familleNameDetail);
       this.http.post<any>('http://localhost:8000/api/madFamille?page='+id, postData, this.httpOptions).map(res => res).subscribe(data => {
        // console.log(data);
       this.dataDetails= data[0];
       this.detailFamilleTS = this.tracksignal(this.dataDetails.commande_g,this.dataDetails.previsions)
      //  this.getdataForChart()
      //  this.setChartData(data.data[0]) //lite of mad
      this.CalculateData()
      
       
      }, err => {
        console.log(JSON.stringify(err));
      });
    }

    articleDataDetail: any
    articleTS: any
    getdataArticleDetails(id){
      let postData = new FormData();
      postData.append('dateDebut', this.dateDebutGraph());
      postData.append('dateFin',this.fin());
      postData.append('code',this.articleCode);
       this.http.post<any>('http://localhost:8000/api/mad?page='+id, postData, this.httpOptions).map(res => res).subscribe(data => {
       
       this.articleDataDetail= data[0];
      //  this.articleTS = this.tracksignal(this.articleDataDetail.commande_d,this.articleDataDetail.previsions)
      //  this.getdataForCharta()
       this.CalculateDataArticle()
      }, err => {
        console.log(JSON.stringify(err));
      });
    }
 
  currentpage = 1
  pagecount = 1
  pagesize = 10

 @ViewChild('articlesMAD')
  public articlesMAD: DialogComponent;
  public headera: string = 'Famille : ';
  public showCloseIcona: Boolean = true;
  public widtha: string = '85%';
  public heighta: string = '75%';
  public targeta: string = '.control-section';
  articlesData: any
  familleName: any

  @ViewChild('Dialogarticle')
  public Dialogarticle: DialogComponent;
  public headers: string = 'Famille : ';
  public showCloseIcons: Boolean = true;
  public widths: string = '85%';
  public heights: string = '75%';
  public targets: string = '.control-section';
  
   public showFamilleArticles = (famille): void => {
      this.familleName = famille
      this.getarticlesdata(1)
      this.articlesMAD.show();
      this.headera = "Famille : "+famille
  }
  articleCode: any
  onOpenDialogarticle(id){
    this.Dialogarticle.show()
    this.headers = "Article : "+id
    this.articleCode = id
    this.getdataArticleDetails(1)
  }

  // filter(){
  //   console.log(this.dateDebut,this.dateFin)
  //   this.getdataFamille(1)
  // }


  dateDebutq: any = this.debut()
  dateFinq: any = this.fin()
  dataGlobal: any
getarticlesdata(id){
      let postData = new FormData();
      postData.append('dateDebut', this.debut());
      postData.append('dateFin',this.fin());
      postData.append('famille',this.familleName);
      this.dataGlobal = []
      this.dataLoadingArticle = true
       this.http.post<any>('http://localhost:8000/api/mad?page='+id, postData, this.httpOptions).map(res => res).subscribe(data => {
        this.dataLoadingArticle = false
       this.articlesData = data
      console.log('data,',data)
       for(var i=0;i<data.length;i++){
         var prevision
         var demande
         if(data[i].previsions_g.length>0){
           prevision = data[i].previsions_g[0].Sumprevision
         }
         if(data[i].commande_g[0].Sumventes){
           demande = data[i].commande_g[0].Sumventes
         }else{
           demande = 0
         }
        var x = {
          id:data[i].id,
          code:data[i].code,
          designation:data[i].designation,
          prevision:Number(prevision),
          demande:Number(demande),
          ecart:Number(demande-prevision),
          mad:Number(this.mad2(data[i].commande_c,data[i].previsions_c)),
          tracking:Number(this.tracksignal(data[i].commande_c,data[i].previsions_c))
        }
        this.dataGlobal.push(x)
        
       }
       console.log(this.dataGlobal)
       this.gridarticleo.refresh();
      //  console.log(this.articlesData)
       
      }, err => {
        console.log(JSON.stringify(err));
        this.dataLoadingArticle = false
      });
    }


  ngOnInit(): void {

    this.toolbar = ['Search'];
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
    this.chartDataa = []
    this.chartDatab = []
    this.chartDatac = [
      { month: 'Jan', MAD: 0 }, { month: 'Fev', MAD: 0 },
      { month: 'Mar', MAD: 0 }, { month: 'Avr', MAD: 0 },
      { month: 'Mai', MAD: 0 }, { month: 'Jui', MAD: 0 },
      { month: 'Jul', MAD: 0 }, { month: 'Aout', MAD: 0 },
      { month: 'Sep', MAD: 0 }, { month: 'Oct', MAD: 0 },
      { month: 'Nov', MAD: 0 }, { month: 'Dec', MAD: 0 }
    ]
    this.chartDatai = [];   
    this.chartDatau = []
    this.chartDatay = []
  this.primaryXAxis = {valueType: 'Category'};

    this.pageSettings = { pageCount:3,pageSize: 6,currentPage:this.currentpage };
    // this.pageSettings = { pageCount: this.pagecount,pageSize: this.pagesize,currentPage: this.currentpage };
    //this.getdata()
    this.getdataFamille(1)

  }

  // Chart Variables
  public primaryXAxis: any;
  public chartData: any;
  public chartData2: any;
  public chartDataa: any;
  public chartDatab: any;
  public chartDatac: any;
  public chartDatai: any;
  public chartDatau: any;
  public chartDatay: any;
  public marker: Object = {visible: true,height: 10,width: 10};
  public tooltip: Object = {enable: true};
  selectedCode: any

  @ViewChild('chart')
    public chart: ChartComponent;
    public title: string = 'Sales Comparision';
    public refreshdata(): void {
      this.chart.series[0].dataSource = this.chartDataa.slice(this.getMonthNumber(this.dateDebut),this.getMonthNumber(this.dateFin)+1);
      this.chart.series[1].dataSource = this.chartDatab.slice(this.getMonthNumber(this.dateDebut),this.getMonthNumber(this.dateFin)+1);
      this.chart.series[2].dataSource = this.chartData2.slice(this.getMonthNumber(this.dateDebut),this.getMonthNumber(this.dateFin)+1);
      this.chart.refresh();
    }

    @ViewChild('chartm')
    public chartm: ChartComponent;
    public titlea: string = 'Sales Comparision';
  
    @ViewChild('chartb')
    public chartb: ChartComponent;
    public titleb: string = 'Sales Comparision';
   

  //Modal Variables
  @ViewChild('Dialog')
  public Dialog: DialogComponent;
   public header: string = '';
  public showCloseIcon: Boolean = true;
  public width: string = '85%';
  public height: string = '85%';
  public target: string = '.control-section';
  public BtnClick = (): void => {
      this.Dialog.show();
  }

  public onOpenDialog = function(famille): void {
    // Call the show method to open the Dialog
    this.familleNameDetail = famille
    // console.log('this is the famille',famille)
    this.getdataFamilleDetails(1)
    this.header = 'Famille : '+famille
    this.Dialog.show();

      };

        //Modal Variables
  @ViewChild('Dialogb')
  public Dialogb: DialogComponent;
   public headerb: string = '';
  public showCloseIconb: Boolean = true;
  public widthb: string = '85%';
  public heightb: string = '85%';
  public targetb: string = '.control-section';
  public BtnClicka = (): void => {
      this.Dialogb.show();
  }

  public onOpenDialogb = function(): void {
    this.Dialogb.show();
  };




  
// biais(commande_g,previsions){
//       var demandes = []
//       var periode = this.getMonths()
//       periode = Math.round(periode)
//       var mois = 0
//       var EcartTotal = 0
//       var ecarts = 0
//       if(commande_g.length>0){
//         for(var i =0;i<periode;i++){
//           mois = i+1
//           if(commande_g[i] && commande_g[i].Mois == previsions[i].mois){
//             demandes.push(commande_g[i].Sumventes)

//           }else if(commande_g[i] && commande_g[i].Mois == previsions[i+1].mois){
//               demandes.push(0)
//               demandes.push(commande_g[i].Sumventes)
//           }else{
//             //demandes.push(0)
//           }
//         }
//         console.log('uoo : ',demandes)
//         for(var i =0;i<periode;i++){
//           mois = i+1
//           ecarts = ecarts + Math.abs(parseFloat(demandes[i])-parseFloat(previsions[i].Sumprevision))
          
//         }
//         return (ecarts/periode).toFixed(2);  


//       }else{
//         console.log('yoyoyo')
//         return NaN
//       }
      
//   }


mad(commande_c,previsions){
      var demandes = []
      var periode = this.getMonths()
      periode = Math.round(periode)
      var mois = 0
      var EcartTotal = 0
      var ecarts = 0
     

      var dmd = []
      for(var i =0;i<previsions.length;i++){
        var demande = commande_c.filter(({Mois,Year})=>Mois===previsions[i].mois && Year===previsions[i].Year)
        if(demande.length>0){
          dmd.push(parseFloat(demande[0].Sumventes))
        }else{
          dmd.push(0)
        }
      }
      // console.log('la liste des demandes est de :',dmd)
      if(commande_c.length>0){
        for(var i =0;i<dmd.length;i++){
          ecarts = ecarts + Math.abs(parseFloat(dmd[i])-parseFloat(previsions[i].Sumprevision))
        }
        var res =(ecarts/previsions.length).toFixed(2) 
        // console.log('le MAD generale du produit est de  : ',res)
        return res;  

      }else{
        return NaN
      }
      
  }

  mad2(commande_c,previsions){
    var demandes = []
    var periode = this.getMonths()
    // console.log("commande_c :: ",commande_c)
    // console.log("previsions :: ",previsions)
    periode = Math.round(periode)
    var mois = 0
    var EcartTotal = 0
    var ecarts = 0
    // for(var i=0;i<previsions.length;i++){
    //   demandes.push(0)
    // }
  
    if(commande_c.length>0){
      var checkMois = this.getrangeDateMad()
      
      for(var i = 0;i<6;i++){
        var demande = commande_c.filter(({ Mois, Year }) => Mois === checkMois[i+5])
        var previs = previsions.filter(({ mois, Year }) => mois === checkMois[i+5])
        if(demande.length>0 && previs.length>0){
          ecarts = ecarts + Math.abs(parseFloat(demande[0].Sumventes)-parseFloat(previs[0].Sumprevision))
          // console.log('ecarts pour ',i,ecarts)
        }else if(demande.length == 0 && previs.length>0){
          ecarts = ecarts+parseFloat(previs[0].Sumprevision)
          // console.log('ecarts pour ',i,ecarts)
        }else if(previs.length == 0 && demande.length>0){
          ecarts = ecarts + Math.abs(parseFloat(demande[0].Sumventes))
          // console.log('ecarts pour ',i,ecarts)
        }else if(demande.length == 0 && previs.length == 0){
          ecarts = ecarts + 0
          // console.log('ecarts pour ',i,ecarts)
        }
      }
      // console.log('finall data of stock security ',(ecarts/6).toFixed(2))
      return (ecarts/6).toFixed(2);  
    }else{
      return NaN
    }
    
  }
  tracksignal(demandes, previsions){
      var tracks = 0
      var mois = 0
      var dema = []
      var periode = Math.round(this.getMonths())
      var mad: any = this.mad2(demandes,previsions)
      var dmd = []
      for(var i =0;i<previsions.length;i++){
        var demande = demandes.filter(({Mois,Year})=>Mois===previsions[i].mois && Year===previsions[i].Year)
        if(demande.length>0){
          dmd.push(parseFloat(demande[0].Sumventes))
        }else{
          dmd.push(0)
        }
      }
      if(previsions.length>0){
       var lastDemane = dmd[dmd.length-1]
       var lastPrev = previsions[previsions.length-1]
       var res = (lastDemane-parseFloat(lastPrev.Sumprevision))/mad
        return res.toFixed(2)
      }else{
        return NaN;
      }
  }
  

  // mad par famille

  getMadFamille(demandes,previsions){

    var ecarts = 0
    var periode = Math.round(this.getMonths())
    if(demandes.length>0){
    
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
  }

  tracksignalFamille(demandes, previsions){
    var tracks = 0
    var periode = Math.round(this.getMonths())
    var mad: any = this.getMad(demandes,previsions)
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

// periode = [0, 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', "Novembre", "Décembre"];

  // datePeriode = [{id:1},{id:2},{id:3},{id:4},{id:5},{id:6}];
  
  // getDate(d){
  //   return this.periode[d];
  // }


  // mad par article
  getMad(demandes,previsions){
      var ecarts = 0
      var periode = Math.round(this.getMonths())
      if(periode>=1){
        if(this.dataFamille.length>0){
          if(previsions.length>0){
            for(var i=0;i<demandes.length;i++){
              ecarts = ecarts + Math.abs(parseFloat(demandes[i].Sumventes)-parseFloat(previsions[i].Sumprevision))
            }   
            return (ecarts/periode).toFixed(2);  
          }else{
            ecarts = -1
            return NaN;
          }
        }
        
        
      }else{
        return NaN;
      }
  }

  getPrevisions(d){
    if(this.dataDetails){
      if(this.dataDetails.previsions.length>0){
        var previsions = this.dataDetails.previsions
        const result = previsions.find( ({ mois }) => mois === d+1 );
        if(result){
          var resu = parseFloat(result.Sumprevision)
          return resu.toFixed(0)
        }else{
          return 0
        }
      }    
    }
    
  }
  getPrevisionsa(d){
    if(this.articleDataDetail){
      if(this.articleDataDetail.previsions.length>0){
        var previsions = this.articleDataDetail.previsions
        const result = previsions.find( ({ mois }) => mois === d+1 );
        if(result){
          var resu = parseFloat(result.Sumprevision)
          return resu.toFixed(0)
        }else{
          return 0
        }
      }    
    }
    
  }
  getDemandes(d){
    if(this.dataDetails){
      if(this.dataDetails.commande_g.length>0){
        var demandes = this.dataDetails.commande_g
        const result = demandes.find( ({ Mois }) => Mois === d+1 );
        if(result){
          var resu = parseFloat(result.Sumventes)
          return resu.toFixed(0)
        }else{
          return 0
        }
      }else{
        return 0
      }
    }
  }

  getDemandesa(d){
    if(this.articleDataDetail){
      if(this.articleDataDetail.commande_d.length>0){
        var demandes = this.articleDataDetail.commande_d
        const result = demandes.find( ({ Mois }) => Mois === d+1 );
        if(result){
          var resu = parseFloat(result.Sumventes)
          return resu.toFixed(0)
        }else{
          return 0
        }
      }else{
        return 0
      }
    }
  }

  getTracking(id){
    var x: any = this.getPeriodeMad(id)/this.detailFamilleTS
    return x.toFixed(2)
  }

  getTrackinga(id){
    var x: any = this.getPeriodeMada(id)/this.articleTS
    return x.toFixed(2)
  }
   
  getPeriodeMad(id){
    if(this.dataDetails){
      if(this.dataDetails.commande_g.length>0){
        var x: any = this.getDemandes(id)
        var y: any = this.getPrevisions(id)
         return Math.abs(x-y)
      }
    }
  
  }
  getPeriodeMada(id){
    if(this.articleDataDetail){
      if(this.articleDataDetail.commande_d.length>0){
        var x: any = this.getDemandesa(id)
        var y: any = this.getPrevisionsa(id)
         return Math.abs(x-y)
      }
    }
  
  }
 

  getMonths(){
      var date1 = new Date(this.dateDebut);
      var date2 = new Date(this.dateFin);
      var Difference_In_Time = date2.getTime() - date1.getTime();
      var Difference = Difference_In_Time / (1000 * 3600 * 24*30);
      return  Math.round(Difference)
  }

  getdataForChart(){
    // console.log('data for chart init')
    if(this.dataDetails){
      var dmd = []
      var demandes = this.dataDetails.commande_g
      for(var j=0;j<this.getMonths();j++){
        if(demandes[j].Mois != j+1){
          dmd.push(0)
        }else{
          dmd.push(parseFloat(demandes[j].Sumventes))
        }
      }
      // console.log('this is the dmd array: ',dmd)
      if(this.dataDetails.previsions.length>0){
        var previsions = this.dataDetails.previsions
        
        for(var i=0;i<this.getMonths();i++){
          var index = previsions[i].mois - 1
          var prev = parseFloat(previsions[i].Sumprevision)
          var dmde = dmd[i]
          var res = Math.abs(dmde-prev)
          this.chartData2[index].MAD = res
          this.chartDataa[index].prev = prev
          this.chartDatab[index].dmd = dmde
        }
        this.refreshdata()

      }else{
        this.chartData = [
          { month: 'Jan', prevision: 0 }, { month: 'Feb', prevision: 0 },
          { month: 'Mar', prevision: 0 }, { month: 'Apr', prevision: 0 },
          { month: 'May', prevision: 0 }, { month: 'Jun', prevision: 0 },
          { month: 'Jul', prevision: 0 }, { month: 'Aug', prevision: 0 },
          { month: 'Sep', prevision: 0 }, { month: 'Oct', prevision: 0 },
          { month: 'Nov', prevision: 0 }, { month: 'Dec', prevision: 0 }
        ];
         this.chartData2 = [
          { month: 'Jan', MAD: 0 }, { month: 'Fev', MAD: 0 },
          { month: 'Mar', MAD: 0 }, { month: 'Avr', MAD: 0 },
          { month: 'Mai', MAD: 0 }, { month: 'Jui', MAD: 0 },
          { month: 'Jul', MAD: 0 }, { month: 'Aout', MAD: 0 },
          { month: 'Sep', MAD: 0 }, { month: 'Oct', MAD: 0 },
          { month: 'Nov', MAD: 0 }, { month: 'Dec', MAD: 0 }
        ];   
        
        this.chartDataa = [
          { month: 'Jan', prev: 0 }, { month: 'Fev', prev: 0 },
          { month: 'Mar', prev: 0 }, { month: 'Avr', prev: 0 },
          { month: 'Mai', prev: 0 }, { month: 'Jui', prev: 0 },
          { month: 'Jul', prev: 0 }, { month: 'Aout', prev: 0 },
          { month: 'Sep', prev: 0 }, { month: 'Oct', prev: 0 },
          { month: 'Nov', prev: 0 }, { month: 'Dec', prev: 0 }
        ]
        this.chartDatab = [
          { month: 'Jan', dmd: 0 }, { month: 'Fev', dmd: 0 },
          { month: 'Mar', dmd: 0 }, { month: 'Avr', dmd: 0 },
          { month: 'Mai', dmd: 0 }, { month: 'Jui', dmd: 0 },
          { month: 'Jul', dmd: 0 }, { month: 'Aout', dmd: 0 },
          { month: 'Sep', dmd: 0 }, { month: 'Oct', dmd: 0 },
          { month: 'Nov', dmd: 0 }, { month: 'Dec', dmd: 0 }
        ]
      }
    }
  }

  getdataForCharta(){
    // console.log('data for chart init')
    // console.log(this.articleDataDetail.commande_d)
    if(this.articleDataDetail){
      var dmd = []
      var demandes = this.articleDataDetail.commande_d
      for(var j=0;j<this.getMonths();j++){
        var f = demandes.filter(({Mois})=>Mois === j+1)
        // console.log(f)
        if(f.length>0){
          dmd.push(parseFloat(f[0].Sumventes))
          // console.log('this is umvente : ',f[0].Sumventes)
        }else{
          dmd.push(0)
        }
      }
      // console.log('this is the dmd array: ',dmd)
      if(this.articleDataDetail.previsions.length>0){
        var previsions = this.articleDataDetail.previsions
        
        for(var i=0;i<this.getMonths();i++){
          var index = previsions[i].mois - 1
          var prev = parseFloat(previsions[i].Sumprevision)
          var dmde = dmd[i]
          var res = Math.abs(dmde-prev)
          this.chartDatai[index].MAD = res
          this.chartDatau[index].prev = prev
          this.chartDatay[index].dmd = dmde
        }
        this.refreshdataa()

      }else{
        
         this.chartDatai = [
          { month: 'Jan', MAD: 0 }, { month: 'Fev', MAD: 0 },
          { month: 'Mar', MAD: 0 }, { month: 'Avr', MAD: 0 },
          { month: 'Mai', MAD: 0 }, { month: 'Jui', MAD: 0 },
          { month: 'Jul', MAD: 0 }, { month: 'Aout', MAD: 0 },
          { month: 'Sep', MAD: 0 }, { month: 'Oct', MAD: 0 },
          { month: 'Nov', MAD: 0 }, { month: 'Dec', MAD: 0 }
        ];   
        
        this.chartDatau = [
          { month: 'Jan', prev: 0 }, { month: 'Fev', prev: 0 },
          { month: 'Mar', prev: 0 }, { month: 'Avr', prev: 0 },
          { month: 'Mai', prev: 0 }, { month: 'Jui', prev: 0 },
          { month: 'Jul', prev: 0 }, { month: 'Aout', prev: 0 },
          { month: 'Sep', prev: 0 }, { month: 'Oct', prev: 0 },
          { month: 'Nov', prev: 0 }, { month: 'Dec', prev: 0 }
        ]
        this.chartDatay = [
          { month: 'Jan', dmd: 0 }, { month: 'Fev', dmd: 0 },
          { month: 'Mar', dmd: 0 }, { month: 'Avr', dmd: 0 },
          { month: 'Mai', dmd: 0 }, { month: 'Jui', dmd: 0 },
          { month: 'Jul', dmd: 0 }, { month: 'Aout', dmd: 0 },
          { month: 'Sep', dmd: 0 }, { month: 'Oct', dmd: 0 },
          { month: 'Nov', dmd: 0 }, { month: 'Dec', dmd: 0 }
        ]
      }
    }
  }


  public refreshdataa(): void {
    this.chartm.series[0].dataSource = this.chartDatau.slice(this.getMonthNumber(this.dateDebut),this.getMonthNumber(this.dateFin)+1);
    this.chartm.series[1].dataSource = this.chartDatay.slice(this.getMonthNumber(this.dateDebut),this.getMonthNumber(this.dateFin)+1);
    this.chartm.series[2].dataSource = this.chartDatai.slice(this.getMonthNumber(this.dateDebut),this.getMonthNumber(this.dateFin)+1);
    this.chartm.refresh();
  }


}
