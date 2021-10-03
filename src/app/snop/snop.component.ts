import { Component, OnInit, ViewChild } from '@angular/core';
import { IDataOptions, IDataSet, PivotView } from '@syncfusion/ej2-angular-pivotview';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { dataSourceChanged } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-snop',
  templateUrl: './snop.component.html',
  styleUrls: ['./snop.component.scss']
})



export class SnopComponent implements OnInit {

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
  

  width: any
  ngOnInit() {

     this.getFamilleListe()

    this.pivotData = [
      // { 'ID': 31, 'Amount': 52, 'Article': 'MOTEUR DIESEL 170F', 'TypeParams': 'Prévision', 'Year': '2019', 'Month': 'Mois 01', 'Semaine': 'Semaine 1' },
    ];


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

    // console.log('this is the range Date : ',this. getDateRange())
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
  familleName: any = ''
  articleText: any = ''

  //Table Periode
  PeriodeRange: any


 FamilleListe: any
  getFamilleListe(){
    this.http.get<any>('http://stepup.ma/espace-equipement-api/api/params', this.httpOptions).map(res => res).subscribe(data => {
      this.FamilleListe = data.familles
    }, err => {
      console.log(JSON.stringify(err));
    });
  }

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
    var d = new Date()
    var month = d.getMonth()
    var year = d.getFullYear()

    var M3 = month-2
    var M4 = month-3
    var Dyear
    if(M3<0){
      M3 = 13+M3
      Dyear = year -1 
    }else{
      M3 = month-2
      Dyear = year
    }

    var Syear
    if(M4<0){
      M4 = 13+M4
      Syear = year -1 
    }else{
      M4 = month-3
      Syear = year
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

    var daterangeStock = []
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
      datestockDebut:Syear+'-'+M4+'-01',
      dateFin:Fyear+'-'+Mlast+'-5',
      dateRange:dateRange,
      stockdateRange:daterangeStock
    }
  }


  FamilleData: any
  Familleid: any = ''
  dataLoading = true
  getFamilleData(){
    
    let postData = new FormData();
    this.dataLoading = true
    postData.append('dateDebut', this.getDateRange().dateDebut);
    postData.append('dateDebutStock', this.getDateRange().datestockDebut);
    postData.append('dateFin', this.getDateRange().dateFin);
    postData.append('famille', this.Familleid);
    this.http.post<any>('http://stepup.ma/espace-equipement-api/api/snop/prevision',postData,this.httpOptions).map((res) => res).subscribe((data) => {
          // console.log('data is here ',data)
          this.FamilleData = data
          this.setPeriode(data[0].previsions)
         this.dataLoading =false
        },
        (err) => {
          console.log(JSON.stringify(err));
          this.dataLoading =false
        }
      );
  }

  getDataWithFamille(){
    this.dataLoading = true
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

  checkPrevision(data){
    var dateRange = this.getDateRange().dateRange
    var finalData = []
    var xdata = []
    if(data.length == dateRange.length){
      // console.log('same length :')
      for(var i=0;i<12;i++){
        finalData.push(data[i].previsions)
      }
      return finalData
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
          finalData.push('0')
        }
      }

    }
    return finalData
  }

  checkCmdPlani(data){
    var dateRange = this.getDateRange().dateRange
    var finalData = []
    var xdata = []
    if(data.length == dateRange.length){
      // console.log('same length :')
      for(var i=0;i<12;i++){
        finalData.push(data[i].cmdplanifie)
      }
      return finalData
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
          cmdPlan : data[i].cmdplanifie,
          date:date
        }
        xdata.push(d)
      }
      //Check the Previsions List with the Date Range
      for(var i =0;i<12;i++){
        var checkedData = xdata.filter(({date})=> date === dateRange[i])
        if(checkedData.length>0){
          finalData.push(checkedData[0].cmdPlan)
        }else{
          finalData.push('0')
        }
      }

    }
    return finalData
  }

  checkOrderPlani(data): any{
    var dateRange = this.getDateRange().dateRange
    var finalData = [0,0,0,0,0,0,0,0,0,0,0,0]
   
    for(var i =0;i<data.length;i++){
      var date
      if(data[i].Mois<10){
        date = '0'+data[i].Mois+'-'+data[i].Year
      }else{
        date = data[i].Mois+'-'+data[i].Year
      }
      var d = {
        cmdPlan : data[i].cmdplanifie,
        date:date
      }
      
    }
    //Check the Previsions List with the Date Range
    for(var i =0;i<12;i++){
      var checkedData = data.filter(({month})=> month === dateRange[i])
      if(checkedData.length>0){
        if((i+2)<=11){
          finalData[i+2] = checkedData[0].orders
        }
        
      }else{
        if((i+2)<=11){
          finalData[i+2] = 0
        }
       
      }
    }
  
    return finalData;
  }


  transformDate(Mois,Year){
    if(Mois<10){
      return '0'+Mois+'-'+Year
    }else{
      return Mois+'-'+Year
    }
  }



  transformStock(data){
    // console.log('la liste des dates range of stock :: ',this.getDateRange().stockdateRange)
    var dataSorted = []
    var stocks = data.stocks
    // console.log('la liste de stock : ',stocks):
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
            dataSorted.push(exo[i])
          }
        }else{
          filtred.push(exo[exo.length-1])
          dataSorted.push(exo[exo.length-1])
        }
      }
      // console.log('array filtered : ',filtred)
      }
    }
    
    // console.log('final array of stock ',dataSorted)
    var theFinalData = []
    for(var i=0;i<this.getDateRange().stockdateRange.length;i++){
      
      var stock = dataSorted.filter(({Mois,Year})=>this.transformDate(Mois,Year) === this.getDateRange().stockdateRange[i])
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
    var resul = []
    for(var i =0;i<12;i++){
      var res = parseFloat(theFinalData[i])+parseFloat(this.checkOrderPlani(data.orderreceipt)[i])-parseFloat(this.checkPrevision(data.previsions)[i])
      resul.push(res)
    }
    // console.log('okeyyyy :',resul)
    return resul
   
   
  }
  






  

}
