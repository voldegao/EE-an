import { Component, OnInit, ViewChild } from '@angular/core';
import { IDataOptions, IDataSet, PivotView,CellEditSettings  } from '@syncfusion/ej2-angular-pivotview';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { GridSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/gridsettings';
import { ChartComponent} from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-generationcmd',
  templateUrl: './generationcmd.component.html',
  styleUrls: ['./generationcmd.component.scss']
})



export class GenerationcmdComponent implements OnInit {

  public pivotData: IDataSet[];
  public dataSourceSettings: IDataOptions;
  public html2pdf: any
  
  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + window.localStorage.getItem('ESP_access_token')
    })
  }
  @ViewChild('pivotview')
  public pivotview: PivotView;

  constructor(private http: HttpClient) { }
  
  public editS: CellEditSettings
  width: any
  ngOnInit() {
    this.getPo()
    this.getDefaultParam()
    this.getAllArticles()
    this.gridSettings = {
      columnWidth: 120,
      allowSelection: true,
      selectionSettings: { mode: 'Row', type: 'Single', cellSelectionMode: 'Box' }
  } as GridSettings; 

    this.pivotData = [
      // { 'ID': 31, 'Amount': 52, 'Article': 'MOTEUR DIESEL 170F', 'TypeParams': 'Prévision', 'Year': '2019', 'Month': 'Mois 01', 'Semaine': 'Semaine 1' },
    ];

    this.getFamilleListe()

    // this.editS= { allowEditing: true, allowInlineEditing:true }
    this.dataSourceSettings = {
      dataSource: this.pivotData,
      expandAll: true,
      drilledMembers: [{ name: 'Article', items: this.ArticleListefilter }],
      // columns: [{name:'Year'},{ name: 'Month', caption: 'Production Year' }, { name: 'Semaine' }],
      columns: [{name:'Year'},{ name: 'Month', caption: 'Production Year' }, { name: 'Semaine' }],
      values: [{ name: 'Amount', caption: 'Sold Amount' }],
      rows: [{ name: 'Article' }, { name: 'TypeParams' }],
      showGrandTotals: false,
      showSubTotals: false
    };
   
    this.width = '1300'
    this.getDates()
    this.testWeek()
    this.getGenerationData(this.currentPage)
    // console.log(this.generationData)

  }









  public gridSettings: GridSettings;

  ArticleListefilter: any
  getAllArticles(){
    this.ArticleListefilter = []
    this.http.get<any>('http://stepup.ma/espace-equipement-api/api/master/articles/all', this.httpOptions).map(res => res).subscribe(data => {
      for(var i = 0;i<data.length;i++){
      this.ArticleListefilter.push(data[i].designation)
      }
    }, err => {
      console.log(JSON.stringify(err));
    });
  }

  rowSelectedArticle: any
  onCellSelected(args){
    if (args.selectedCellsInfo.length > 0) {
      this.rowSelectedArticle = args.selectedCellsInfo[0].value
      // console.log('row selected : ',args.selectedCellsInfo[0].value)
    }
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
    var listOFArticle = this.newData.filter(({Article,ID})=>ID.includes(this.articleText) || Article.includes(this.articleText))
    // console.log('la lste filtre ',listOFArticle)
    this.pivotview.dataSourceSettings.dataSource = listOFArticle;
  }








  //GENERATION DES Dates de Filtres
  getWeekNumber(d){
    var target: any = new Date(d)
     var dayNr   = (target.getDay() + 6) % 7;
      target.setDate(target.getDate() - dayNr + 3);
      var firstThursday = target.valueOf();
      target.setMonth(0, 1);
      if (target.getDay() != 4) {
          target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
      }
      return 1 + Math.ceil((firstThursday - target) / 604800000);
  }

  testWeek(){
    var f = this.datePrevDebut
    var l = this.datePrevFin
    var k = new Date(this.datePrevDebut)
    var s = new Date(this.datePrevFin)
    var fWeek = this.getWeekNumber(f)
    var lWeek = this.getWeekNumber(l)
    var diff =(s.getTime() - k.getTime()) / 1000;
    diff /= (60 * 60 * 24 * 7);
    // console.log('nombre de semaine : ',Math.abs(Math.round(diff)))
    // console.log('f est : '+fWeek+' et l est : '+lWeek)
  }




  getweekList(){
    var f = this.datePrevDebut
    var l = this.datePrevFin
    var k = new Date(this.datePrevDebut)
    var s = new Date(this.datePrevFin)
    var fWeek = this.getWeekNumber(f)
    var lWeek = this.getWeekNumber(l)
    var firstMonth = k.getMonth()
    var janWeek
    if(firstMonth>0){
      var nextYear = k.getFullYear()+1
      janWeek = this.getWeekNumber(nextYear+'-01-01')
    }
    var diff =(s.getTime() - k.getTime()) / 1000;
    diff /= (60 * 60 * 24 * 7);
    var weekCount = Math.abs(Math.round(diff))
    // console.log('nombre de semaine : ',Math.abs(Math.round(diff)))
    // console.log('f est : '+fWeek+' et l est : '+lWeek)
    // console.log('le 1er du mois de janvier : la semaine est :: ',janWeek)
    var middleWeek
    if(janWeek == 1){
      middleWeek = 52
    }else{
      middleWeek = janWeek
    }
    var weekList = []
    for(var i = 0;i<=(middleWeek-fWeek);i++){
        weekList.push(fWeek+i)
    }
    for(var i = 1;i<=(lWeek);i++){
      weekList.push(i)
    }
    // console.log('la liste des nombre des semaine ',weekList)
    return weekList
  }

 


getDiv(y,x) {
    var l = []
    for(var i = 0;i<x;i++){
      if(i<3){
        l.push(Math.floor(y/x))
      }else{
        l.push(Math.floor(y/x)+(y%x))
      }
    }
    return l
  }


  currentPage: any = 1
  firstPage: any = 1
  lastPage: any = 1

nextPage(){
    if(this.currentPage<this.lastPage){
      this.currentPage = this.currentPage+1
      this.getGenerationData(this.currentPage)
    }
  }

  prevPage(){
    if(this.currentPage>1){
      this.currentPage = this.currentPage-1
      this.getGenerationData(this.currentPage)
    }
  }


exportas(tableID, filename = ''){

    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }

}

datetd: any
datetf: any

stockDateRange: any
  getDates() {
  // var d= new Date('2021-08-12');
    var d = new Date();
    var fin = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    var lstDayofMonth = fin.getDate()

    this.prevDateRange = []
    this.stockDateRange = []

    if(d.getMonth() == 0){
      this.dateStockDebut = (d.getFullYear()-1) + '-12-01'
    }else{
      this.dateStockDebut = d.getFullYear() + '-' +d.getMonth()+ '-01'
    }

    if(d.getMonth() == 5){
      this.datetd = d.getFullYear() + '-01-01'
    // if(d.getMonth() == 0){
    //   this.dateStockDebut = (d.getFullYear()-1) + '-12-01'
    //   this.datetd = (d.getFullYear()-1) + '-08-01'
    }else if(d.getMonth() > 5){
      
      this.datetd = d.getFullYear() + '-'+(d.getMonth()-4)+'-01'
    }
    else{
      var o = d.getMonth()-5
      var res = 13+o
      this.datetd = (d.getFullYear()-1)+ '-' +res+ '-01'
    }

    this.dateCmdDebut = d.getFullYear() + '-' + (d.getMonth() + 1) + '-01'
    this.dateCmdFin = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + lstDayofMonth
    
    this.dateStockFin = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + lstDayofMonth
    this.datePrevDebut = d.getFullYear() + '-' + (d.getMonth() + 1) + '-01'

    var lstPrevMonth = d.getMonth() + 12
    if (lstPrevMonth > 12) {
      var findate = new Date((d.getFullYear() + 1), (lstPrevMonth - 12), 0);
      var lstDayofMonthPrev = findate.getDate()
      this.datePrevFin = (d.getFullYear() + 1) + '-' + (lstPrevMonth - 12) + '-' + lstDayofMonthPrev
    } else {
      this.datePrevFin = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + lstDayofMonth
    }
    for(var i =0;i<12;i++){
      var mois = d.getMonth()+1+i
      if(mois>12){
        this.prevDateRange.push(
          {year:d.getFullYear()+1,mois:mois-12}
        )
      }else{
        this.prevDateRange.push(
          {year:d.getFullYear(),mois:mois}
        )
      }
    }
    for(var i =0;i<12;i++){
      var first = d.getMonth()-4+i
      if(first<1){
        var mois = 12+first
        this.stockDateRange.push(
          {year:d.getFullYear()-1,mois:mois}
        )
      }else{
        if(first>12){
          var re = first-12
          this.stockDateRange.push(
            {year:(d.getFullYear()+1),mois:re}
          )
        }else{
          this.stockDateRange.push(
            {year:d.getFullYear(),mois:first}
          )
        }
       
      }
    }

    // console.log('periode des stocks est de :: ',this.stockDateRange)
  }

  @ViewChild('Dialog')
  public Dialog: DialogComponent;
  public header: string = 'Paramètres';
  public showCloseIcon: Boolean = true;
  public widthd: string = '500';
  public height: string = '70%';
  public target: string = '.control-section';
  public openParams = (): void => {
    this.statusPara = true
    this.Dialog.show();
  };

  //GET DATA
  dataLoading = true
  getGenerationData(page) {
    this.dataLoading = true
    let postData = new FormData();
    postData.append('datePrevDebut', this.datePrevDebut);
    postData.append('datePrevFin', this.datePrevFin);
    postData.append('datetd', this.datetd);
    postData.append('datetf', this.datePrevFin);
    postData.append('dateStockDebut', this.dateStockDebut);
    postData.append('dateStockFin', this.dateStockFin);
    postData.append('dateCmdDebut', this.dateCmdDebut);
    postData.append('dateCmdFin', this.dateCmdFin);
    postData.append('code', this.articleCode);
    postData.append('article', this.articleName);
    postData.append('famille', this.familleName);
    this.http.post<any>('http://stepup.ma/espace-equipement-api/api/generation/data?page='+page, postData, this.httpOptions).map(res => res).subscribe(data => {
      this.dataLoading = false
      this.newData = []
      // this.pivotview.dataSourceSettings.dataSource = this.newData;
      this.generationData = data.data
      // console.log('ok data here ', data)
      this.currentPage = data.current_page
      this.lastPage = data.last_page
      this.loopInsideData(data.data)
    }, err => {
      console.log(JSON.stringify(err));
      this.dataLoading = false
    });
  }

  FamilleListe: any
  getFamilleListe(){
    this.http.get<any>('http://stepup.ma/espace-equipement-api/api/params', this.httpOptions).map(res => res).subscribe(data => {
      this.FamilleListe = data.familles
    }, err => {
      console.log(JSON.stringify(err));
    });
  }

  ParametresD: any
  delaiG: any
  getDefaultParam(){
    this.http.get<any>('http://stepup.ma/espace-equipement-api/api/master/default/params', this.httpOptions).map(res => res).subscribe(data => {
      this.ParametresD = data
      this.lot = data.lot
      this.delai = data.delai
      this.delaiG = data.delai
      this.dtf = data.dtf
      this.stockInit = data.stock
    }, err => {
      console.log(JSON.stringify(err));
    });
  }

  validateParams(){
    let postData = new FormData();
    postData.append('stock', this.stockInit);
    postData.append('lot',this.lot);
    postData.append('delai',this.delai);
    postData.append('dtf',this.dtf);
    postData.append('article_id',this.selectedParamArticle);
    this.http.post<any>('http://stepup.ma/espace-equipement-api/api/master/params', postData, this.httpOptions).map(res => res).subscribe(data => {
       this.Dialog.hide()
       this.ArticleListe = []
       this.selectedParamArticle = ''
       this.getDefaultParam()
      }, err => {
        console.log(JSON.stringify(err));
  });
  }

  ArticleListe: any
  selectedParamArticle: any
  stockInit: any
  lot: any
  delai: any
  dtf: any
  statusPara = true
  getArticleListe(id){
    this.http.get<any>('http://stepup.ma/espace-equipement-api/api/articles/'+id, this.httpOptions).map(res => res).subscribe(data => {
      this.ArticleListe = data

    }, err => {
      console.log(JSON.stringify(err));
    });
  }
  selectFamille(id) {
    console.log(id);
    this.ArticleListe = []
    this.selectedParamArticle = ''
    this.getArticleListe(id)
}

selectArticle(id) {
  this.selectedParamArticle = id
  this.http.get<any>('http://stepup.ma/espace-equipement-api/api/master/params/'+id, this.httpOptions).map(res => res).subscribe(data => {
    // console.log('this is arams ;',data)
    this.lot = data.lot
    this.delai = data.delai
    this.stockInit = data.stock
    this.dtf = data.dtf
    if(data.article_id == 0){
      this.statusPara = true
    }else{
      this.statusPara = false
    }
  }, err => {
    console.log(JSON.stringify(err));
  });
}

  getDataWithFamille(){
    // console.log('this is famille ',this.familleName)
    this.getGenerationData(this.currentPage)
  }
  

  

  //SECOND TEST
  transformPrevisionDataMois(data,params) {
    var itemPrev = data.previsions_s
    var itemCmd = data.commandes_m
    var itemStock = data.stocks_m
    var itemCmdClient = data.cmdplanifie
    var itemAchat = data.achatplanifie
    var itemStockinit = data.stockone
    var itemPrev2 = data.previsions_t
    var itemCmd2 = data.commandes_x
    var itemTauxSecurite = data.tau.facteur_z

    var delai
    if(params == null){
      // delai = this.delaiG
      delai = 2
    }else{
      delai = params.delai
    }
    var infos = data
    //Prevision Part here
  if (itemPrev.length > 0 ) {
    if (itemPrev.length > 0 ) {
      for (var i = 0; i < itemPrev.length; i++) {
        var mois: any = 0
        var prevision
        var cmdPlanifie
        var moisType

        if(itemPrev[i].Mois >= 10){
          moisType = itemPrev[i].Mois + '-' + itemPrev[i].Year
        }else{
          moisType =  '0'+itemPrev[i].Mois + '-' + itemPrev[i].Year
        }

        prevision = {
          'ID': infos.code,
          'Amount': itemPrev[i].Sumprev,
          'Article': infos.designation,
          'TypeParams': '1- Prévision',
          'Year': itemPrev[i].Year,
          'Month':  moisType,
          'Mois':itemPrev[i].Mois,
        }
        
      
        this.newData.push(prevision)
      
        
      }
    }


    if(itemCmdClient.length>0){
      var d = new Date()
      var month = d.getMonth()+1
      var year = d.getFullYear()
      var date 
      if(month<10){
        date = '0'+month+'-'+year
      }else{
        date = month+'-'+year
      }
      // console.log(date)
      if(this.newData.length > 0){
        const result = this.newData.filter(({TypeParams,ID})=>TypeParams==='1- Prévision' && ID === infos.code) 
        for(var k =0;k<12;k++){
          //  var cm = itemStock.filter(({Mois,Year})=> Mois === result[k].Mois && Year === result[k].Year )
        var cm = itemCmdClient.filter(({Mois,Year})=> Mois === result[k].Mois && Year === result[k].Year )
          if(cm.length > 0){
            if(cm.Mois>10){
              moisType = cm[0].Mois + '-' + cm[0].Year
            }else{
              moisType = '0'+cm[0].Mois + '-' + cm[0].Year
            }
            var cmdo: any = {
              'ID': infos.code,
              'Amount': cm[0].cmds,
              'Article': infos.designation,
              'TypeParams': '3- Commande Client',
              'Year': cm[0].Year,
              'Month':  moisType,
            }
            this.newData.push(cmdo)
            
          }else{
            if(result[k].Mois>10){
              moisType = result[k].Mois + '-' + result[k].Year
            }else{
            moisType = '0'+result[k].Mois + '-' + result[k].Year
            }
            var cmf: any = {
              'ID': infos.code,
              'Amount':0,
              'Article': infos.designation,
              'TypeParams': '3- Commande Client',
              'Year': result[k].Year,
              'Month':  moisType,
              // 'Semaine': 'Semaine '+result[k].Week
            }
            this.newData.push(cmf)
          }
        }
      }
      
    }else{
      const result = this.newData.filter(({TypeParams,ID})=>TypeParams==='1- Prévision' && ID === infos.code) 
      for(var k =0;k<12;k++){
        //  var cm = itemStock.filter(({Mois,Year})=> Mois === result[k].Mois && Year === result[k].Year )
        if(result[k].Mois>10){
          moisType = result[k].Mois + '-' + result[k].Year
        }else{
        moisType = '0'+result[k].Mois + '-' + result[k].Year
        }
        var cmdClientplanifie = {
          'ID': infos.code,
          'Amount': 0,
          'Article': infos.designation,
          'TypeParams': '3- Commande Client',
          'Year': result[k].Year,
          'Month':  moisType,
        }
        this.newData.push(cmdClientplanifie)
      }
      
    
      
    }


    if(itemAchat.length>0){
      var d = new Date()
      var month = d.getMonth()+1
      var year = d.getFullYear()
      var date 
      if(month<10){
        date = '0'+month+'-'+year
      }else{
        date = month+'-'+year
      } 

      // console.log(date)
      if(this.newData.length > 0){
        const result = this.newData.filter(({TypeParams,ID})=>TypeParams==='1- Prévision' && ID === infos.code) 
        for(var k =0;k<12;k++){
          //  var cm = itemStock.filter(({Mois,Year})=> Mois === result[k].Mois && Year === result[k].Year )
        var cm = itemAchat.filter(({Mois,Year})=> Mois === result[k].Mois && Year === result[k].Year )
          if(cm.length > 0){
            if(cm[0].Mois>9){
              moisType = cm[0].Mois + '-' + cm[0].Year
            }else{
              moisType = '0'+cm[0].Mois + '-' + cm[0].Year
            }
            var cmdo: any = {
              'ID': infos.code,
              'Amount': cm[0].cmds,
              'Article': infos.designation,
              'TypeParams': '6- Commande Planifiée',
              'Year': cm[0].Year,
              'Month':  moisType,
            }
            this.newData.push(cmdo)
            
          }else{
            if(result[k].Mois>9){
              moisType = result[k].Mois + '-' + result[k].Year
            }else{
            moisType = '0'+result[k].Mois + '-' + result[k].Year
            }
            var cmf: any = {
              'ID': infos.code,
              'Amount':0,
              'Article': infos.designation,
              'TypeParams': '6- Commande Planifiée',
              'Year': result[k].Year,
              'Month':  moisType,
              // 'Semaine': 'Semaine '+result[k].Week
            }
            this.newData.push(cmf)
          }
        }
      }
      
    }else{
      const result = this.newData.filter(({TypeParams,ID})=>TypeParams==='1- Prévision' && ID === infos.code) 
      for(var k =0;k<12;k++){
        //  var cm = itemStock.filter(({Mois,Year})=> Mois === result[k].Mois && Year === result[k].Year )
        if(result[k].Mois>9){
          moisType = result[k].Mois + '-' + result[k].Year
        }else{
        moisType = '0'+result[k].Mois + '-' + result[k].Year
        }
        var cmdClientplanifie = {
          'ID': infos.code,
          'Amount': 0,
          'Article': infos.designation,
          'TypeParams': '6- Commande Planifiée',
          'Year': result[k].Year,
          'Month':  moisType,
        }
        this.newData.push(cmdClientplanifie)
      }
      
    
      
    }

    // Commande Clients part here
    if(itemCmd.length>0){
      var d = new Date()
      var month = d.getMonth()+1
      var year = d.getFullYear()
      var date 
      var dmdnet
      if(month<10){
        date = '0'+month+'-'+year
      }else{
        date = month+'-'+year
      }
      // console.log(date)
      const result = this.newData.filter(({TypeParams,ID, Month})=>TypeParams==='1- Prévision' && ID === infos.code)
      const allPrev = this.newData.filter(({TypeParams,ID})=>TypeParams==='1- Prévision' && ID === infos.code)
      // console.log('alrs les resu ',result)
      // console.log('all prevision est : ',allPrev)
      for(var k =0;k<12;k++){
        var cm = itemCmd.filter(({Mois,Year})=> Mois === result[k].Mois && Year === result[k].Year )
        
        var moisType
        if(cm.Mois >= 10){
          moisType =  result[k].Mois+ '-' + result[k].Year
        }else{
          moisType =  '0'+  result[k].Mois + '-' + result[k].Year
        }
        if(cm.length >0){
          var cmd = {
            'ID': infos.code,
            'Amount': cm[0].Sumventes,
            'Article': infos.designation,
            'TypeParams': '2- Ventes',
            'Year': cm[0].Year,
            'Month': moisType,
          }
          this.newData.push(cmd) 
          dmdnet = {
            'ID': infos.code,
            'Amount': allPrev[k].Amount-parseFloat(cm[0].Sumventes),
            'Article': infos.designation,
            'TypeParams': '4- Demande Net',
            'Year': cm[0].Year,
            'Month': moisType,
            'Mois':cm[0].Mois,
          }
          this.newData.push(dmdnet) 
        }else{
          var cmf: any = {
            'ID': infos.code,
            'Amount':0,
            'Article': infos.designation,
            'TypeParams': '2- Ventes',
            'Year': result[k].Year,
            'Month': moisType,
          }
          this.newData.push(cmf)
          dmdnet = {
            'ID': infos.code,
            'Amount': allPrev[k].Amount,
            'Article': infos.designation,
            'TypeParams': '4- Demande Net',
            'Year': result[k].Year,
            'Month': moisType,
          }
          this.newData.push(dmdnet)
        }
      }
     
    }else{
      var d = new Date()
      var month = d.getMonth()+1
      var year = d.getFullYear()
      var date 
      var dmdnet
      if(month<10){
        date = '0'+month+'-'+year
      }else{
        date = month+'-'+year
      }
      // console.log(date)
      const result = this.newData.filter(({TypeParams,ID, Month})=>TypeParams==='1- Prévision' && ID === infos.code)
      const allPrev = this.newData.filter(({TypeParams,ID})=>TypeParams==='1- Prévision' && ID === infos.code)
      // console.log('alrs les resu ',result)
      // console.log('all prevision est : ',allPrev)
      for(var k =0;k<12;k++){
        var cm = itemCmd.filter(({Mois,Year})=> Mois === result[k].Mois && Year === result[k].Year )
        
        var moisType
        if(cm.Mois >= 10){
          moisType =  result[k].Mois+ '-' + result[k].Year
        }else{
          moisType =  '0'+  result[k].Mois + '-' + result[k].Year
        }
        
          var cmf: any = {
            'ID': infos.code,
            'Amount':0,
            'Article': infos.designation,
            'TypeParams': '2- Ventes',
            'Year': result[k].Year,
            'Month': moisType,
          }
          this.newData.push(cmf)
          dmdnet = {
            'ID': infos.code,
            'Amount': allPrev[k].Amount,
            'Article': infos.designation,
            'TypeParams': '4- Demande Net',
            'Year': result[k].Year,
            'Month': moisType,
          }
          this.newData.push(dmdnet)
        
      }
    }

    
    //Fonction de la demande 
    if(itemPrev.length>0){
      var previsions = this.newData.filter(({TypeParams,ID})=>TypeParams === '1- Prévision' && ID === infos.code)
      var dmdNet = this.newData.filter(({TypeParams,ID})=>TypeParams === '4- Demande Net' && ID === infos.code)
      var commandesClient = this.newData.filter(({TypeParams,ID})=>TypeParams === '3- Commande Client' && ID === infos.code)
      for(var i = 0;i<12;i++){
       
          var cmf: any = {
            'ID': infos.code,
            'Amount': Math.max(dmdNet[i].Amount,commandesClient[i].Amount),
            'Article': infos.designation,
            'TypeParams': '5- Demande',
            'Year': previsions[i].Year,
            'Month':  previsions[i].Month,
            // 'Semaine': previsions[i].Semaine
          }
          this.newData.push(cmf)
        
      }
    }

    // else if(commandes[i]){
    //   var cmds = parseFloat(commandes[i].Amount)+parseFloat(commandesClient[i].Amount)
    //   console.log('alors on cherche la table CMDS : ',parseFloat(commandes[i].Amount),parseFloat(commandesClient[i].Amount),cmds)
    //   var cmf: any = {
    //     'ID': infos.code,
    //     'Amount': Math.max(previsions[i].Amount,cmds),
    //     'Article': infos.designation,
    //     'TypeParams': '5- Demande',
    //     'Year': previsions[i].Year,
    //     'Month':  previsions[i].Month,
    //     // 'Semaine': previsions[i].Semaine
    //   }
    //   this.newData.push(cmf)
    // }else{
    //   var cmf: any = {
    //     'ID': infos.code,
    //     'Amount': previsions[i].Amount,
    //     'Article': infos.designation,
    //     'TypeParams': '5- Demande',
    //     'Year': previsions[i].Year,
    //     'Month':  previsions[i].Month,
    //   }
    //   this.newData.push(cmf)
    // }

    //Fonction du Besoin Net
    if(itemPrev.length>0){
      var demandes = this.newData.filter(({TypeParams,ID})=>TypeParams === '5- Demande' && ID === infos.code)
      var stocks = this.newData.filter(({TypeParams,ID})=>TypeParams === '7- Stock Réel' && ID === infos.code)
      var cmdplan = this.newData.filter(({TypeParams,ID})=>TypeParams === '6- Commande Planifiée' && ID === infos.code)
      
      var stockinit
      // console.log('la stock intitnti : ',itemStockinit[0])
      if(itemStockinit.length>0){
        stockinit = itemStockinit[0].quantite
      }else{
        stockinit = 0
      }

      for(var i=0;i<12;i++){
        if(i>0){
          var besoin = parseFloat(cmdplan[i].Amount)-parseFloat(demandes[i].Amount)
          // var besoin = parseFloat(stockinit)+parseFloat(cmdplan[i].Amount)-parseFloat(demandes[i].Amount)
          // console.log('le besoin est ded :: ',besoin)
          if(besoin<0){
              var bs = {
                'ID': infos.code,
                'Amount': besoin,
                'Article': infos.designation,
                'TypeParams': '8- Besoin Net',
                'Year': previsions[i].Year,
                'Month':  previsions[i].Month,
              }
              this.newData.push(bs)
              var por = {
                'ID': infos.code,
                'Amount': Math.abs(besoin),
                'Article': infos.designation,
                'TypeParams': '9- Planned Order Receipt',
                'Year': previsions[i].Year,
                'Month':  previsions[i].Month,
              }
              this.newData.push(por)
            }else{
              var bs = {
                'ID': infos.code,
                'Amount': 0,
                'Article': infos.designation,
                'TypeParams': '8- Besoin Net',
                'Year': previsions[i].Year,
                'Month':  previsions[i].Month,
              }
              this.newData.push(bs)
              var por = {
                'ID': infos.code,
                'Amount': 0,
                'Article': infos.designation,
                'TypeParams': '9- Planned Order Receipt',
                'Year': previsions[i].Year,
                'Month':  previsions[i].Month,
              }
              this.newData.push(por)
            }
        }else{
          
          var besoin = parseFloat(stockinit)+parseFloat(cmdplan[i].Amount)-parseFloat(demandes[i].Amount)
          // console.log('le besoin est ded :: ',besoin)
          if(besoin<0){
              var bs = {
                'ID': infos.code,
                'Amount': besoin,
                'Article': infos.designation,
                'TypeParams': '8- Besoin Net',
                'Year': previsions[i].Year,
                'Month':  previsions[i].Month,
              }
              this.newData.push(bs)
              var por = {
                'ID': infos.code,
                'Amount': Math.abs(besoin),
                'Article': infos.designation,
                'TypeParams': '9- Planned Order Receipt',
                'Year': previsions[i].Year,
                'Month':  previsions[i].Month,
              }
              this.newData.push(por)
            }else{
              var bs = {
                'ID': infos.code,
                'Amount': 0,
                'Article': infos.designation,
                'TypeParams': '8- Besoin Net',
                'Year': previsions[i].Year,
                'Month':  previsions[i].Month,
              }
              this.newData.push(bs)
              var por = {
                'ID': infos.code,
                'Amount': 0,
                'Article': infos.designation,
                'TypeParams': '9- Planned Order Receipt',
                'Year': previsions[i].Year,
                'Month':  previsions[i].Month,
              }
              this.newData.push(por)
            }
        }
      }

      for(var g=0 ;g<this.listeConfirmation.length;g++){
        var dd = this.listeConfirmation[g]
        var ndxc = this.newData.findIndex(({TypeParams,ID,Month})=>TypeParams==='9- Planned Order Receipt' && ID === dd.article_code && Month===dd.month_rec)
        if(ndxc>0){
          this.newData[ndxc].Amount = dd.po_release
        }
      }
      
     
      //Planner Order Realease
      var pors = this.newData.filter(({TypeParams,ID})=>TypeParams==='9- Planned Order Receipt' && ID === infos.code)
      if(pors.length>0){
        var lot
        var exo = []
        var porCopy = []
        for(var i = 0;i<pors.length;i++){
          porCopy.push(pors[i])
        }
        var ndx = 0;
        var nbr = 2;
        var finalCopy = porCopy.splice(ndx, nbr);
       
        for(var i = 0;i<porCopy.length;i++){
          if(porCopy[i].Amount >= 0){
            var por2 = {
              'ID': infos.code,
              'Amount': porCopy[i].Amount,
              'Article': infos.designation,
              'TypeParams': 'a- Planner Order Release',
              'Year': previsions[i].Year,
              'Month':  previsions[i].Month,
            } 
            this.newData.push(por2)
            exo.push(por2)
          }
         
        }
        // console.log('la premiere POR est de ::!:: ',pors)
        var porsd = this.newData.filter(({TypeParams,ID})=>TypeParams==='a- Planner Order Release' && ID === infos.code)
        // console.log('la deuziemme POR est de ::!:: ',porsd)
        // var porT = this.newData.filter(({TypeParams,ID})=>TypeParams==='a- Planner Order Release' && ID === infos.code)
        // var res = 12 - porT.length
        // for(var i = 0;i<res;i++){
        //   this.newData.push(exo[exo.length-1])
        // }
      }


      //STOCK FUNCTION HERE
    if(itemStock.length>0){
      var d = new Date()
      var month = d.getMonth()+1
      var year = d.getFullYear()
      var date 
      if(month<10){
        date = '0'+month+'-'+year
      }else{
        date = month+'-'+year
      }
      // console.log(date)
      if(this.newData.length > 0){
        const result = this.newData.filter(({TypeParams,ID})=>TypeParams==='1- Prévision' && ID === infos.code) 
        const cmdPlan = this.newData.filter(({TypeParams,ID})=>TypeParams==='6- Commande Planifiée' && ID === infos.code) 
        const cmdRec = this.newData.filter(({TypeParams,ID})=>TypeParams==='9- Planned Order Receipt' && ID === infos.code) 
        const dmd = this.newData.filter(({TypeParams,ID})=>TypeParams==='5- Demande' && ID === infos.code) 
        // console.log('alrs les resu ',result)
        // console.log('les stocks ',itemStock)
        for(var k =0;k<12;k++){
          //  var cm = itemStock.filter(({Mois,Year})=> Mois === result[k].Mois && Year === result[k].Year )
        var cm = itemStock
          if(cm.length > 0 && k == 0 ){
            // console.log(cm)
            if(cm.Mois>10){
              moisType = cm[0].Mois + '-' + cm[0].Year
            }else{
              moisType = '0'+cm[0].Mois + '-' + cm[0].Year
            }
            var qte = parseFloat(cm[0].quantite)+parseFloat(cmdPlan[0].Amount)+parseFloat(cmdRec[0].Amount)-parseFloat(dmd[0].Amount)
            var cmdo: any = {
              'ID': infos.code,
              'Amount': qte,
              'Article': infos.designation,
              'TypeParams': '7- Stock Réel',
              'Year': cm[0].Year,
              'Month':  moisType,
            }
            this.newData.push(cmdo)
            
          }else{
            if(result[k].Mois>10){
              moisType = result[k].Mois + '-' + result[k].Year
            }else{
            moisType = '0'+result[k].Mois + '-' + result[k].Year
            }
            var qte = parseFloat(cmdPlan[k].Amount)+parseFloat(cmdRec[k].Amount)-parseFloat(dmd[k].Amount)
            var cmf: any = {
              'ID': infos.code,
              'Amount':qte,
              'Article': infos.designation,
              'TypeParams': '7- Stock Réel',
              'Year': result[k].Year,
              'Month':  moisType,
              // 'Semaine': 'Semaine '+result[k].Week
            }
            this.newData.push(cmf)
          }
        }
      }
      
    }else{
      const result = this.newData.filter(({TypeParams,ID})=>TypeParams==='1- Prévision' && ID === infos.code) 
      const cmdPlan = this.newData.filter(({TypeParams,ID})=>TypeParams==='6- Commande Planifiée' && ID === infos.code) 
        const cmdRec = this.newData.filter(({TypeParams,ID})=>TypeParams==='9- Planned Order Receipt' && ID === infos.code) 
        const dmd = this.newData.filter(({TypeParams,ID})=>TypeParams==='5- Demande' && ID === infos.code) 
      for(var k =0;k<12;k++){
        //  var cm = itemStock.filter(({Mois,Year})=> Mois === result[k].Mois && Year === result[k].Year )
        if(result[k].Mois>10){
          moisType = result[k].Mois + '-' + result[k].Year
        }else{
        moisType = '0'+result[k].Mois + '-' + result[k].Year
        }
        var qte = parseFloat(cmdPlan[k].Amount)+parseFloat(cmdRec[k].Amount)-parseFloat(dmd[k].Amount)
        var cmf: any = {
          'ID': infos.code,
          'Amount':qte,
          'Article': infos.designation,
          'TypeParams': '7- Stock Réel',
          'Year': result[k].Year,
          'Month':  moisType,
          // 'Semaine': 'Semaine '+result[k].Week
        }
        this.newData.push(cmf)
      }
    }


    }

    //Stock de Securité
    if (itemPrev2.length > 0 ) {
      var dmds = []
      var prevs = []
      var commandesNext = this.newData.filter(({TypeParams,ID})=>TypeParams === '5- Demande' && ID === infos.code)
      // console.log("la commande Next est de :: ",commandesNext)
      for(var i=0;i<6;i++){
        var dm = itemCmd2.filter(({Mois,Year})=>Mois === this.stockDateRange[i].mois && Year === this.stockDateRange[i].year)
        // console.log('itemCMD2 :: ',dm)
        if(dm.length>0){
          dmds.push(dm[0].Sumventes)
        }else{
          dmds.push(0)
        }
      }
      // console.log('final ITEMCMD :: ',dmds)
      // console.log('stockRanged Data : ',this.stockDateRange)
      for(var i=0;i<this.stockDateRange.length;i++){
        var pr = itemPrev2.filter(({Mois,Year})=>Mois === this.stockDateRange[i].mois && Year === this.stockDateRange[i].year)
        if(pr.length>0){
          prevs.push(pr[0].prevision)
        }else{
          prevs.push(0)
        }
      }
      // console.log('voici les prev et les demsnde  ????',prevs,dmds)
      for(var i = 0;i<12;i++){
        if(i==0){
          var madMois = 0
          var abs = 0
          for (var k = 0; k < 6; k++) {
            abs = abs + Math.abs(parseFloat(dmds[k]) - parseFloat(prevs[k]))
          }
          madMois = abs / 6
          var ss = madMois*itemTauxSecurite
          var stockSecurite = {
            'ID': infos.code,
            'Amount': Math.round(ss),
            'Article': infos.designation,
            'TypeParams': '15- Stock Sécurité',
            'Year': commandesNext[0].Year,
            'Month': commandesNext[0].Month,
            'Mois':commandesNext[0].Mois,
          }
          this.newData.push(stockSecurite)
        }else{
          var a = 0
          var madMois = 0
          var abs = 0
          if(i<= 5){
            for (var k = i; k < 6; k++) {
              abs = abs + Math.abs(parseFloat(dmds[k]) - parseFloat(prevs[k]))
            }
            for (var k = 0; k < i; k++) {
                abs = abs + Math.abs(parseFloat(commandesNext[k+1].Amount) - parseFloat(prevs[k+6]))
            }
          }
          else{
            for (var k = 1; k <= 6; k++) {
                abs = abs + Math.abs(parseFloat(commandesNext[k].Amount) - parseFloat(itemPrev2[k+5].prevision))
            }
          }
          

          madMois = abs / 6
          var ss = madMois*itemTauxSecurite
          var stockSecurite = {
            'ID': infos.code,
            'Amount': Math.round(ss),
            'Article': infos.designation,
            'TypeParams': '15- Stock Sécurité',
            'Year': commandesNext[i].Year,
            'Month': commandesNext[i].Month,
            'Mois':commandesNext[i].Mois,
          }
          this.newData.push(stockSecurite)
        }
      }
    }
  }
  }

cli(){
  var stocksecurite = this.newData.filter(({ID,TypeParams})=>ID === '170F' && TypeParams === '15- Stock Sécurité')
  // console.log(stocksecurite)
  // console.log(this.stockDateRange)
}
  newData: any = []
  headerLoop: any
  headerData: any
  headerLength: any
  subHeaderData: any
  previsionData: any

  uniqueArticles: any
  allPrevisions: any
  loopInsideData(data) {
    this.newData = []
    this.headerLoop = []
    this.headerData = []
    this.allPrevisions = []
    // var numberofPages
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].previsions_s.length>0){
          this.transformPrevisionDataMois(data[i],data[i].parametres)
        }
        
      }
      // this.pivotview.dataSourceSettings.dataSource = this.newData;
      // console.log('lool ',this.newData)
      var seonsArticle = this.newData.filter(({ID,TypeParams})=>ID === '170F' && TypeParams === '7- Stock Réel')
      // console.log('la liste du second article : ',seonsArticle)
    //TIL Here OK!!
      var firstArticleArrayPrev = this.newData.filter(({ID,TypeParams})=>ID === this.newData[0].ID && TypeParams === '1- Prévision')
      // console.log('all data of ! ',this.newData)
     
      // console.log('first  sdfsdfsdf : ',firstArticleArrayPrev)
      this.subHeaderData = firstArticleArrayPrev
      this.previsionData = firstArticleArrayPrev

      var allprevisions = this.newData.filter(({TypeParams})=>TypeParams == '1- Prévision')
      this.allPrevisions = allprevisions
      var counter = {}
      firstArticleArrayPrev.forEach(function(obj) {
            var key = JSON.stringify(obj.Year)
            counter[key] = (counter[key] || 0) + 1
      })
      this.headerData.push(counter)
      for (let i = 0; i < Object.keys(counter).length; i++) {
          this.headerLoop.push(i)        
      }


      //Get List of the articles in the newData array
      const unique = [...new Set(this.newData.map(item => item.ID))];
      // console.log('la liste unique ',unique)
      this.uniqueArticles = unique
    }
  }

  getObjectKey(data,index){
    return Object.keys(data)[index]
  }
  getObjectValue(data,index){
    return data[Object.keys(data)[index]]
  }
  filterArticleName(code){
    var data = this.newData.filter(({ID})=>ID === code)
    console.log('articles ',data[0])
    return data[0].Article
  }
  filterArticle(code){
    var previsions = this.newData.filter(({ID,TypeParams})=>ID === code && TypeParams === '1- Prévision')
    var ventes = this.newData.filter(({ID,TypeParams})=>ID === code && TypeParams === '2- Ventes')
    var cmdClient = this.newData.filter(({ID,TypeParams})=>ID === code && TypeParams === '3- Commande Client')
    var dmdNet = this.newData.filter(({ID,TypeParams})=>ID === code && TypeParams === '4- Demande Net')
    var dmd = this.newData.filter(({ID,TypeParams})=>ID === code && TypeParams === '5- Demande')
    var cmdPla = this.newData.filter(({ID,TypeParams})=>ID === code && TypeParams === '6- Commande Planifiée')
    var stock = this.newData.filter(({ID,TypeParams})=>ID === code && TypeParams === '7- Stock Réel')
    var besoinNet = this.newData.filter(({ID,TypeParams})=>ID === code && TypeParams === '8- Besoin Net')
    var poR1 = this.newData.filter(({ID,TypeParams})=>ID === code && TypeParams === '9- Planned Order Receipt')
    var poR2 = this.newData.filter(({ID,TypeParams})=>ID === code && TypeParams === 'a- Planner Order Release')
    var stocksecurite = this.newData.filter(({ID,TypeParams})=>ID === code && TypeParams === '15- Stock Sécurité')

  
    var data = {
      previsions : previsions,
      ventes : ventes,
      cmdClient: cmdClient,
      dmdNet:dmdNet,
      demande:dmd,
      cmdPla:cmdPla,
      stock:stock,
      besoinNet:besoinNet,
      poR1:poR1,
      poR2:poR2,
      stocksecurite:stocksecurite,
    }
    return data
  }

  selectedCode = ''
  toggleDetails(data){
    if(data == this.selectedCode){
      this.selectedCode = ''
    }else{
      this.selectedCode = data
    }
  }







  articleNameData: any
getArticleByname(name){
  this.http.get<any>('http://stepup.ma/espace-equipement-api/api/master/articlebyname/'+name, this.httpOptions).map(res => res).subscribe(data => {
      this.articleNameData = data.id
      // console.log('rticle',data)
    }, err => {
      console.log(JSON.stringify(err));
    }); 
}



confirm(){
  this.getArticleByname(this.rowSelectedArticle)
  var da = new Date()
  var mois = da.getMonth()+1
  var year = da.getFullYear()
  var month
  if(mois>9){
    month = mois+'-'+year
  }else{
    month = '0'+mois+'-'+year
  }
  // console.log('article selectioné : ',this.rowSelectedArticle)
  // console.log('article selectioné id : ',this.articleNameData)
  
  const d = this.newData.filter(({Article,Month})=>Article === this.rowSelectedArticle && Month === month)
  const articleDataList = d.sort(function(a, b) {
    var nameA = a.TypeParams.toUpperCase();var nameB = b.TypeParams.toUpperCase();
    if (nameA < nameB) {return -1}
    if (nameA > nameB) {return 1}
    return 0;
  })

  let postData = new FormData();
  postData.append('article_id',this.articleNameData);
  postData.append('month',month);
  postData.append('po_release',articleDataList[8].Amount);
  this.http.post<any>('http://stepup.ma/espace-equipement-api/api/generation/data/confirmation', postData, this.httpOptions).map(res => res).subscribe(data => {
    //  console.log('confirmation data : ',data)
    }, err => {
      console.log(JSON.stringify(err));
});

}


focused: any
confirmData: any
showInput(data,i){
  var focusedData = data+i
  var previsions = this.newData.filter(({ID,TypeParams})=>ID === data && TypeParams === '1- Prévision')
  this.confirmData = previsions[i]
  this.focused = focusedData
}

 onEnter(amount){
  // console.log('Index : ',this.focused)
  // console.log('data : ',this.confirmData)
  var m 
  if(this.confirmData.Mois<10){
    m = '0'
  }else{
    m =''
  }
  var g
  var dr: any = parseFloat(this.confirmData.Mois+2)
  var dyear
  if(dr<=12){
    if(dr<10){
      dr = '0'+dr
    }
    dyear = this.confirmData.Year
  }else{
    dr = dr-12
    if(dr<10){
      dr = '0'+dr
    }
    dyear = parseFloat(this.confirmData.Year)+1
  }
  var date = this.confirmData.Year+'-'+m+this.confirmData.Mois+'-01'
  var dater = dr+'-'+dyear
  let postData = new FormData();
  postData.append('article_code',this.confirmData.ID);
  postData.append('month',this.confirmData.Month);
  postData.append('month_rec',dater);
  postData.append('date',date);
  postData.append('po_release',amount);
  this.http.post<any>('http://stepup.ma/espace-equipement-api/api/generation/data/confirmation', postData, this.httpOptions).map(res => res).subscribe(data => {
   
    //  console.log('confirmation data : ',data)
     this.focused = ''
     var objIndex = this.newData.findIndex(({ID,TypeParams,Month})=>ID===this.confirmData.ID && TypeParams === 'a- Planner Order Release' && Month === this.confirmData.Month);
    //  console.log('index s ',objIndex)
     this.newData[objIndex].Amount = data.po_release

     var index = this.newData.findIndex(({TypeParams,ID,Month})=>TypeParams==='9- Planned Order Receipt' && ID === this.confirmData.ID && Month===dater)
     this.newData[index].Amount = data.po_release

     //Stock edition
     const cmdPlani = this.newData.findIndex(({TypeParams,ID,Month})=>TypeParams==='6- Commande Planifiée' && ID === this.confirmData.ID && Month===dater) 
    //  console.log('daterrr ',dater)
    //  console.log('planiiii ',cmdPlani)
     const cmdReci = this.newData.findIndex(({TypeParams,ID,Month})=>TypeParams==='9- Planned Order Receipt' && ID === this.confirmData.ID && Month===dater) 
     const dmdi = this.newData.findIndex(({TypeParams,ID,Month})=>TypeParams==='5- Demande' && ID === this.confirmData.ID && Month===dater) 
     var cmdpl = this.newData.filter(({TypeParams,ID,Month})=>TypeParams==='6- Commande Planifiée' && ID === this.confirmData.ID) 

     var qte = parseFloat(this.newData[cmdPlani].Amount)+parseFloat(this.newData[cmdReci].Amount)-parseFloat(this.newData[dmdi].Amount)
     var indexStock = this.newData.findIndex(({TypeParams,ID,Month})=>TypeParams==='7- Stock Réel' && ID === this.confirmData.ID && Month===dater)
     this.newData[indexStock].Amount = qte
    
     //  this.listeConfirmation.push(data)
    this.getPo()     
    }, err => {
      console.log(JSON.stringify(err));
  });

 }


listeConfirmation: any
getPo(){
  var d = new Date()
  var firstDate
  var lastDate
  var month = d.getMonth()
  if(month < 10){
    firstDate = d.getFullYear()+'-0'+(month+1)+'-01'
  }else{
    firstDate = d.getFullYear()+'-'+(month+1)+'-01'
  }

  var lastMnth = month +12
  if(lastMnth>12){
    var m = lastMnth-12
    if(m < 10){
      lastDate = (d.getFullYear()+1)+'-0'+m+'-01'
    }else{
       lastDate = (d.getFullYear()+1)+'-'+m+'-01'
    }
  }else{
       if(m < 10){
      lastDate = d.getFullYear()+'-0'+m+'-01'
    }else{
       lastDate = d.getFullYear()+'-'+m+'-01'
    }
  }

   let postData = new FormData();
  postData.append('first',firstDate);
  postData.append('last',lastDate);
  this.http.post<any>('http://stepup.ma/espace-equipement-api/api/confirm/po', postData, this.httpOptions).map(res => res).subscribe(data => {
    //  console.log('La liste des confirmation de la DB :: ',data)
     this.listeConfirmation = data
    }, err => {
      console.log(JSON.stringify(err));
  });

}


checkPOR(m,c,p){
  var check = this.listeConfirmation.filter(({month_rec,article_code})=>month_rec===m && article_code === c)
  if(check.length>0){
    // console.log('fffffffffff ',this.listeConfirmation)
    var index = this.newData.findIndex(({TypeParams,ID,Month})=>TypeParams==='9- Planned Order Receipt' && ID === c && Month===check[0].month_rec)
    this.newData[index].Amount = check[check.length-1].po_release
    return {
      validated : true,
      po: check[check.length-1].po_release,
    }
  }else{
     return {
      validated : false,
      po: p,
    }
  }
}

checkConfirm(c,m,p){
  var check = this.listeConfirmation.filter(({month,article_code})=>month===m && article_code === c)
 
  if(check.length>0){
    // console.log('fffffffffff ',this.listeConfirmation)
    // const cmdPlani = this.newData.findIndex(({TypeParams,ID,Month})=>TypeParams==='6- Commande Planifiée' && ID === c && Month===m) 
    // const cmdReci = this.newData.findIndex(({TypeParams,ID,Month})=>TypeParams==='9- Planned Order Receipt' && ID === c && Month===check[0].month_rec) 
    // const dmdi = this.newData.findIndex(({TypeParams,ID,Month})=>TypeParams==='5- Demande' && ID === c && Month===m) 
    // var cmdpl = this.newData.filter(({TypeParams,ID,Month})=>TypeParams==='6- Commande Planifiée' && ID === c) 
    // console.log('article et idex plz : ',cmdPlani,cmdReci,dmdi,cmdpl)
    // var firstone =   this.newData.findIndex(({TypeParams,ID,Month})=>TypeParams==='7- Stock Réel' && ID === c && Month===check[0].month_rec)
    
    // var qte = parseFloat(this.newData[cmdPlani].Amount)+parseFloat(this.newData[cmdReci].Amount)-parseFloat(this.newData[dmdi].Amount)
    // console.log('STOCKKKK : ',this.newData[cmdPlani])
    // var index = this.newData.findIndex(({TypeParams,ID,Month})=>TypeParams==='9- Planned Order Receipt' && ID === c && Month===check[0].month_rec)
   // var indexStock = this.newData.findIndex(({TypeParams,ID,Month})=>TypeParams==='7- Stock Réel' && ID === c && Month===check[0].month_rec)
    // this.newData[index].Amount = check[check.length-1].po_release
    //this.newData[indexStock].Amount = qte
    return {
      validated : true,
      po: check[check.length-1].po_release,
    }
  }else{
     return {
      validated : false,
      po: p,
    }
  }

}

exportCSV(filename = ''){

  var downloadLink;
  
  // Specify file name
  filename = filename?filename+'.csv':'excel_data.csv';
  
  // Create download link element
  downloadLink = document.createElement("a");
  
  document.body.appendChild(downloadLink);

  var data = this.newData
  var articleCodes = []
  var typeList = ['1- Prévision','2- Ventes','3- Commande Client','4- Demande Net','5- Demande','6- Commande Planifiée','7- Stock Réel','8- Besoin Net','9- Planned Order Receipt','a- Planner Order Release']
  var articlecode=''
  for(var i =0;i<data.length;i++){
    if(data[i].ID != articlecode){
      articleCodes.push(data[i].ID)
      articlecode = data[i].ID
    }
  }
  var code=''
  var article=''
  var typeparams =''
  var content='Codes,Articles,Type Data'
  for(var i =0;i<12;i++){
    content +=','+this.subHeaderData[i].Month
  }

  for(var j =0;j<articleCodes.length;j++){
    for(var k = 0;k<typeList.length;k++){
      var fil = this.newData.filter(({ID,TypeParams})=>ID===articleCodes[j] && TypeParams === typeList[k])
      for(var i =0;i<fil.length;i++){
        if(fil[i].ID == code && fil[i].TypeParams == typeparams){
          content += ","+fil[i].Amount;
        }else{
          content += "\n"+fil[i].ID+","+fil[i].Article+','+fil[i].TypeParams+","+fil[i].Amount;
          code = fil[i].ID
          typeparams = fil[i].TypeParams
        }
      }
    }
  }
  
  var csv = content
  
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
  } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  }

}

getNewdata(){
  var data = this.newData.filter(({TypeParams,ID})=>TypeParams==='6- Commande Planifiée' && ID === "170F")
  // this.newData.findIndex(({TypeParams,ID,Month})=>TypeParams==='6- Commande Planifiée' && ID === this.confirmData.ID && Month===dater)
  if(data){
    // console.log(data)
  }
}

}