import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ChartComponent} from '@syncfusion/ej2-angular-charts';

import { PageEventArgs, PageService } from '@syncfusion/ej2-angular-grids'


@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit {
 constructor(private http: HttpClient) { }

  httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + window.localStorage.getItem('ESP_access_token')
      })
  }
   public initialPage: Object;

     @ViewChild('chartm')
    public chartm: ChartComponent;
    public title: string = 'Niveaux de Stock';
    @ViewChild('gridarticled')
    public gridarticled: GridComponent; 

  public chartData: any;
  public marker: Object = {visible: true,height: 10,width: 10};
  public tooltip: Object = {enable: true};

  toolbar: string[]
  ngOnInit(): void {
    this.toolbar = ['Search'];
    if (!window.localStorage.getItem('logged')) {
      window.location.href = "#/login";
    } 

     this.initialPage = { pageSizes: true, pageCount: 4 };
    this.getTaux()
    this.getdata(1)

    this.chartData = []
    this.primaryXAxis = {valueType: 'Category'};
    this.chartDatalol = []
      this.chartData = []
     
    this.initChart()
  }

  initChart(){
    this.chartm.series[0].dataSource = []
    this.chartm.series[1].dataSource = []
    this.chartm.refresh();
  }
    @ViewChild('grid')
    public grid: GridComponent;

    params: any
    data: any
     //Pagination Variables here
   totalItems= 0
   lastPage= 0
   currentPage = 1
   pagecount = 4
   pagesize = 1
     dateDebut = this.debut()
  dateFin = this.fin()
 public primaryXAxis: any;
  

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

  //Modal Variables
   @ViewChild('articlesBiais')
  public articlesBiais: DialogComponent;
  public header: string = 'Coefficient de variation';
  public showCloseIcon: Boolean = true;
  public width: string = '85%';
  public height: string = '75%';
  public target: string = '.control-section';
  articlesData: any
  familleName: any 

  @ViewChild('articlesBiaisgraph')
  public articlesBiaisgraph: DialogComponent;
  public headerg: string = '';
  
  public showFamilleArticles = (famille): void => {
      this.familleName = famille
      this.getarticlesdata(1)
      this.articlesBiais.show();
      this.header = "Famille : "+famille
  }

 public showgraphArticle = (code): void => {
      this.articleCodeID = code
      this.headerg = 'Article Code : '+code
      this.getdatagraph(code)
      this.articlesBiaisgraph.show();
      this.getdataArticleDetails()
      
  }


  filter(){
    this.getdata(1)
  }

  dataGraph: any
  periode = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novenmbre','Décembre']

  mody: any = []
  getdatagraph(code){
      this.chartData = []
      this.chartm.refresh();
      let postData = new FormData();
      postData.append('dateDebut', this.dateDebut);
      postData.append('dateFin',this.dateFin);
      postData.append('code',code);

      this.http.post<any>('http://localhost:8000/api/stocks?page=1', postData, this.httpOptions).map(res => res).subscribe(data => {
     
       var finalData=[]
        var o = ''
        for(var i=0;i<data.length;i++){
          var d = data[i].Mois+'-'+data[i].Year
          if(d != o){
            finalData.push(data[i])
            o =  data[i].Mois+'-'+data[i].Year
          }
          
        }
        // console.log('stock data',finalData)       
       var mrange = this.getMonthrange(finalData)
       this.mody = mrange
       for(var i=0;i<mrange.length;i++){
        this.chartData.push({month:mrange[i],stock:this.dataGraph[i]})
       }
        

       
      }, err => {
        console.log(JSON.stringify(err));
      });
    }

    dataLoading = true
    getdata(id){
      this.dataLoading = true
      let postData = new FormData();
      postData.append('dateDebut', this.dateDebut);
      postData.append('dateFin',this.dateFin);
       this.http.post<any>('http://localhost:8000/api/biaisFamille?page='+id, postData, this.httpOptions).map(res => res).subscribe(data => {
        this.dataLoading = false
       this.data = data.data
       
      }, err => {
        console.log(JSON.stringify(err));
        this.dataLoading = false
      });
    }

   getTaux(){
       this.http.get<any>('http://localhost:8000/api/params', this.httpOptions).map(res => res).subscribe(data => {
       this.params = data.taux
       
      }, err => {
        console.log(JSON.stringify(err));
      });
    }

   taux(id){
    return this.params[id-1].taux
   } 

   tauxa(classe){
    if(classe == 'A'){
      return '98'
    }else if(classe == 'B'){
      return '95'
    }else{
      return '80'
    }
   } 
   facteur(id){
    return this.params[id-1].facteur_z
   } 

   dataGlobal: any
   dataLoadingArticle = false
  getarticlesdata(id){
    this.dataLoadingArticle = true
    this.dataGlobal = []
      let postData = new FormData();
      postData.append('dateDebut', this.dateDebut);
      postData.append('dateFin',this.dateFin);
      postData.append('famille',this.familleName);
       this.http.post<any>('http://localhost:8000/api/biais?page='+id, postData, this.httpOptions).map(res => res).subscribe(data => {
        this.dataLoadingArticle = false
       this.articlesData = data.data
       for(var i=0;i<data.data.length;i++){
        var x = {
          id:data.data[i].id,
          code:data.data[i].code,
          designation:data.data[i].designation,
          classe:data.data[i].classe,
          taux:Number(this.tauxa(data.data[i].classe)),
          mad:Number(this.mad2(data.data[i].commande_d,data.data[i].previsions)),
          stock:Number(this.stockSecuritya(data.data[i].commande_d,data.data[i].previsions,data.data[i].classe))
        }
        this.dataGlobal.push(x)
        
       }
       console.log(this.dataGlobal)
       this.gridarticled.refresh()
       
      }, err => {
        this.dataLoadingArticle = false
        console.log(JSON.stringify(err));
      });
    }

 

  mad(commande_g,previsions){
    var demandes = []
    var periode = this.getMonths()
    periode = Math.round(periode)
    var mois = 0
    var EcartTotal = 0
    var ecarts = 0
    for(var i=0;i<previsions.length;i++){
      demandes.push(0)
    }

    if(commande_g.length>0){
      for(var i =0;i<commande_g.length;i++){
        var ind = commande_g[i].Mois -1
        demandes[ind] = commande_g[i].Sumventes
      }
      for(var i =0;i<previsions.length;i++){
        mois = i+1
        ecarts = ecarts + Math.abs(parseFloat(demandes[i])-parseFloat(previsions[i].Sumprevision))
        
      }
      return (ecarts/previsions.length).toFixed(2);  


    }else{
      return NaN
    }
    
}

mad2(commande_g,previsions){
  var demandes = []
  var periode = this.getMonths()
  periode = Math.round(periode)
  var mois = 0
  var EcartTotal = 0
  var ecarts = 0
  for(var i=0;i<previsions.length;i++){
    demandes.push(0)
  }

  if(commande_g.length>0){
    var checkMois = this.getrangeDateMad()
    
    for(var i = 0;i<6;i++){
      var demande = commande_g.filter(({ Mois, Year }) => Mois === checkMois[i+5])
      var previs = previsions.filter(({ mois, Year }) => mois === checkMois[i+5])
      if(demande.length>0 && previs.length>0){
        ecarts = ecarts + Math.abs(parseFloat(demande[0].Sumventes)-parseFloat(previs[0].Sumprevision))
      }else if(demande.length == 0 && previs.length>0){
        ecarts = ecarts+parseFloat(previs[0].Sumprevision)
      }else if(previs.length == 0 && demande.length>0){
        ecarts = ecarts + Math.abs(parseFloat(demande[0].Sumventes))
      }else if(demande.length == 0 && previs.length == 0){
        ecarts = ecarts + 0
      }
    }
    return (ecarts/6).toFixed(2);  
  }else{
    return NaN
  }
  
}


 dateDebutGraph(){
      var firstDate
      firstDate = this.dateDebut
      var d = new Date(firstDate)
      if(d.getMonth()<=4){
        return (d.getFullYear()-1) + "-" + (d.getMonth()+8) + "-" + 1
      }else{
        return d.getFullYear() + "-" + (d.getMonth() - 4) + "-" + 1
      }   
    }


articleDataDetail: any
    articleTS: any
    articleCodeID: any
    getdataArticleDetails(){
      let postData = new FormData();
      postData.append('dateDebut', this.dateDebutGraph());
      postData.append('dateFin',this.dateFin);
      postData.append('code',this.articleCodeID);
       this.http.post<any>('http://localhost:8000/api/mad?page=1', postData, this.httpOptions).map(res => res).subscribe(data => {
     
       this.articleDataDetail= data[0];
       this.CalculateDataArticle()
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
      return this.rangeDateMad
    }

    dataTableArticleDetails: any
    CalculateDataArticle(){
      var range = this.rangeDateMad;
      var demandes = this.articleDataDetail.commande_c
      var prevision = this.articleDataDetail.previsions_c
      var dmd = []
      this.getrangeDateMad() // pour 
      var dateslice = []
      dateslice = this.getrangeDateMad()
      var f = dateslice.slice(5)
      var data = []
      var periode = []
     if(prevision.length>=11){
      for(var i =0;i<prevision.length;i++){
        var demande = demandes.filter(({Mois,Year})=>Mois===prevision[i].mois && Year===prevision[i].Year)
        if(demande.length>0){
          dmd.push(parseFloat(demande[0].Sumventes))
        }else{
          dmd.push(0)
        }
      }

      var madFinal = []
      for(var i=0;i<6;i++){
        var madMois = 0
        var abs = 0
        for(var k=i;k<6+i;k++){
          abs = abs + Math.abs(dmd[k]-parseFloat(prevision[k].Sumprevision))
          // console.log('i et k et ABS :: ',i,k,abs)
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
          mad:madFinal[i].toFixed(2)

        })
      }

      this.dataTableArticleDetails = data
      this.CaculateDataSetArticleCharta()
     }
      

    }

    chartDatalol = []
    CaculateDataSetArticleChart(){
      this.chartDatalol = []
      for(var i = 0;i<6;i++){
        
         var facteur: any = this.facteur(this.articleDataDetail.tauxsecurite_id)
         var mad = this.dataTableArticleDetails[i].mad
          var res = mad*facteur

        this.chartDatalol.push({month:this.mody[i],stocksecurity:Math.round(res)})
        this.chartm.series[0].dataSource = this.chartData
        this.chartm.series[1].dataSource = this.chartDatalol
        this.chartm.refresh();

    }
    
    


}
    CaculateDataSetArticleCharta(){
      this.chartDatalol = []
      for(var i = 0;i<6;i++){
        var facteur: any
        if(this.articleDataDetail.classe == 'A'){
          facteur = this.facteur(8)
        }else if(this.articleDataDetail.classe == 'B'){
          facteur = this.facteur(5)
        }else{
          facteur = this.facteur(3)
        }
       
         var mad = this.dataTableArticleDetails[i].mad
        var res = mad*facteur

        this.chartDatalol.push({month:this.mody[i],stocksecurity:Math.round(res)})
        this.chartm.series[0].dataSource = this.chartData
        this.chartm.series[1].dataSource = this.chartDatalol
        this.chartm.refresh();

    }
    
    


}


stockSecurity(x,y,id){
  var mad: any = this.mad2(x,y)
  var facteur: any = this.facteur(id)
  var res = mad*facteur
  return res.toFixed(2)
}
  
stockSecuritya(x,y,classe){
  var mad: any = this.mad2(x,y)
  if(classe == 'A'){
    var facteur: any = this.facteur(8)
    var res = mad*facteur
    return res.toFixed(2)
  }else if(classe == 'B'){
    var facteur: any = this.facteur(5)
    var res = mad*facteur
    return res.toFixed(2)
  }else{
    var facteur: any = this.facteur(3)
    var res = mad*facteur
    return res.toFixed(2)
  }
  
}
  



monthRange: any

getMonthrange(data){
  this.monthRange = []
  this.dataGraph = []
  var months = this.getMonths()
  var firstDate = this.dateDebut
  var d = new Date(firstDate)
  var firstMonth = d.getMonth()

  for(var i=0;i<months;i++){
    var m = firstMonth+i
    if(m>11){
      m = m-12
      this.monthRange.push(this.periode[m])
      var s = data.filter(({Mois})=>Mois === m+1)
      if(s.length>0){
        this.dataGraph.push(s[0].quantite)
      }else{
        this.dataGraph.push(0)
      }
    }else if(m>23){
      m = m-24
      this.monthRange.push(this.periode[m])
      var s = data.filter(({Mois})=>Mois === m+1)
      if(s.length>0){
        this.dataGraph.push(s[0].quantite)
      }else{
        this.dataGraph.push(0)
      }
    }else{
      this.monthRange.push(this.periode[m])
      var s = data.filter(({Mois})=>Mois === m+1)
      if(s.length>0){
        this.dataGraph.push(s[0].quantite)
      }else{
        this.dataGraph.push(0)
      }
    }
  }

  return this.monthRange
}

  
    


  getMonths(){
      var date1 = new Date(this.dateDebut);
      var date2 = new Date(this.dateFin);
      var Difference_In_Time = date2.getTime() - date1.getTime();
      var Difference = Difference_In_Time / (1000 * 3600 * 24*30);
      return Math.round(Difference)
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



//Publication


saveData(data){
  let postData = new FormData();
  postData.append('data', JSON.stringify(data));
   this.http.post<any>('http://localhost:8000/api/stock/securite/new', postData, this.httpOptions).map(res => res).subscribe(data => {

  }, err => {
    console.log(JSON.stringify(err));
  });
}
articlePub: any
getdataforPublication(familleid){
  this.articlePub = []
  let postData = new FormData();
  postData.append('dateDebut', this.dateDebutGraph());
  postData.append('dateFin',this.dateFin);
  postData.append('famille',familleid);
   this.http.post<any>('http://localhost:8000/api/mad?page=1', postData, this.httpOptions).map(res => res).subscribe(data => {
 
   var ar = data.data;
   for(var i =0;i<ar.length;i++){
    this.articlePub.push(this.CalculateDatag(ar[i]))
   }
    // console.log('la liste final des publications est de :',this.articlePub)
     this.saveData(this.articlePub)
   
  }, err => {
    console.log(JSON.stringify(err));
  });
}

CalculateData(ar){
      var range = this.rangeDateMad;
      var demandes = ar.commande_c
      var prevision = ar.previsions_c
      var tsec = ar.tauxsecurite_id
      var lstc = demandes.length-1
      var artilcleid = ar.id
      var lastdate
      if(demandes[lstc].Mois>9){
        lastdate = demandes[lstc].Year+'-'+demandes[lstc].Mois+'-01'
      }else{
        lastdate = demandes[lstc].Year+'-0'+demandes[lstc].Mois+'-01'
      }
      
     
      var dmd = []
      this.getrangeDateMad()
      var dateslice = []
      dateslice = this.getrangeDateMad()
      // console.log('date slice : ',dateslice.slice(5))
      var f = dateslice.slice(5)
      var data = []
      var periode = []
     if(prevision.length>0){
       for (var i = 0; i < prevision.length; i++) {
         var demande = demandes.filter(({ Mois, Year }) => Mois === prevision[i].mois && Year === prevision[i].Year)
         if (demande.length > 0) {
           dmd.push(parseFloat(demande[0].Sumventes))
         } else {
           dmd.push(0)
         }
       }
     
       var madFinal = []
       for (var i = 0; i < 6; i++) {
         var madMois = 0
         var abs = 0
         for (var k = i; k < 6 + i; k++) {
           abs = abs + Math.abs(dmd[k] - parseFloat(prevision[k].Sumprevision))
         }
         madMois = abs / 6
         madFinal.push(madMois)
       }
       for (var i = 0; i < 6; i++) {
         var o = f[i] - 1
         periode.push(this.periode[o])
         var tracking = (dmd[5 + i] - parseFloat(prevision[5 + i].Sumprevision)) / madFinal[i]
         data.push({
           periode: this.periode[o],
           mad: madFinal[i].toFixed(2)

         })
       }

       var lst = data.length - 1
       var facteur: any = this.facteur(tsec)
       var mad = data[lst].mad
       var res = mad*facteur
       return {
          'article_id':artilcleid,
          'mois':lastdate,
          'stock_s':Math.round(res)
        }
        
     }else{
       return {
        'article_id':artilcleid,
        'mois':lastdate,
        'stock_s':0
       }
     }
      
    }

CalculateDatag(ar){
      var range = this.rangeDateMad;
      var demandes = ar.commande_c
      var prevision = ar.previsions_c
      var tsec = ar.tauxsecurite_id
      var artilcleid = ar.id
      var lastdate
      var dateListe = []
      var checkMois = this.getrangeDateMad()
      var dmd = []
      var dateslice = []
      dateslice = this.getrangeDateMad()
      var f = dateslice.slice(5)
      var data = []
      var previ = []
      var periode = []
     if(prevision.length>0){
       for (var i = 0; i < checkMois.length; i++) {
         var y
         if(checkMois[i]>12){
           if(checkMois[i]<10){
            var d = new Date()
            y = d.getFullYear()+'-0'+checkMois[i]+'-01'
           }else{
            var d = new Date()
            y = d.getFullYear()+'-'+checkMois[i]+'-01'
           }
            
         }else{
          var d = new Date()
          if(checkMois[i]<10){
            var d = new Date()
            y = (d.getFullYear()-1)+'-0'+checkMois[i]+'-01'
           }else{
            var d = new Date()
            y = (d.getFullYear()-1)+'-'+checkMois[i]+'-01'
           }
         }
         var demande = demandes.filter(({ Mois, Year }) => Mois === checkMois[i])
         var previs = prevision.filter(({ mois, Year }) => mois === checkMois[i])
         if (demande.length > 0) {
           dmd.push(parseFloat(demande[0].Sumventes))
          if(demande[0].Mois>9){
            lastdate = demande[0].Year+'-'+demande[0].Mois+'-01'
          }else{
            lastdate = demande[0].Year+'-0'+demande[0].Mois+'-01'
          }
          dateListe.push(lastdate)
         } else {
           dmd.push(0)
          dateListe.push(y)
         }

         if (previs.length > 0) {
          previ.push(parseFloat(previs[0].Sumprevision))
        } else {
          previ.push(0)
        }

       }

       
    
       var madFinal = []
       for (var i = 0; i < 6; i++) {
         var madMois = 0
         var abs = 0
         for (var k = i; k < 6 + i; k++) {
           abs = abs + Math.abs(dmd[k] - parseFloat(previ[k]))
         }
         madMois = abs / 6
         madFinal.push(madMois)
       }


       for (var i = 0; i < 6; i++) {
         var o = f[i] - 1
         periode.push(this.periode[o])
         var tracking = (dmd[5 + i] - parseFloat(previ[5 + i])) / madFinal[i]
         data.push({
           periode: this.periode[o],
           mad: madFinal[i].toFixed(2)

         })
       }


       var lst = data.length - 1
       var facteur: any = this.facteur(tsec)
       
       var returedData = []
       for(var i=0;i<data.length;i++){
        var mad = data[i].mad
        var res = mad*facteur
          var ff: any = {
            'article_id':artilcleid,
            'mois':dateListe[i+5],
            'stock_s':Math.round(res)
          }
          returedData.push(ff)
       }

       return returedData
        
     }else{
      var returedData = []
      for(var i=0;i<data.length;i++){
       var mad = data[i].mad
       var res = mad*facteur
         var ff: any = {
           'article_id':artilcleid,
           'mois':dateListe[i],
           'stock_s':0
         }
         returedData.push(ff)
      }

      return returedData
     }
      
    }






}
