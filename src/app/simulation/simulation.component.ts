import { Component, OnInit, ViewChild } from '@angular/core';
import { IDataOptions, IDataSet, PivotView,CellEditSettings  } from '@syncfusion/ej2-angular-pivotview';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { GridSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/gridsettings';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit {

   
  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + window.localStorage.getItem('ESP_access_token')
    })
  }

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getFamilleListe()
    this.getArticleDetailsPrev(1)
    console.log('liste des dates ',this.getDates())
  }

  FamilleListe: any
  getFamilleListe(){
    this.http.get<any>('http://localhost:8000/api/params', this.httpOptions).map(res => res).subscribe(data => {
      this.FamilleListe = data.familles
    }, err => {
      console.log(JSON.stringify(err));
    });
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
  uniqueArticles: any
  headerLoop: any

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

  currentPage: any = 1
  firstPage: any = 1
  lastPage: any = 1

nextPage(){
    if(this.currentPage<this.lastPage){
      this.currentPage = this.currentPage+1
      this.getArticleDetailsPrev(this.currentPage)
    }
  }

  prevPage(){
    if(this.currentPage>1){
      this.currentPage = this.currentPage-1
      this.getArticleDetailsPrev(this.currentPage)
    }
  }


  filterArticleName(code){
    var data = this.tableData.filter(({Code})=>Code === code)
    return data[0].Article
  }

  tableData: any = []
  filterArticle(codeID){
    var dataComp = this.tableData.filter(({code})=>code === codeID)
    var data = { 
      demandes : dataComp[0].demandes,
      prevMoy : dataComp[0].moyenneMobile,
      prevLissage :dataComp[0].lissage,
      prevReg : dataComp[0].regression,
      prevDecomp :dataComp[0].decomposition,
    }
    return data
  }

  toggleDetails(data){
    if(this.selectedCode == data){
      this.selectedCode = ''
    }else{
      this.selectedCode = data
    }
    
  }
  mad(demandes,previsions){
    var ecarts = 0
    if(previsions.length>0){
        for(var i=0;i<demandes.length;i++){
          ecarts = ecarts + Math.abs(parseFloat(demandes[i])-parseFloat(previsions[i]))
        }   
        return (ecarts/6).toFixed(2);  
    }else{
        ecarts = -1
        return NaN;
    }
  }

  tracksignal(demandes,previsions){
    var tracks = 0
    var mad: any = this.mad(demandes,previsions)
    
    if(previsions.length>0 && mad != NaN){
      for(var i=0;i<demandes.length;i++){
        var a: number = parseFloat(demandes[i])
        var b: number = parseFloat(previsions[i])
          tracks = tracks + ((a-b)/mad)
        }   
        return (tracks).toFixed(2);  
      }else{
        return NaN;
      }
}

bestMethode(code){
  var tSM,tSL,tSR,tSD
  tSM = this.tracksignal(this.filterArticle(code).demandes,this.filterArticle(code).prevMoy)
  tSL = this.tracksignal(this.filterArticle(code).demandes,this.filterArticle(code).prevLissage)
  tSR = this.tracksignal(this.filterArticle(code).demandes,this.filterArticle(code).prevReg)
  tSD = this.tracksignal(this.filterArticle(code).demandes,this.filterArticle(code).prevDecomp)
  var data = [
    {
      val:Math.abs(tSM),
      pr:'tsm'
    },
    {
      val:Math.abs(tSL),
      pr:'tsl',
    },
    {
      val:Math.abs(tSR),
      pr:'tsr',
    },
    {
      val:Math.abs(tSD),
      pr:'tsd',
    },
  ]
  var resulat = data.sort(function(a, b) {
      return a.val - b.val;
    });
  return resulat[0].pr
}

  getDates(){
    var d = new Date()
    var finDate,debutDate
    if(d.getMonth() == 0){
      finDate = (d.getFullYear()-1)+'/12/31'
    }else{
      finDate = d.getFullYear()+'/'+d.getMonth()+'/31'
    }

    if(d.getMonth() == 11){
      debutDate = d.getFullYear()+'/01/01'
    }else{
      debutDate = (d.getFullYear()-1)+'/'+(d.getMonth()+1)+'/01'
    }
    return {
      dateFin:finDate,
      dateDebut:debutDate
    }
  }

  confirm(idd,methode){
    let postData = new FormData();
    postData.append('id', idd);
    postData.append('methode', methode);
    console.log('liste des TABLEDATA',this.tableData)
    this.http.post<any>('http://localhost:8000/api/simulation/confirm',postData,this.httpOptions).map((res) => res).subscribe((data) => {
      var methode = data
      var index = this.tableData.findIndex(({id})=> id===idd)
      console.log('lindex est de ',index)
      this.tableData[index].methode = methode
      },(err) => {
             console.log(JSON.stringify(err));
           }
         );
  }

  dataLoading = true
  getDataWithFamille(){
    this.getArticleDetailsPrev(1)
  }

  dateData: any
  dateDataPeriode: any
  previsionData: any
  selectedCode: any = 0
  familleID: any = ''
  getArticleDetailsPrev(page){
    this.dataLoading = true
    this.dateData = []
    this.tableData = []
    var d = new Date();
    var onedeb = this.getDates().dateDebut;
    var onefin = this.getDates().dateFin;
    var fdeb = d.getFullYear() - 1 + '/01/01';
    var ffin = d.getFullYear() - 1 + '/12/31';
    var twodeb = d.getFullYear() - 2 + '/01/01';
    var twofin = d.getFullYear() - 2 + '/12/31';
    var threedeb = d.getFullYear() - 3 + '/01/01';
    var threefin = d.getFullYear() - 3 + '/12/31';
    let postData = new FormData();
    postData.append('dateDebut', onedeb);
    postData.append('dateFin', onefin);
    postData.append('dateDebut0', fdeb);
    postData.append('dateFin0', ffin);
    postData.append('dateDebut1',twodeb);
    postData.append('dateFin1', twofin);
    postData.append('dateDebut2', threedeb);
    postData.append('dateFin2', threefin);
    postData.append('familleid', this.familleID);
    postData.append('code', this.articleText);
    // postData.append('code','170F');
   this.http.post<any>('http://localhost:8000/api/simulation?page='+page,postData,this.httpOptions).map((res) => res).subscribe((data) => {
    this.lastPage = data.last_page
    this.currentPage = data.current_page
    this.dataLoading = false
   console.log('all Data :: ',data.data)
             
            //  this.lesMoisa = []
              this.previsionData = []
              this.getPeriodeRange(onedeb,onefin)
              console.log('range date ^^ ',this.getPeriodeRange(onedeb,onefin))
              for(var i =0;i<data.data.length;i++){
                const moy = this.getmoyenneMobile(data.data[i].commande_m)
                console.log('Data Demande ',i,data.data[i].commande_m)
                const lissage = this.getLissage(data.data[i].commande_m)
                const regression = this.getRegression(data.data[i].commande_m)
                const decomposition = this.getDecomposition(data.data[i].commandeone,data.data[i].commandetwo,data.data[i].commandethree)
                console.log('prevision Moyenne :: ${i}',moy)

                var periodeMois = this.periodeRange
                var dmd = []
                for(var j =0;j<periodeMois.length;j++){
                  var dm = data.data[i].commande_m.filter(({mois})=>mois === periodeMois[j])
                  if(dm.length>0){
                    dmd.push(parseFloat(dm[0].Sumventes))
                  }else{
                    dmd.push(0)
                  }
                }
                var finaldata = {
                  moyenneMobile : moy,
                  lissage : lissage,
                  regression : regression,
                  decomposition : decomposition,
                  article:data.data[i].designation,
                  code:data.data[i].code,
                  demandes:dmd.slice(6),
                  id:data.data[i].id,
                  methode:data.data[i].methode
                }
                this.tableData.push(finaldata)
                this.previsionData.push(finaldata)
              }

              console.log("TABLE PREVISION ",this.tableData)
              var s = this.periodeRange
              var periode = s.slice(6)
              var d = new Date()
              var y = d.getFullYear()
              if(periode[0]>7){
                var index = 13-periode[0]
                for(var i = 0;i<6;i++){
                  if(i == index){
                    this.dateData.push('0'+periode[i]+'-'+y)
                  }else{
                    if(periode[i]<9){
                      this.dateData.push('0'+periode[i]+'-'+(y-1))
                    }else{
                      this.dateData.push(periode[i]+'-'+(y-1))
                    }
                  }
                }
              }else{
                for(var i = 0;i<6;i++){
                  if(periode[i]<9){
                    this.dateData.push('0'+periode[i]+'-'+(y))
                  }else{
                    this.dateData.push(periode[i]+'-'+(y))
                  }
                }
              }
      
         },
           (err) => {
             console.log(JSON.stringify(err));
             this.dataLoading = false
           }
         );
     
  }


  periodeRange = []
  getPeriodeRange(dated,datef){
    var d = new Date()
    this.periodeRange = []

    for(var i = 0;i<12;i++){
      if(d.getMonth() == 11){
        //janvier
        this.periodeRange.push(1)
      }else{
        var s = (d.getMonth()+1)+i
        if(s>12){
          s = s-12
          this.periodeRange.push(s)
        }else{
          this.periodeRange.push(s)
        }
        
      }
    }

    console.log('this is the periode rnge : ',this.periodeRange)
  }

  liss = []
  lissageMobile(demandes) {
    var prevMoy = [];
    this.liss = []
    var periodeMois = this.periodeRange
    var dmd = []
    for(var i =0;i<periodeMois.length;i++){
      var dm = demandes.filter(({mois})=>mois === periodeMois[i])
      if(dm.length>0){
        dmd.push(parseFloat(dm[0].Sumventes))
      }else{
        dmd.push(0)
      }
    }
    for (var i = 0; i < periodeMois.length; i++) {
      if(i<3){
        var moy: any = (dmd[i] +dmd[i + 1] +dmd[i + 2]) /3;
        prevMoy.push(moy.toFixed(2));
      }else if(i == 3){
        var moy: any = (dmd[i] +dmd[i + 1] +dmd[i + 2]) /3;
        prevMoy.push(moy.toFixed(2));
        this.liss.push(moy.toFixed(2))
      }else if(i == 4){
        var moy: any = (dmd[i] +dmd[i + 1] + parseFloat(this.liss[0])) /3;
        prevMoy.push(moy.toFixed(2));
        this.liss.push(moy.toFixed(2))
      }else if(i == 5){
        var moy: any = (dmd[i] +parseFloat(this.liss[0]) + parseFloat(this.liss[1])) /3;
        prevMoy.push(moy.toFixed(2));
        this.liss.push(moy.toFixed(2))
      }
    }
    for(var i =0;i<3;i++){
      var o = (parseFloat(this.liss[i])+parseFloat(this.liss[i+1])+parseFloat(this.liss[i+2])) /3;
      this.liss.push(o.toFixed(2))
    }
    return prevMoy[2]
  }

  x2(x){
    var x2 =[]
    for(var i =0;i<x.length;i++){
      x2.push(x[i]*x[i])
    }
    return x2;
  }


  //PREVISITION FUNCTIONS HERE
  prevMoyenneMobiledetail = []
  getmoyenneMobile(demandes) {
    var prevMoy = [];
    this.prevMoyenneMobiledetail = []
    var periodeMois = this.periodeRange
    var dmd = []
    for(var i =0;i<periodeMois.length;i++){
      var dm = demandes.filter(({mois})=>mois === periodeMois[i])
      if(dm.length>0){
        dmd.push(parseFloat(dm[0].Sumventes))
      }else{
        dmd.push(0)
      }
    }
    console.log('data Demande final pour article :: ',dmd)
    for (var i = 0; i < (periodeMois.length-3); i++) {
      var moy: any = (dmd[i] +dmd[i + 1] +dmd[i + 2]) /3;
      if(moy<0){
        prevMoy.push(0);
      }else{
        prevMoy.push(Math.round(moy));
      }
    }
    const prevision = prevMoy.slice(3);
    this.prevMoyenneMobiledetail = prevision
    return this.prevMoyenneMobiledetail
  }

  getmoyenneMobileLiss(demandes) {
    var prevMoy = [];
    var periodeMois = this.periodeRange
    var dmd = []
    for(var i =0;i<periodeMois.length;i++){
      var dm = demandes.filter(({mois})=>mois === periodeMois[i])
      if(dm.length>0){
        dmd.push(parseFloat(dm[0].Sumventes))
      }else{
        dmd.push(0)
      }
    }
    console.log('data Demande final pour article :: ',dmd)
    for (var i = 0; i < (periodeMois.length-3); i++) {
      var moy: any = (dmd[i] +dmd[i + 1] +dmd[i + 2]) /3;
      if(moy<0){
        prevMoy.push(0);
      }else{
        prevMoy.push(Math.round(moy));
      }
    }
     return prevMoy
  }


  selectedAlpha = 0.4
  getLissage(demandes) {
    var lissageList = []
    var periodeMois = this.periodeRange
    var dmd = []
    for(var i =0;i<periodeMois.length;i++){
      var dm = demandes.filter(({mois})=>mois === periodeMois[i])
      if(dm.length>0){
        dmd.push(parseFloat(dm[0].Sumventes))
      }else{
        dmd.push(0)
      }
    }
    var dmds = dmd.slice(5)
    var prevMoy = this.getmoyenneMobileLiss(demandes).slice(2)
    // var prevision = this.lissageMobile(demandes)
    console.log('LISSAGE :: ',dmds,prevMoy)
    for(var i=0;i<6;i++){
      var lissage = (this.selectedAlpha*dmds[i])+(1-this.selectedAlpha)*parseFloat(prevMoy[i])
      if(lissage<0){
        lissageList.push(0)
      }else{
        lissageList.push(Math.round(lissage))
      }
    }
    return lissageList
  }

  getRegression(demandes) {
    var regression = []

    var x = this.periodeRange.slice(0,6)
    // console.log('this is x : ',x)
    var x2 = this.x2(x)
    // var y =[600,1550,1500,1500,2400,3100]
   
    var y = []
    for(var i =0;i<x.length;i++){
      var dm = demandes.filter(({mois})=>mois === x[i])
      if(dm.length>0){
        y.push(parseFloat(dm[0].Sumventes))
      }else{
        y.push(0)
      }
    }
    var xy= []
    for(var i=0;i<x.length;i++){ xy.push(x[i]*y[i]) }
    //Moyenne X et Y et XY
    var sumX = 0
    var sumY = 0
    var sumXY = 0
    var sumX2 = 0
    for(var i=0;i<x.length;i++){ sumX = sumX + x[i] }
    for(var i=0;i<y.length;i++){ sumY = sumY + y[i] }
    for(var i=0;i<xy.length;i++){ sumXY = sumXY + xy[i] }
    for(var i=0;i<x2.length;i++){ sumX2 = sumX2 + x2[i] }

    var moyX = sumX/6  //Moyenne de X
    var moyY = sumY/6   //Moyenne de Y
    var moyXY = sumXY/6   //Moyenne de XY
    var moyX2 = sumX2/6   //Moyenne de XY
    console.log('date X ,Y ,XY',x,y,xy)
    var tXY = moyXY - (moyX*moyY)
    var tX2 = moyX2 -(moyX*moyX)

    var a = tXY/tX2
    var b = moyY-(a*moyX)
    var dateRest = this.periodeRange.slice(6)
    console.log('date REST et de ',a,b,dateRest)
    for(var i = 0;i<6;i++){
      var lastMonth = dateRest[i]
      var res = (lastMonth*a) + b
      if(res<0){
        regression.push(0)
      }else{
        regression.push(Math.round(res))
      }
      
    }
    
    return regression
  }

  
  getDecomposition(x,y,z){
    var indices
    var an1
    var an2
    var an3
    if(x.length>0){ an1 = this.getTrsData(x) }else{ an1 = [0,0,0,0] }
    if(y.length>0){ an2 = this.getTrsData(y) }else{ an2 = [0,0,0,0] }
    if(z.length>0){ an3 = this.getTrsData(z) }else{ an3 = [0,0,0,0] } 

    var desain = []

    indices = this.indiceSaisonalite(an1,an2,an3)
    console.log('voivi la liste des indices : ',indices) //Done

    var periodeMois = this.periodeRange
    // console.log(periodes);
    var dmd = []
    console.log(x)
    for(var i =1;i<=12;i++){
      var dm = x.filter(({mois})=>mois === i)
      if(dm.length>0){
        if(dm[0].mois == 1 || dm[0].mois == 5 || dm[0].mois == 9){
          dmd.push(parseFloat(dm[0].Sumventes)/indices.is1)
        }else  if(dm[0].mois == 2 || dm[0].mois == 6 || dm[0].mois == 10){
          dmd.push(parseFloat(dm[0].Sumventes)/indices.is2)
        }else  if(dm[0].mois == 3 || dm[0].mois == 7 || dm[0].mois == 11){
          dmd.push(parseFloat(dm[0].Sumventes)/indices.is3)
        }else{
          dmd.push(parseFloat(dm[0].Sumventes)/indices.is4)
        }       
      }else{
        dmd.push(0)
      }
    }
    //Done
    console.log('LISTE DMD INDICE ::: ',dmd)

    // console.log('voici la liste des demanded desai ',dmd)
    var equation = this.regressionSaison(dmd)
    console.log('voici l équation : ',equation)

    var data = []
    for(var i=0;i<12;i++){
      var d = 13+i
      var res = (d*equation.a) + equation.b
      if(res<0){
        data.push(0)
      }else{
        data.push(Math.round(res))
      }
      
    }
    console.log('DECOMPOSITION :::: ',data)
    var firstMonth = this.periodeRange.slice(6)
    console.log(this.periodeRange)
    console.log(data.slice(firstMonth[0]-1,firstMonth[0]+5))

    return data.slice(firstMonth[0]-1,firstMonth[0]+5)
    
  }


  getTrsData(data){
    var an = [0,0,0,0]
    for(var i =0;i<data.length;i++){
      if(data[i].mois>=1 && data[i].mois<4){
        an[0] = an[0]+parseFloat(data[i].Sumventes)
      }else  if(data[i].mois>=4 && data[i].mois<7){
        an[1] = an[1]+parseFloat(data[i].Sumventes)
      }else  if(data[i].mois>=7 && data[i].mois<10){
        an[2] = an[2]+parseFloat(data[i].Sumventes)
      }else  if(data[i].mois>=10){
        an[3] = an[3]+parseFloat(data[i].Sumventes)
      }
    }
    return an
  }

  indiceSaisonalite(an1,an2,an3){
    var moyTr1 = (an1[0]+an2[0]+an3[0])/3
    var moyTr2 = (an1[1]+an2[1]+an3[1])/3
    var moyTr3 = (an1[2]+an2[2]+an3[2])/3
    var moyTr4 = (an1[3]+an2[3]+an3[3])/3 
  
    var moyTrSum = (moyTr1+moyTr2+moyTr3+moyTr4)
    var moyTrSumMoy = moyTrSum/4
  
    //Calcul analytique
    var isTr1 = moyTr1/moyTrSumMoy 
    var isTr2 = moyTr2/moyTrSumMoy 
    var isTr3 = moyTr3/moyTrSumMoy 
    var isTr4 = moyTr4/moyTrSumMoy 
  
    return {is1:isTr1,is2:isTr2,is3:isTr3,is4:isTr4}
  }

  regressionSaison(demandes){
    var x = [1,2,3,4,5,6,7,8,9,10,11,12]
    // console.log('this is x : ',x)
    var x2 = this.x2(x)
    // var y =[600,1550,1500,1500,2400,3100]
    
    var y = demandes
    var xy= []
    for(var i=0;i<x.length;i++){ xy.push(x[i]*y[i]) }
    //Moyenne X et Y et XY
    var sumX = 0
    var sumY = 0
    var sumXY = 0
    var sumX2 = 0
    for(var i=0;i<x.length;i++){ sumX = sumX + x[i] }
    for(var i=0;i<y.length;i++){ sumY = sumY + y[i] }
    for(var i=0;i<xy.length;i++){ sumXY = sumXY + xy[i] }
    for(var i=0;i<x2.length;i++){ sumX2 = sumX2 + x2[i] }

    var moyX = sumX/12  //Moyenne de X
    var moyY = sumY/12  //Moyenne de Y
    var moyXY = sumXY/12   //Moyenne de XY
    var moyX2 = sumX2/12   //Moyenne de XY

    var tXY = moyXY - (moyX*moyY)
    var tX2 = moyX2 -(moyX*moyX)

    var a = tXY/tX2
    var b = moyY-(a*moyX)

    return {a:a,b:b}
  }


  exportCSV(filename = ''){

    var downloadLink;
    
    // Specify file name
    filename = filename?filename+'.csv':'excel_data.csv';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
  
    var content='Codes;Articles;Type Data'
    for(var i =0;i<6;i++){
      content +=';'+this.dateData[i]
    }
    content += ';MAD;Tracking Signal\n'

    for(var i=0;i<this.tableData.length;i++){
      content += this.tableData[i].code+';'+this.tableData[i].article+';Ventes;'
      for(var k =0;k<6;k++){
        content +=  this.tableData[i].demandes[k]+';'
      }
      content += 'X;X\n'
      content += this.tableData[i].code+';'+this.tableData[i].article+';Prévisions Moyenne Mobile;'
      for(var k =0;k<6;k++){
        content +=  this.tableData[i].moyenneMobile[k]+';'
      }
      content += this.mad(this.tableData[i].demandes,this.tableData[i].moyenneMobile)+';'+this.tracksignal(this.tableData[i].demandes,this.tableData[i].moyenneMobile)+'\n'
      content += this.tableData[i].code+';'+this.tableData[i].article+';Prévisions Lissage Exponentiel;'
      for(var k =0;k<6;k++){
       
        content +=  this.tableData[i].lissage[k]+';'
      }
      content += this.mad(this.tableData[i].demandes,this.tableData[i].lissage)+';'+this.tracksignal(this.tableData[i].demandes,this.tableData[i].lissage)+'\n'
      content += this.tableData[i].code+';'+this.tableData[i].article+';Prévisions Régression Linéaire;'
      for(var k =0;k<6;k++){
        
        content +=  this.tableData[i].regression[k]+';'
      }
      content += this.mad(this.tableData[i].demandes,this.tableData[i].regression)+';'+this.tracksignal(this.tableData[i].demandes,this.tableData[i].regression)+'\n'
      content += this.tableData[i].code+';'+this.tableData[i].article+';Prévisions Décomposition;'
      for(var k =0;k<6;k++){
        
        content +=  this.tableData[i].decomposition[k]+';'
      }
      content += this.mad(this.tableData[i].demandes,this.tableData[i].decomposition)+';'+this.tracksignal(this.tableData[i].demandes,this.tableData[i].decomposition)+'\n'
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

  export(){
    var content='Codes;Articles;Type Data'
    for(var i =0;i<6;i++){
      content +=';'+this.dateData
    }
    content += ';MAD;Tracking Signal\n'

    for(var i=0;i<this.tableData.length;i++){
      content += this.tableData[i].code+';'+this.tableData[i].article+';'
      for(var k =0;k<6;k++){
        content +=  this.tableData[i].demandes[k]+';'
      }
      content += +'X;X\n'
      for(var k =0;k<6;k++){
        content +=  this.tableData[i].prevMoy[k]+';'
      }
      content += this.mad(this.tableData[i].demandes,this.tableData[i].prevMoy)+';'+this.tracksignal(this.tableData[i].demandes,this.tableData[i].prevMoy)+'\n'
      for(var k =0;k<6;k++){
        content +=  this.tableData[i].prevLissage[k]+';'
      }
      content += this.mad(this.tableData[i].demandes,this.tableData[i].prevLissage)+';'+this.tracksignal(this.tableData[i].demandes,this.tableData[i].prevLissage)+'\n'
      for(var k =0;k<6;k++){
        content +=  this.tableData[i].PrevReg[k]+';'
      }
      content += this.mad(this.tableData[i].demandes,this.tableData[i].prevReg)+';'+this.tracksignal(this.tableData[i].demandes,this.tableData[i].prevReg)+'\n'
      for(var k =0;k<6;k++){
        content +=  this.tableData[i].prevDecomp[k]+';'
      }
      content += this.mad(this.tableData[i].demandes,this.tableData[i].prevDecomp)+';'+this.tracksignal(this.tableData[i].demandes,this.tableData[i].prevDecomp)+'\n'
    }
  }
}
