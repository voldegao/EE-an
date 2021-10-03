import { Component, OnInit, ViewChild } from '@angular/core';
import { IDataOptions, IDataSet, PivotView } from '@syncfusion/ej2-angular-pivotview';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ChartComponent} from '@syncfusion/ej2-angular-charts';
import { from } from 'rxjs';

@Component({
  selector: 'app-snopdetails',
  templateUrl: './snopdetails.component.html',
  styleUrls: ['./snopdetails.component.scss']
})



export class SnopdetailsComponent implements OnInit {

  public pivotData: IDataSet[];
  public dataSourceSettings: IDataOptions;

  
  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + window.localStorage.getItem('ESP_access_token')
    })
  }
  @ViewChild('pivotview')
  public pivotview: PivotView;

  constructor(private http: HttpClient) { }
  
  // Chart Variables
  public primaryXAxis: any;
  public marker: Object = { visible: true, height: 10, width: 10 };
  public tooltip: Object = { enable: true };

  @ViewChild('Dialog')
  public Dialog: DialogComponent;
  public header: string = 'S&OP Graphe';
  public showCloseIcon: Boolean = true;
  public width: string = '1200';
  public height: string = '70%';
  public target: string = '.control-section';
  public openGraph = (): void => {
   
    this.Dialog.show();
  };

  
  @ViewChild('Dialogv')
  public Dialogv: DialogComponent;
  public headerv: string = 'S&OP : Edition Prévision';
  public showCloseIconv: Boolean = true;
  public widthv: string = '1300';
  public heightv: string = '75%';
  public targetv: string = '.control-section';
  public openPrevision = (): void => {
   this.getArticlesData(this.currentPage)
    this.Dialogv.show();
  };


  
  @ViewChild('chart')
  public chart: ChartComponent;
  public title: string = 'Sales Comparision';
  public refreshdata(): void {
    this.chart.series[0].dataSource = []
    this.chart.refresh();
  }

  chartData1: any
  chartData2: any
  chartData3: any
  getChartData(){
    this.chartData1 = []
    this.chartData2 = []
    this.chartData3 = []
    for(var i = 0;i<12;i++){
      this.chartData1[i] = {month:this.getDateRange().dateRange[i],prevision:this.previsionsData[i]}
      this.chartData2[i] = {month:this.getDateRange().dateRange[i],planification:this.orderplanData[i]}
      this.chartData3[i] = {month:this.getDateRange().dateRange[i],stock:this.stockDatacalcul[i]}
    }
   
    this.chart.series[0].dataSource = this.chartData1
    this.chart.series[1].dataSource = this.chartData2
    this.chart.series[2].dataSource = this.chartData3
    this.chart.refresh();
  }

  
  ngOnInit() {

    this.getFamilleListe()
    this.pivotData = [
      // { 'ID': 31, 'Amount': 52, 'Article': 'MOTEUR DIESEL 170F', 'TypeParams': 'Prévision', 'Year': '2019', 'Month': 'Mois 01', 'Semaine': 'Semaine 1' },
    ];

    this.primaryXAxis = {valueType: 'Category'};
    this.dataSourceSettings = {
      dataSource: this.pivotData,
      expandAll: false,
      // columns: [{name:'Year'},{ name: 'Month', caption: 'Production Year' }, { name: 'Semaine' }],
      columns: [{name:'Year'},{ name: 'Month', caption: 'Production Year' }, { name: 'Semaine' }],
      values: [{ name: 'Amount', caption: 'Sold Amount' }],
      rows: [{ name: 'Article' }, { name: 'TypeParams' }],
      showGrandTotals: false,
      showSubTotals: false
    };
    this.getFamilleData()

  }
  leftBar = true
  familleFilterContainer = false
  articleFilterContainer = false
  generationData: any = ''
  prevDateRange: any
  weekDateRange: any
  datePrevDebut: any = ''
  datePrevFin: any = ''
  dateStockDebut: any = ''
  dateStockFin: any = ''
  dateCmdDebut: any = ''
  dateCmdFin: any = ''
  articleCode: any = ''
  articleName: any = ''
  articleText: any = ''

    //Table Periode
    PeriodeRange: any

  showFamilleFilter(){
    this.leftBar = false;
    this.familleFilterContainer = true
  }
  showArticleFilter(){
    this.leftBar = false;
    this.articleFilterContainer = true
  }
  showLeftBar(){
    this.leftBar = true;
    this.familleFilterContainer = false
    this.articleFilterContainer = false
  }

  csvexport(){
    this.pivotview.csvExport();
    // console.log('loooool')
  }

  showArticleList(){
  }



  getDateRange(){
    var dateRange = []
    var daterangeStock = []
    var d = new Date()
    var month = d.getMonth()
    var year = d.getFullYear()

    var M3 = month-2
    var M4 = month-3
    var M5 = month-4
    var Dyear
    var Nyear
    var Syear
    if(M3<0){
      M3 = 13+M3
      Dyear = year -1 
    }else{
      M3 = month-2
      Dyear = year
    }

    if(M4<0){
      M4 = 13+M4
      Syear = year -1 
    }else{
      M4 = month-3
      Syear = year
    }

    if(M5<0){
      M5 = 13+M5
      Nyear = year -1 
    }else{
      M5 = month-4
      Nyear = year
    }

    var Mlast = M3-1
    var Fyear
    if(Mlast == 0){
      Mlast = 12
      Fyear = year
    }else{
      Mlast = M3-1
      Fyear = year +1
    }
    for(var i=0;i<12;i++){
      var m = M3+i
      if(m>12){
        m = m-12
        var y = Dyear+1
        if(m<10){
          
          var a = '0'+m+'-'+y
          dateRange.push(a)
        }else{
          var a = m+'-'+y
          dateRange.push(a)
        }
        
      }else{
        if(m<10){
          var a = '0'+m+'-'+Dyear
          dateRange.push(a)
        }else{
          var a = m+'-'+Dyear
          dateRange.push(a)
        }
      }
    }

    for(var i=0;i<12;i++){
      var m = M4+i
      if(m>12){
        m = m-12
        var y = Syear+1
        if(m<10){
          
          var a = '0'+m+'-'+y
          daterangeStock.push(a)
        }else{
          var a = m+'-'+y
          daterangeStock.push(a)
        }
        
      }else{
        if(m<10){
          var a = '0'+m+'-'+Syear
          daterangeStock.push(a)
        }else{
          var a = m+'-'+Syear
          daterangeStock.push(a)
        }
      }
    }

    return {
      dateDebut:Dyear+'-'+M3+'-01',
      dateDebutApro: Nyear+'-'+M5+'-01',
      dateDebutStock: Syear+'-'+M4+'-01',
      dateFin:Fyear+'-'+Mlast+'-31',
      dateRange:dateRange,
      stockdateRange:daterangeStock
    }
  }

  FamilleListe: any
  getFamilleListe(){
    this.http.get<any>('http://stepup.ma/espace-equipement-api/api/params', this.httpOptions).map(res => res).subscribe(data => {
      this.FamilleListe = data.familles
    }, err => {
      console.log(JSON.stringify(err));
    });
  }

  FamilleData: any
  familleID: any = '1'
  dataLoading = true
  getFamilleData(){
    this.dataLoading = true
    let postData = new FormData();
    postData.append('dateDebut', this.getDateRange().dateDebut);
    postData.append('dateDebutApro', this.getDateRange().dateDebutApro);
    postData.append('dateDebutStock', this.getDateRange().dateDebutStock);
    postData.append('dateFin', this.getDateRange().dateFin);
    postData.append('famille', this.familleID);
    this.http.post<any>('http://stepup.ma/espace-equipement-api/api/snop/details',postData,this.httpOptions).map((res) => res).subscribe((data) => {
          // console.log('data is here ',data)
          this.dataLoading = false
          this.FamilleData = data
          this.setPeriode(data[0].previsions)
          this.checkPrevision()
          this.checkCommande()
          this.checkEcart()
          this.checkOrderPlani(data[0].orderreceipt)
          this.checkAchat()
          this.checkEcartApro()
         this.transformStock()
         this.getChartData()
         
        },
        (err) => {
          console.log(JSON.stringify(err));
          this.dataLoading = false
        }
      );
  }

  articlesData: any = []
  currentPage: any = 1
  firstPage: any = 1
  lastPage: any = 1
  getArticlesData(page){
    let postData = new FormData();
    var d = new Date()
    var one = d.getFullYear()+'-'+(d.getMonth()+1)+'-01'
    var lst = d.getFullYear()+'-'+(d.getMonth()+1)+'-31'
    postData.append('dateDebut', one);
    postData.append('dateFin', lst);
    this.http.post<any>('http://stepup.ma/espace-equipement-api/api/snop/articles/'+this.familleID+'?page='+page,postData,this.httpOptions).map((res) => res).subscribe((data) => {
          this.articlesData = data.data
          this.currentPage = data.current_page
          this.lastPage = data.last_page
        },
        (err) => {
          console.log(JSON.stringify(err));
        }
      );
  }

  nextPage(){
    if(this.currentPage<this.lastPage){
      this.currentPage = this.currentPage+1
      this.getArticlesData(this.currentPage)
    }
  }

  prevPage(){
    if(this.currentPage>1){
      this.currentPage = this.currentPage-1
      this.getArticlesData(this.currentPage)
    }
  }



  getDataWithFamille(){
    this.getFamilleData()
  }

  setPeriode(range){
    this.PeriodeRange = []
    for(var i=0;i<range.length;i++){
      var date
      if(range[i].Mois<10){
        date = '0'+range[i].Mois+'-'+range[i].Year
      }else{
        date = range[i].Mois+'-'+range[i].Year
      }
       
      this.PeriodeRange.push(date)
    }
  }

  previsionsData: any
  realisationData: any
  ecartData: any
  ecartcumuleData: any
  orderplanData: any
  orderData: any
  ecartOrderData: any
  ecartOrdercumuleData: any
  stockDatacalcul: any
  stockRealise: any

  checkPrevision(){
    this.previsionsData = []
    if(this.FamilleData.length>0){
      // console.log(this.FamilleData)
      var data = this.FamilleData[0].previsions
      var dateRange = this.getDateRange().dateRange
      var finalData = []
      var xdata = []
      if(data.length == dateRange.length){
        // console.log('same length :')
        for(var i=0;i<12;i++){
          finalData.push(data[i].previsions)
        }
        this.previsionsData =  finalData
      }else if(data.length < dateRange.length){
        var dif = dateRange.length - data.length
        // console.log('il manque ',dif)
        //create a good prevision liste with DATE
        for(var i =0;i<data.length;i++){
          var date
          if(data[i].Mois<10){
            date = '0'+data[i].Mois+'-'+data[i].Year
          }else{
            date = data[i].Mois+'-'+data[i].Year
          }
          var d = {
            prevision : data[i].previsions,
            date:date
          }
          xdata.push(d)
        }
        //Check the Previsions List with the Date Range
        for(var i =0;i<12;i++){
          var checkedData = xdata.filter(({date})=> date === dateRange[i])
          if(checkedData.length>0){
            finalData.push(checkedData[0].prevision)
          }else{
            finalData.push(0)
          }
        }
  
      }
      this.previsionsData =  finalData
    }
   
  }

  checkCommande(){
    this.realisationData = []
   if(this.FamilleData.length>0){
    var data = this.FamilleData[0].commandesnop
    var dateRange = this.getDateRange().dateRange
    var finalData = []
    var xdata = []
    if(data.length == dateRange.length){
      // console.log('same length :')
      for(var i=0;i<12;i++){
        finalData.push(data[i].ventes)
      }
      this.realisationData = finalData
    }else if(data.length < dateRange.length){
      var dif = dateRange.length - data.length
      // console.log('il manque ',dif)
      //create a good prevision liste with DATE
      for(var i =0;i<data.length;i++){
        var date
        if(data[i].Mois<10){
          date = '0'+data[i].Mois+'-'+data[i].Year
        }else{
          date = data[i].Mois+'-'+data[i].Year
        }
        var d = {
          vente : data[i].ventes,
          date:date
        }
        xdata.push(d)
      }
      //Check the Previsions List with the Date Range
      for(var i =0;i<12;i++){
        var checkedData = xdata.filter(({date})=> date === dateRange[i])
        if(checkedData.length>0){
          finalData.push(checkedData[0].vente)
        }else{
          finalData.push(0)
        }
      }

    }
    this.realisationData = finalData
   }
  }

  checkEcart(){
    this.ecartData = []
    this.ecartcumuleData = []
    var previsions = this.previsionsData
    var ventes = this.realisationData
    for(var i =0;i<12;i++){
      var ecart = parseFloat(previsions[i])-parseFloat(ventes[i])
      this.ecartData.push(ecart)
    }
    for(var i =0;i<12;i++){
      if(i == 0){
        this.ecartcumuleData.push(this.ecartData[0])
      }else{
        var ecartcumule = this.ecartcumuleData[i-1]+this.ecartData[i]
        this.ecartcumuleData.push(ecartcumule)
      }
    }
  }

  checkOrderPlani(data){
    var dateRange = this.getDateRange().dateRange
    var finalData = [0,0,0,0,0,0,0,0,0,0,0,0]
    this.orderplanData = []
  //  console.log('kkkkk ',data)
    //Check the Previsions List with the Date Range
    for(var i =0;i<12;i++){
      var checkedData = data.filter(({month_rec})=> month_rec === dateRange[i])
      if(checkedData.length>0){
        // console.log(checkedData)
        if((i)<=11){
          finalData[i] = checkedData[0].orders
        }
        
      }else{
        if((i)<=11){
          finalData[i] = 0
        }
       
      }
    }
  
    this.orderplanData =  finalData;
  }


  checkAchat(){
    this.orderData = []
    if(this.FamilleData.length>0){
      // console.log(this.FamilleData)
      var data = this.FamilleData[0].achats
      var dateRange = this.getDateRange().dateRange
      var finalData = []
      var xdata = []
      if(data.length == dateRange.length){
        // console.log('same length :')
        for(var i=0;i<12;i++){
          finalData.push(data[i].orders)
        }
        this.orderData =  finalData
      }else if(data.length < dateRange.length){
        var dif = dateRange.length - data.length
        // console.log('il manque ',dif)
        //create a good prevision liste with DATE
        for(var i =0;i<data.length;i++){
          var date
          if(data[i].Mois<10){
            date = '0'+data[i].Mois+'-'+data[i].Year
          }else{
            date = data[i].Mois+'-'+data[i].Year
          }
          var d = {
            quantite : data[i].orders,
            date:date
          }
          xdata.push(d)
        }
        //Check the Previsions List with the Date Range
        for(var i =0;i<12;i++){
          var checkedData = xdata.filter(({date})=> date === dateRange[i])
          if(checkedData.length>0){
            finalData.push(checkedData[0].quantite)
          }else{
            finalData.push(0)
          }
        }
  
      }
      this.orderData =  finalData
    }
   
  }

  checkEcartApro(){
    this.ecartOrderData = []
    this.ecartOrdercumuleData = []
    var plani = this.orderplanData
    var achat = this.orderData
    for(var i =0;i<12;i++){
      var ecart = parseFloat(plani[i])-parseFloat(achat[i])
      this.ecartOrderData.push(ecart)
    }
    for(var i =0;i<12;i++){
      if(i == 0){
        this.ecartOrdercumuleData.push(this.ecartOrderData[0])
      }else{
        var ecartcumule = this.ecartOrdercumuleData[i-1]+this.ecartOrderData[i]
        this.ecartOrdercumuleData.push(ecartcumule)
      }
    }
  }


transformDate(Mois,Year){
  if(Mois<10){
    return '0'+Mois+'-'+Year
  }else{
    return Mois+'-'+Year
  }
}

stockData: any
ecartStock: any
ecartcumuleStock: any
transformStock(){
  this.stockDatacalcul = []
  this.stockRealise = []
  this.ecartStock = []
  this.ecartcumuleStock = []
  // console.log('la liste des dates range of stock :: ',this.getDateRange().stockdateRange):
  this.stockData = []
  var stocks = this.FamilleData[0].stocks
  // console.log('la liste de stock : ',stocks)
  for(var j=0;j<this.getDateRange().stockdateRange.length;j++){
    var exo = stocks.filter(({Mois,Year})=>this.transformDate(Mois,Year) === this.getDateRange().stockdateRange[j])
    // console.log(exo)
    var filtred = []
    if(exo.length>0){
      for(var i =0;i<exo.length;i++){
      // console.log('kk ',exo[i])
      if((i+1) < exo.length){
        if(exo[i].article_id !== exo[i+1].article_id){
          filtred.push(exo[i])
          this.stockData.push(exo[i])
        }
      }else{
        filtred.push(exo[exo.length-1])
        this.stockData.push(exo[exo.length-1])
      }
    }
    // console.log('array filtered : ',filtred)
    }
  }
  
  // console.log('final array of stock ',this.stockData)
  var theFinalData = []
  for(var i=0;i<this.getDateRange().stockdateRange.length;i++){
    
    var stock = this.stockData.filter(({Mois,Year})=>this.transformDate(Mois,Year) === this.getDateRange().stockdateRange[i])
    if(stock.length>0){
      var sum = 0
      for(var k=0;k<stock.length;k++){
        sum = sum + stock[k].quantite
      }
      theFinalData.push(sum)
    }else{
      theFinalData.push(0)
    }
  }
  // console.log('alors the final qte : ',theFinalData)

  for(var i =0;i<12;i++){
    var res = parseFloat(theFinalData[i])+parseFloat(this.orderplanData[i])-parseFloat(this.previsionsData[i])
    this.stockDatacalcul.push(res)
  }
  for(var i=1;i<12;i++){
    this.stockRealise.push(theFinalData[i])
  }
  this.stockRealise.push(0)

  for(var i=0;i<12;i++){
    var res = parseFloat(this.stockRealise[i]) - parseFloat(this.stockDatacalcul[i])
    this.ecartStock.push(res)
  }
  // console.log('liste des ecart stock : ',this.ecartStock)
  for(var i=0;i<12;i++){
    if(i == 0){
      this.ecartcumuleStock.push(this.ecartStock[0])
    }else{
      var ecartcumule = parseFloat(this.ecartcumuleStock[i-1])+parseFloat(this.ecartStock[i])
      this.ecartcumuleStock.push(ecartcumule)
    }
  }
  // console.log('liste des ecart cumule stock : ',this.ecartcumuleStock)
}




selectedline: any
qte: any
cause: any

publier(article,index){
  if(this.qte!= null && this.cause != null){
    // console.log('qte et cause ',this.qte,this.cause)
   

    let postData = new FormData();
    postData.append('famille_id', article.famille_id);
    postData.append('article_id', article.id);
    postData.append('prevision_id', article.previsions[0].id);
    postData.append('oldprevision', article.previsions[0].prevision);
    postData.append('date', article.previsions[0].date);
    postData.append('newprevision', this.qte);
    postData.append('cause', this.cause);
    // console.log('ls data is here to sent ',article)
    this.http.post<any>('http://stepup.ma/espace-equipement-api/api/snop/article/prevision/edit',postData,this.httpOptions).map((res) => res).subscribe((data) => {
      console.log('data sent :',data)
      this.selectedline = null
      this.qte = null
      this.cause = null
      this.getArticlesData(this.currentPage)
    },(err) => {
      console.log(JSON.stringify(err));
    }
  );

  }
}



}
