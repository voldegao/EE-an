import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  PageSettingsModel,
  GridComponent,
} from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { reduce } from 'rxjs/operators';
import { ChartComponent} from '@syncfusion/ej2-angular-charts';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-prev-statistique',
  templateUrl: './prev-statistique.component.html',
  styleUrls: ['./prev-statistique.component.scss'],
})
export class PrevStatistiqueComponent implements OnInit {
  dateDebut = '2021-01-01';
  dateFin = '2021-06-30';
  currentpage = 1;
  pagecount = 1;
  pagesize = 10;

  httpOptions = {
    headers: new HttpHeaders({
      Authorization:
        'Bearer ' + window.localStorage.getItem('ESP_access_token'),
    }),
  };

  familleFiltere: any = ''
  Filtrer(){
    this.getdataFamilleSai(1);
  }

  public data: any;
  public dataFamille: any;
  public dataFamilleLastYear: any;
  public dataFamilleBeforeLastYear: any;
  public pageSettings: PageSettingsModel;
  public ans1;
  public ans2;
  public ans3;
  periodeMois = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Décembre']
  prevMoy: any;


  codeFilter = ""
  articleFilter = ""
  zoneFilter = ""
  familleFilter = ""
  clientFilter = ""
  classeFilter = ""
  stratFilter = ""
  datedFilter = ""
  datefFilter = ""

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


  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('grido')
  public grido: GridComponent;

  @ViewChild('articlesMAD')
  public articlesMAD: DialogComponent;
  public headera: string = 'Prévision Statistique';
  public showCloseIcona: Boolean = true;
  public widtha: string = '85%';
  public heighta: string = '75%';
  public targeta: string = '.control-section';
  articlesData: any;
  familleName: any;
  loadID: any = 0

  // Chart Variables
  public primaryXAxis: any;
  public chartData: any;
  public chartData2: any;
  public chartData3: any;
  public chartData4: any;
  public chartData5: any;
  public chartData6: any;
  public chartData7: any;
  public chartData8: any;
  public chartData9: any;
  public chartData10: any;
  public chartData11: any;
  public marker: Object = { visible: true, height: 10, width: 10 };
  public tooltip: Object = { enable: true };
  selectedCode: any;

selectedAlpha = 0.7
 getAlpha(){
   this.http.get<any>('http://stepup.ma/espace-equipement-api/api/alpha',this.httpOptions).map((res) => res).subscribe((data) => {
          this.selectedAlpha = data[0].alpha;
      },
        (err) => {
          console.log(JSON.stringify(err));
        }
      );
 }

validateAlpha(){
  // console.log('lissage alpha ',this.selectedAlpha)
  this.changeAlpha()
  this.getdataFamilleSai(1);
}

 changeAlpha(){
  let postData = new FormData();
    postData.append('alpha', this.selectedAlpha.toString());
     this.http.post<any>('http://stepup.ma/espace-equipement-api/api/alpha/edit',postData,this.httpOptions).map((res) => res).subscribe((data) => {
         this.selectedAlpha = data;
      },
        (err) => {
          console.log(JSON.stringify(err));
        }
      );

 }
 
  //Modal Variables
  @ViewChild('Dialog')
  public Dialog: DialogComponent;
  public header: string = 'Prévision Statistique';
  public showCloseIcon: Boolean = true;
  public width: string = '1200';
  public height: string = '88%';
  public target: string = '.control-section';
  public BtnClick = (): void => {
    this.Dialog.show();
  };

  constructor(private http: HttpClient) {}
  public initialPage: Object;

  toolbar: string[]
  ngOnInit(): void {
    this.toolbar = ['Search'];
    if (!window.localStorage.getItem('logged')) {
      window.location.href = "#/login";
    } 
     this.initialPage = { pageSizes: true, pageCount: 4 };
     this.getAlpha()
     this.getArticleCounts()
    this.getdataFamilleSai(1);
    this.chartData2 = [
      { month: 'Jan', moyenneMobile: 0 }, { month: 'Fev', moyenneMobile: 0 },
      { month: 'Mar', moyenneMobile: 0 }, { month: 'Avr', moyenneMobile: 0 },
      { month: 'Mai', moyenneMobile: 0 }, { month: 'Jui', moyenneMobile: 0 },
      { month: 'Jul', moyenneMobile: 0 }, { month: 'Aout', moyenneMobile: 0 },
      { month: 'Sep', moyenneMobile: 0 }, { month: 'Oct', moyenneMobile: 0 },
      { month: 'Nov', moyenneMobile: 0 }, { month: 'Dec', moyenneMobile: 0 }
]
this.primaryXAxis = {valueType: 'Category'};
  }

  @ViewChild('choix')
  public choix: ChartComponent;
  public title: string = 'Sales Comparision';
  public refreshdata(): void {
    this.choix.series[0].dataSource = this.chartData2
    this.choix.refresh();
  }

  periodeRange = []
  getPeriodeRange(dated,datef){
    this.periodeRange = []
    var d = new Date(dated)
    var firstMonth = d.getMonth()+1
    var f = new Date(datef)
    var lastMonth = f.getMonth()+1
    for(var i =0;i<lastMonth;i++){
      this.periodeRange.push(firstMonth+i)
    }
    // console.log('this is the periode rnge : ',this.periodeRange)
  }
  //Partie Modification hamza

  dataLoading = true
  getdataFamilleSai(id){
    this.dataLoading = true
    var d = new Date();
    var onedeb = d.getFullYear()+ '/03/01';
    var onefin = d.getFullYear()+ '/08/31';
    var tdeb = d.getFullYear() - 1 + '/01/01';
    var tfin = d.getFullYear() - 1 + '/12/31';
    var twodeb = d.getFullYear() - 2 + '/01/01';
    var twofin = d.getFullYear() - 2 + '/12/31';
    var threedeb = d.getFullYear() - 3 + '/01/01';
    var threefin = d.getFullYear() - 3 + '/12/31';
    let postData = new FormData();
    
    postData.append('dateDebut', onedeb);
    postData.append('dateFin', onefin);
    postData.append('dateDebut0',tdeb);
    postData.append('dateFin0', tfin);
    postData.append('dateDebut1',twodeb);
    postData.append('dateFin1', twofin);
    postData.append('dateDebut2', threedeb);
    postData.append('dateFin2', threefin);
    postData.append('famille', this.familleFiltere);
    this.http.post<any>('http://stepup.ma/espace-equipement-api/api/mMobile?page=' + id,postData,this.httpOptions).map((res) => res).subscribe((data) => {
          this.dataFamille = data;
          this.dataLoading = false
          var an1 = data
          this.getPeriodeRange(onedeb,onefin)
      },
        (err) => {
          this.dataLoading = false
          console.log(JSON.stringify(err));
        }
      );
  }

  getLastPrevDate(){
    var d = new Date()
    var month = d.getMonth()+1
    var lstMonth: any = month+11
    if(lstMonth>12){
      lstMonth = lstMonth-12
      if(lstMonth<10){
        lstMonth = '0'+lstMonth
        return (d.getFullYear()+1)+'-'+lstMonth+'-01'
      }else{
        return (d.getFullYear()+1)+'-'+lstMonth+'-01'
      }
    }else{
      return (d.getFullYear())+'-'+lstMonth+'-01'
    }
  }

  articlesNPids: any = []
  prevStatutFamille(data){
    // console.log('last date ',this.getLastPrevDate())
    var articles = data.articles //liste of all familly articles
   
    var publishedArt = 0
    var nonpublishedArt = 0
    var ids = []
    var validArticle = []
    for(var i=0;i<articles.length;i++){
      if(articles[i].lastprevision.length >0){
        validArticle.push(articles[i])
      }
    }
    var countArticle = validArticle.length //Count of all Familly articles
    for(var i =0;i<validArticle.length;i++){
      var lastPrev = validArticle[i].lastprevision[0]
      if(lastPrev){
        if(lastPrev.date == this.getLastPrevDate()){
          publishedArt = publishedArt+1
        }else{
          nonpublishedArt = nonpublishedArt+1
           ids.push(validArticle[i].id)
        }
      }else{
        nonpublishedArt = nonpublishedArt+1
         ids.push(validArticle[i].id)
      }
     
    }
    var allArticlePublished = false
    // console.log('okEEEEEEyyyyy ',this.articleCounts[0][data.id])
    // console.log('data ',data)
    if(this.articleCounts[0][data.id] == publishedArt){
      allArticlePublished = true
    }

    var result =  {
      published : allArticlePublished,
      articlePublished: publishedArt,
      articleNotPublished: nonpublishedArt,
      articles:countArticle
    }
    // console.log('Pubished status :: ',result)
    this.articlesNPids.push(ids)
    return result
  }

  articlesNPids2: any = []
  prevStatutFamille2(data){
    var articles = data.articles //liste of all familly articles
    var countArticle =articles.length //Count of all Familly articles
    var publishedArt = 0
    var nonpublishedArt = 0
    var ids = []
    for(var i =0;i<articles.length;i++){
      var lastPrev = articles[i].lastprevision[0]
      if(lastPrev){
        if(lastPrev.date == this.getLastPrevDate()){
          publishedArt = publishedArt+1
        }else{
          nonpublishedArt = nonpublishedArt+1
           ids.push(articles[i].id)
        }
      }else{
        nonpublishedArt = nonpublishedArt+1
         ids.push(articles[i].id)
      }
     
    }
    var allArticlePublished = false
    if(countArticle == publishedArt){
      allArticlePublished = true
    }

    var result =  {
      published : allArticlePublished,
      articlePublished: publishedArt,
      articleNotPublished: nonpublishedArt,
      articles:countArticle
    }
    this.articlesNPids2.push(ids)
    return result
  }

getIDS(){
  // console.log('llllll ',this.articlesNPids)
}



  //Detail popup Famille
  dataFamilleMoyenne: any
  dataFamilleLissage: any
  dataFamilleRegression: any
  dataFamilleDecomposition: any
  demandesChart: any
  lesMois: any
  getdataFamilleDetail(){
    var d = new Date();
    var onedeb = d.getFullYear()+ '/03/01';
    var onefin = d.getFullYear()+ '/08/31';
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
    postData.append('famille', this.currentFamile);
    // postData.append('famille', '2');
    this.http.post<any>('http://stepup.ma/espace-equipement-api/api/mMobile?page=1',postData,this.httpOptions).map((res) => res).subscribe((data) => {
      this.dataLoadingChart = false
      this.lesMois = []
          this.dataFamilleMoyenne = this.getmoyenneMobile(data[0].commande_m) //done
          this.demandesChart = this.getdemandes(data[0].commande_m) //done
          this.dataFamilleLissage = this.getLissage(data[0].commande_m) //done
          this.dataFamilleRegression= this.getRegression(data[0].commande_m) //done
          this.dataFamilleDecomposition= this.getDecomposition(data[0].commandeone,data[0].commandetwo,data[0].commandethree) //done
          // console.log('*******')
          // console.log('decompo :: ',this.dataFamilleDecomposition)
          this.getPeriodeRange(onedeb,onefin)
          var mMobile: any = []
          var lissage: any = []
          var regression: any = []
          var decomposition: any = []
          var demandes: any = []
         

          mMobile.push({ month: this.periodeMois[this.periodeRange.length-1], moyenneMobile: parseFloat(this.demandesChart[5]) })
          lissage.push({ month: this.periodeMois[this.periodeRange.length-1], lissage: parseFloat(this.demandesChart[5]) })
          regression.push({ month: this.periodeMois[this.periodeRange.length-1], regression: parseFloat(this.demandesChart[5]) })
          decomposition.push({ month: this.periodeMois[this.periodeRange.length-1], decomposition: parseFloat(this.demandesChart[5]) })

          for(var i=0;i<6;i++){
            demandes.push({ month: this.periodeMois[this.periodeRange[i]-1], commande: parseFloat(this.demandesChart[i]) })
          }
          
          for(var i =0;i<6;i++){
            // console.log(this.periodeMois[this.periodeRange.length+i])
          
            if(this.periodeRange.length+i>11){
              mMobile.push({ month: this.periodeMois[this.periodeRange.length+i-12]+' *', moyenneMobile: parseFloat(this.dataFamilleMoyenne[i]) })
              lissage.push({ month: this.periodeMois[this.periodeRange.length+i-12]+' *', lissage: parseFloat(this.dataFamilleLissage[i]) })
              regression.push({ month: this.periodeMois[this.periodeRange.length+i-12]+' *', regression: parseFloat(this.dataFamilleRegression[i]) })
              decomposition.push({ month: this.periodeMois[this.periodeRange.length+i-12]+' *', decomposition: parseFloat(this.dataFamilleDecomposition[i]) })
              this.lesMois.push(this.periodeMois[this.periodeRange.length+i-12])
            }else{
              mMobile.push({ month: this.periodeMois[this.periodeRange.length+i], moyenneMobile: parseFloat(this.dataFamilleMoyenne[i]) })
              lissage.push({ month: this.periodeMois[this.periodeRange.length+i], lissage: parseFloat(this.dataFamilleLissage[i]) })
              regression.push({ month: this.periodeMois[this.periodeRange.length+i], regression: parseFloat(this.dataFamilleRegression[i]) })
              decomposition.push({ month: this.periodeMois[this.periodeRange.length+i], decomposition: parseFloat(this.dataFamilleDecomposition[i]) })
             
              this.lesMois.push(this.periodeMois[this.periodeRange.length+i])
            }
           
            // console.log(data)
            // this.chartData2[this.periodeRange[i]-1].moyenneMobile= this.dataFamilleMoyenne[i]
          }
          // console.log('######')
          // console.log('liste des mois :: ',this.lesMois)
          // console.log('liste periodeMois :: ',this.periodeMois)
          // console.log('liste periodeRange :: ',this.periodeRange)
          // console.log('######')
          // console.log('this is the mobile data array : ',mMobile)
          this.choix.series[0].dataSource = demandes
          this.choix.series[1].dataSource = mMobile
          this.choix.series[2].dataSource = lissage
          this.choix.series[3].dataSource = regression
          this.choix.series[4].dataSource = decomposition
         
          // console.log(data):
          this.choix.refresh();
          
      },
        (err) => {
          console.log(JSON.stringify(err));
          this.dataLoadingChart = false
        }
      );
  }

  getdemandes(demandes){
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
    // console.log('##### Demandes #####')
    // console.log('periode : ',periodeMois)
    // console.log(dmd)
    return dmd
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
    // console.log('voivi la liste des indices : ',indices)

    var periodeMois = this.periodeRange
    // console.log(periodes);
    var dmd = []
    for(var i =0;i<periodeMois.length;i++){
      var dm = x.filter(({mois})=>mois === periodeMois[i])
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

    // console.log('voici la liste des demanded desai ',dmd)
    var equation = this.regressionSaison(dmd)
    // console.log('voici l équation : ',equation)

    var data = []
    for(var i=0;i<6;i++){
      var d = this.periodeRange[this.periodeRange.length-1]+1+i
      var res = (d*equation.a) + equation.b
      if(res<0){
        data.push(0)
      }else{
        data.push(Math.round(res))
      }
      
    }
    return data
    
  }

  getDecompositionMaster(x,y,z){
    var indices
    var an1
    var an2
    var an3
    if(x.length>0){ an1 = this.getTrsData(x) }else{ an1 = [0,0,0,0] }
    if(y.length>0){ an2 = this.getTrsData(y) }else{ an2 = [0,0,0,0] }
    if(z.length>0){ an3 = this.getTrsData(z) }else{ an3 = [0,0,0,0] } 

    var desain = []

    indices = this.indiceSaisonalite(an1,an2,an3)
    // console.log('voivi la liste des indices : ',indices)

    var periodeMois = this.periodeRange
    // console.log(periodes);
    var dmd = []
    for(var i =0;i<periodeMois.length;i++){
      var dm = x.filter(({mois})=>mois === periodeMois[i])
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

    // console.log('voici la liste des demanded desai ',dmd)
    var equation = this.regressionSaison(dmd)
    // console.log('voici l équation : ',equation)

    var data = []
    for(var i=0;i<12;i++){
      var d = this.periodeRange[this.periodeRange.length-1]+1+i
      var res = (d*equation.a) + equation.b
      if(res<0){
        data.push(0)
      }else{
        data.push(Math.round(res))
      }
      
    }
    return data
    
  }

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
    for (var i = 0; i < periodeMois.length; i++) {
      if(i<3){
        var moy: any = (dmd[i] +dmd[i + 1] +dmd[i + 2]) /3;
        if(moy<0){
          prevMoy.push(0);
        }else{
          prevMoy.push(Math.round(moy));
        }
        
      }else if(i == 3){
        var moy: any = (dmd[i] +dmd[i + 1] +dmd[i + 2]) /3;
        if(moy<0){
          prevMoy.push(0);
          this.prevMoyenneMobiledetail.push(0)
        }else{
          prevMoy.push(Math.round(moy));
          this.prevMoyenneMobiledetail.push(Math.round(moy))
        }
        
      }else if(i == 4){
        var moy: any = (dmd[i] +dmd[i + 1] + parseFloat(this.prevMoyenneMobiledetail[0])) /3;
        if(moy<0){
          prevMoy.push(0);
          this.prevMoyenneMobiledetail.push(0)
        }else{
          prevMoy.push(Math.round(moy));
          this.prevMoyenneMobiledetail.push(Math.round(moy))
        }
      }else if(i == 5){
        var moy: any = (dmd[i] +parseFloat(this.prevMoyenneMobiledetail[0]) + parseFloat(this.prevMoyenneMobiledetail[1])) /3;
        if(moy<0){
          prevMoy.push(0);
          this.prevMoyenneMobiledetail.push(0)
        }else{
          prevMoy.push(Math.round(moy));
          this.prevMoyenneMobiledetail.push(Math.round(moy))
        }
      }
    }
    for(var i =0;i<3;i++){
      var o = (parseFloat(this.prevMoyenneMobiledetail[i])+parseFloat(this.prevMoyenneMobiledetail[i+1])+parseFloat(this.prevMoyenneMobiledetail[i+2])) /3;
      if(o<0){
        this.prevMoyenneMobiledetail.push(0)
      }else{
        this.prevMoyenneMobiledetail.push(Math.round(o))
      }
    }
    return this.prevMoyenneMobiledetail
  }

  
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
    var prevision = this.lissageMobile(demandes)
    var lissage = (this.selectedAlpha*dmd[5])+(1-this.selectedAlpha)*parseFloat(prevision)
    if(lissage<0){
      lissageList.push(0)
    }else{
      lissageList.push(Math.round(lissage))
    }
    
    for(var i=0;i<5;i++){
      if(i==0){
        var res: any = ((dmd[4]+dmd[5]+lissageList[0])/3).toFixed(2)
        if(res<0){
          lissageList.push(0)
        }else{
          lissageList.push(Math.round(res))
        }
      }else if(i == 1){
        var res: any = ((dmd[5]+parseFloat(lissageList[0])+parseFloat(lissageList[1]))/3).toFixed(2)
        if(res<0){
          lissageList.push(0)
        }else{
          lissageList.push(Math.round(res))
        }
      }else{
        var res: any = ((parseFloat(lissageList[i-2])+parseFloat(lissageList[i-1])+parseFloat(lissageList[i]))/3).toFixed(2)
        if(res<0){
          lissageList.push(0)
        }else{
          lissageList.push(Math.round(res))
        }
      }
    }
    return lissageList
  }

  getmoyenneMobileMaster(demandes) {
    var prevMoy = [];
    var prevMoyenneMobiledetail = []
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
        if(moy<0){
          prevMoy.push(0);
        }else{
          prevMoy.push(Math.round(moy));
        }
        
      }else if(i == 3){
        var moy: any = (dmd[i] +dmd[i + 1] +dmd[i + 2]) /3;
        if(moy<0){
          prevMoy.push(0);
          prevMoyenneMobiledetail.push(0)
        }else{
          prevMoy.push(Math.round(moy));
          prevMoyenneMobiledetail.push(Math.round(moy))
        }
        
      }else if(i == 4){
        var moy: any = (dmd[i] +dmd[i + 1] + parseFloat(prevMoyenneMobiledetail[0])) /3;
        if(moy<0){
          prevMoy.push(0);
          prevMoyenneMobiledetail.push(0)
        }else{
          prevMoy.push(Math.round(moy));
          prevMoyenneMobiledetail.push(Math.round(moy))
        }
      }else if(i == 5){
        var moy: any = (dmd[i] +parseFloat(prevMoyenneMobiledetail[0]) + parseFloat(prevMoyenneMobiledetail[1])) /3;
        if(moy<0){
          prevMoy.push(0);
          prevMoyenneMobiledetail.push(0)
        }else{
          prevMoy.push(Math.round(moy));
          prevMoyenneMobiledetail.push(Math.round(moy))
        }
      }
    }
    for(var i =0;i<9;i++){
      var o = (parseFloat(prevMoyenneMobiledetail[i])+parseFloat(prevMoyenneMobiledetail[i+1])+parseFloat(prevMoyenneMobiledetail[i+2])) /3;
      if(o<0){
        prevMoyenneMobiledetail.push(0)
      }else{
        prevMoyenneMobiledetail.push(Math.round(o))
      }
    }
    return prevMoyenneMobiledetail
  }

  getLissageMaster(demandes): any {
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
    // console.log('****####****')
    // console.log('liste des demandes :: ',dmd)
    // console.log('et la periode de mois est de : ',periodeMois)
    var prevision = this.lissageMobile(demandes)
    // console.log('---*****--- le mois en cours pour le Master Scheculing ',prevision)
    var firstValue = Math.round(parseFloat(prevision))
    lissageList.push(firstValue)
    var lissage = (this.selectedAlpha*dmd[5])+(1-this.selectedAlpha)*parseFloat(prevision)
    if(lissage<0){
      lissageList.push(0)
    }else{
      lissageList.push(Math.round(lissage))
    }
    for(var i=0;i<10;i++){
      if(i==0){
        var res: any = ((dmd[4]+dmd[5]+lissageList[1])/3).toFixed(2)
        if(res<0){
          lissageList.push(0)
        }else{
          lissageList.push(Math.round(res))
        }
      }else if(i == 1){
        var res: any = ((dmd[5]+parseFloat(lissageList[1])+parseFloat(lissageList[2]))/3).toFixed(2)
        if(res<0){
          lissageList.push(0)
        }else{
          lissageList.push(Math.round(res))
        }
      }else{
        var res: any = ((parseFloat(lissageList[i-1])+parseFloat(lissageList[i])+parseFloat(lissageList[i+1]))/3).toFixed(2)
        if(res<0){
          lissageList.push(0)
        }else{
          lissageList.push(Math.round(res))
        }
      }
    }
    return lissageList
  }


  getRegression(demandes) {
    var regression = []

    var x = this.periodeRange
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

    var tXY = moyXY - (moyX*moyY)
    var tX2 = moyX2 -(moyX*moyX)

    var a = tXY/tX2
    var b = moyY-(a*moyX)
    for(var i = 1;i<=6;i++){
      var lastMonth = this.periodeRange[this.periodeRange.length-1]+i
      var res = (lastMonth*a) + b
      if(res<0){
        regression.push(0)
      }else{
        regression.push(Math.round(res))
      }
      
    }
    
    return regression
  }

  getRegressionMaster(demandes) {
    var regression = []

    var x = this.periodeRange
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

    var tXY = moyXY - (moyX*moyY)
    var tX2 = moyX2 -(moyX*moyX)

    var a = tXY/tX2
    var b = moyY-(a*moyX)
    for(var i = 1;i<=12;i++){
      var lastMonth = this.periodeRange[this.periodeRange.length-1]+i
      var res = (lastMonth*a) + b
      if(res<0){
        regression.push(0)
      }else{
        regression.push(Math.round(res))
      }
      
    }
    // console.log('la regression editie : ',regression)
    return regression
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

  desaisonalite(){

  }

  calculateData(x,y,z){
    var indices
    var an1
    var an2
    var an3
    if(x.length>0){ an1 = this.getTrsData(x) }else{ an1 = [0,0,0,0] }
    if(y.length>0){ an2 = this.getTrsData(y) }else{ an2 = [0,0,0,0] }
    if(z.length>0){ an3 = this.getTrsData(z) }else{ an3 = [0,0,0,0] } 

    var desain = []

    indices = this.indiceSaisonalite(an1,an2,an3)
    // console.log('voivi la liste des indices : ',indices)

    var periodeMois = this.periodeRange
    // console.log(periodes);
    var dmd = []
    for(var i =0;i<periodeMois.length;i++){
      var dm = x.filter(({mois})=>mois === periodeMois[i])
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

    // console.log('voici la liste des demanded desai ',dmd)
    var equation = this.regressionSaison(dmd)
    // console.log('voici l équation : ',equation)

    var lastMonth = this.periodeRange[this.periodeRange.length-1]+1
    var res = (lastMonth*equation.a) + equation.b
    if(res<0){
      return 0
    }else{
      return Math.round(res)
    }
    
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

  moyTr(demandes){
    var data = [0,0,0,0,0,0,0,0,0,0,0,0]
    if(demandes.length>0){
      for(var i =0;i<demandes.length;i++){
        var sumvente = parseFloat(demandes[i].Sumventes)
        var indice = demandes[i].mois - 1
        data[indice] = sumvente
      }
    }
    var tr1 = ((data[0]+data[4]+data[8])/3).toFixed(2)
    var tr2 = ((data[1]+data[5]+data[9])/3).toFixed(2)
    var tr3 = ((data[2]+data[6]+data[10])/3).toFixed(2)
    var tr4 = ((data[3]+data[7]+data[11])/3).toFixed(2)
    var moyTr = [tr1,tr2,tr3,tr4,tr1,tr2,tr3,tr4,tr1,tr2,tr3,tr4]

    return moyTr
  }

  moyVente(demandes){
    var sum = 0
    var moy = 0
    if(demandes.length>0){
      for(var i =0;i<demandes.length;i++){
        var sumvente = parseFloat(demandes[i].Sumventes)
        sum = sum + sumvente
      }
    }
    moy = sum/12
    return moy.toFixed(2)
  }

  sumPrevision(prevision){
    var sum = 0
    if(prevision.length>0){
      for(var i =0;i<prevision.length;i++){
        var sumvente = parseFloat(prevision[i].Sumprevision)
        sum = sum + sumvente
      }
    }
    return sum.toFixed(2)
  }

  indiceSaison(demandes){
    if(demandes.length>0){
      // console.log('demandes data is here : ',demandes)
      var moyTr: any = this.moyTr(demandes)
      // console.log('MoyTr data is here : ',moyTr)
      var moyVente: any = this.moyVente(demandes)
      // console.log('MoyVente data is here : ',moyVente)
      var iS = []
      for(var i=0;i<moyTr.length;i++){
        var op: any = moyTr[i]/moyVente
        iS.push(op.toFixed(2))
      }
      // console.log(iS)
      return iS
    }
   
  }
  
  desaison(demandes){
    var prevDesai = [5003,5346,5688,6030]
    var desai = []
    if(demandes.length>0){
      var indiceSaison = this.indiceSaison(demandes)

      var data = [0,0,0,0,0,0,0,0,0,0,0,0]
      for(var i =0;i<demandes.length;i++){
        var sumvente = parseFloat(demandes[i].Sumventes)
        var indice = demandes[i].mois - 1
        data[indice] = sumvente
      }
      //desaisonabilité table here not needed
      for(var i=0;i<indiceSaison.length;i++){
        var op = (data[i]/indiceSaison[i]).toFixed(2)
        desai.push(op)
      }
      var res = indiceSaison[0]*prevDesai[0]
      return res.toFixed(2)
    }
   
  }









  getdataFamille(id) {
    let postData = new FormData();
    postData.append('dateDebut', this.dateDebut);
    postData.append('dateFin', this.dateFin);
    this.http.post<any>('http://stepup.ma/espace-equipement-api/api/mMobile?page=' + id,postData,this.httpOptions).map((res) => res).subscribe((data) => {
          this.dataFamille = data;
          this.ans1 = data;
        },
        (err) => {
          console.log(JSON.stringify(err));
        }
      );
  }

 

  getarticlesdata(id) {
    var d = new Date();
    var onedeb = d.getFullYear()+ '/03/01'; //editied
    var onefin = d.getFullYear()+ '/08/31';
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
    postData.append('famille', this.familleName);
    this.http.post<any>('http://stepup.ma/espace-equipement-api/api/aMobile?page=' + id,postData, this.httpOptions).map((res) => res).subscribe((data) => {
          this.articlesData = data;
          // console.log('this is rticles data : ',this.articlesData)
          this.dataLoadingArticles = false
          this.getPeriodeRange(onedeb,onefin)
        },
        (err) => {
          this.dataLoadingArticles = false
        }
      );
  }

  dataLoadingArticles = false

  public showFamilleArticles = (famille): void => {
    this.dataLoadingArticles = true
    this.familleName = famille;
    this.getarticlesdata(1);
    this.articlesMAD.show();
  };
currentFamile: any
dataLoadingChart = false
  public onOpenDialogDetail = function (famille): void {
    // Call the show method to open the Dialog
    this.dataLoadingChart = true
    this.Dialog.show();
    this.currentFamile = famille
    // console.log('gg ',famille)
    // console.log(this.currentFamile)
    this.getdataFamilleDetail()
  };

  public onOpenDialog = function (famille): void {
    // Call the show method to open the Dialog
    this.Dialog.show();
    this.currentFamile = famille
    // console.log(this.currentFamile)
    this.getdataFamilleDetail()
  };



  prevMoyennelog = 0
  prevMoyenneMobile = []
  moyenneMobile(demandes) {
    var prevMoy = [];
    this.prevMoyenneMobile = []
    var periodes = demandes.length - 3;
    var periodeMois = this.periodeRange
    // console.log(periodes);
    var dmd = []
    for(var i =0;i<periodeMois.length;i++){
      var dm = demandes.filter(({mois})=>mois === periodeMois[i])
      if(dm.length>0){
        dmd.push(parseFloat(dm[0].Sumventes))
      }else{
        dmd.push(0)
      }
    }
    // console.log('this is demandes dmd array : ',dmd)
    var sum: any = 0;
    for (var i = 0; i < periodeMois.length; i++) {
      if(i<3){
        var moy: any = (dmd[i] +dmd[i + 1] +dmd[i + 2]) /3;
        prevMoy.push(moy.toFixed(2));
      }else if(i == 3){
        var moy: any = (dmd[i] +dmd[i + 1] +dmd[i + 2]) /3;
        prevMoy.push(moy.toFixed(2));
        this.prevMoyenneMobile.push(moy.toFixed(2))
      }else if(i == 4){
        var moy: any = (dmd[i] +dmd[i + 1] + parseFloat(this.prevMoyenneMobile[0])) /3;
        prevMoy.push(moy.toFixed(2));
        this.prevMoyenneMobile.push(moy.toFixed(2))
      }else if(i == 5){
        var moy: any = (dmd[i] +parseFloat(this.prevMoyenneMobile[0]) + parseFloat(this.prevMoyenneMobile[1])) /3;
        prevMoy.push(moy.toFixed(2));
        this.prevMoyenneMobile.push(moy.toFixed(2))
      }
      
    }
    // console.log('this is the prevision array : ',prevMoy);
    // console.log('preveion aray here : ',this.prevMoyenneMobile)
    for(var i =0;i<3;i++){
      var o = (parseFloat(this.prevMoyenneMobile[i])+parseFloat(this.prevMoyenneMobile[i+1])+parseFloat(this.prevMoyenneMobile[i+2])) /3;
      this.prevMoyenneMobile.push(o.toFixed(2))
    }
    // console.log('voici la Matrice : ',this.prevMoyenneMobile)
    var res = parseFloat(prevMoy[3])
    if(res<0){
      return 0
    }else{
      return Math.round(res)
    }
    return Math.round(res)
  }

  moyenneMobileh(demandes) {
    var prevMoy = [];
    var periodes = demandes.length - 3;
    // console.log(periodes);

    var sum: any = 0;
    for (var i = 0; i < periodes; i++) {
      var moy: any = Math.round(
        (demandes[i].Sumventes +
          demandes[i + 1].Sumventes +
          demandes[i + 2].Sumventes) /
          3
      );
      prevMoy.push(moy);
      sum = sum + moy;
    }
    // console.log(prevMoy);

    return prevMoy;
  }

  // -----------------------

  // it working

  // ---------------------------

  lissageExpo(demandes) {
    var lissage = [];
    // var gama = [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
    var prev: any = this.moyenneMobile(demandes);

    // for(var i = 0; i<9; i++){
    var val = [];
    lissage.push(val);
    var limit = prev.length - 1;
    var sum = 0;

    if (demandes.length > 0) {
      for (var j = 0; j < limit; j++) {
        // var x = lissage[i];
        var lis = 0.5 * demandes[j].Sumventes + (1 - 0.5) * prev;
        sum = sum + lis;
      } // fin boucle

      return (sum / limit).toFixed(2);
    } else {
      return 'NaN';
    }
  }
//hamza modified version
  lissageExpoh(demandes) {
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
    // console.log('lissage demandes :',dmd)
    var prevision = this.lissageMobile(demandes)
    // console.log('lissage prevision ',prevision)
    var lissage = (this.selectedAlpha*dmd[5])+(1-this.selectedAlpha)*parseFloat(prevision)
    // console.log('le lissage du mois suivant ',lissage)
    if(lissage<0){
      return 0
    }else{
      return Math.round(lissage)
    }
   
  }

  // saisonnalite (it work)

  

  getMonths() {
    var date1 = new Date(this.dateDebut);
    var date2 = new Date(this.dateFin);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference = Difference_In_Time / (1300 * 3600 * 24 * 30);
    return Math.round(Difference);
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


// Regression Linéaire
  x2(x){
    var x2 =[]
    for(var i =0;i<x.length;i++){
      x2.push(x[i]*x[i])
    }
    return x2;
  }
  equation: any
  regressionFormule(demandes){
    var x = this.periodeRange
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

    var tXY = moyXY - (moyX*moyY)
    var tX2 = moyX2 -(moyX*moyX)

    var a = tXY/tX2
    var b = moyY-(a*moyX)
    // console.log(a,b)
    this.equation = {a:a,b:b}
    return {a:a,b:b}
  }

  regression(demandes){
    var equation = this.regressionFormule(demandes)
    var lastMonth = this.periodeRange[this.periodeRange.length-1]+1
    var res = (lastMonth*equation.a) + equation.b
    if(res<0){
      return 0
    }else{
      return Math.round(res)
    }
  }



  regressionSaison(demandes){
    var x = this.periodeRange
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

    var moyX = sumX/6  //Moyenne de X
    var moyY = sumY/6   //Moyenne de Y
    var moyXY = sumXY/6   //Moyenne de XY
    var moyX2 = sumX2/6   //Moyenne de XY

    var tXY = moyXY - (moyX*moyY)
    var tX2 = moyX2 -(moyX*moyX)

    var a = tXY/tX2
    var b = moyY-(a*moyX)

    return {a:a,b:b}
  }




  @ViewChild('choixarticle')
  public choixarticle: ChartComponent;

  @ViewChild('DialogArticleDetailInfo')
  public DialogArticleDetailInfo: DialogComponent;
  public headerx: string = 'Prévision Statistique';
  public widthx = "85%"
 
  dataArticleDetailMoyenne: any
   demandesChartArticle: any
   dataArticleDetailLissage: any
   dataArticleDetailRegression: any
   dataArticleDetailDecomposition: any
  articleCodeID: any
  lesMoisa: any
  lissageExpoMaster: any
  articleId: any
  methodeSelected: any
  articleMethodeInfo: any

  dataLoadingArticleDetail = false
  opentheArticleDetail(code,id){
    this.dataLoadingArticleDetail = true
    this.articleCodeID = code
    this.articleId = id
    this.getArticleDetailsPrev()
    this.getArticleDetailsPrevMaster()
    this.getArticleDetailsMethode(id)
    this.DialogArticleDetailInfo.show();
    this.headerx = 'Prévision Statistique Article : '+code
  }

  getArticleDetailsMethode(id){
    this.http.get<any>('http://stepup.ma/espace-equipement-api/api/article/methode/type/'+id,this.httpOptions).map((res) => res).subscribe((data) => {
      if(data != 0){
        if(data.methode_id != null){
          this.methodeSelected = data.methode_id
        }else{
          this.methodeSelected = 2
        }
       
      }else{
        this.methodeSelected = 2
      }
           
            //  console.log('Methode Article selectionne ',data)
    },
    (err) => {
       console.log(JSON.stringify(err));
    }
    );
  }

  statusMethode(previsions){
    if(previsions.length>0){
      var last = previsions[previsions.length -1]
     return last.methode_id
    }else{
      return 2
    }
    
  }

  moyenneMobileMaster: any
  regressionMaster: any
  dataArticleDetailDecompositionMaster: any
  getArticleDetailsPrev(){
    var d = new Date();
    var onedeb = d.getFullYear()+ '/03/01';
    var onefin = d.getFullYear()+ '/08/31';
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
    postData.append('code', this.articleCodeID);
   this.http.post<any>('http://stepup.ma/espace-equipement-api/api/aMobile?page=1',postData,this.httpOptions).map((res) => res).subscribe((data) => {
             this.dataLoadingArticleDetail = false
             this.lesMoisa = []
             this.dataArticleDetailMoyenne = this.getmoyenneMobile(data[0].commande_m)
             this.demandesChartArticle = this.getdemandes(data[0].commande_m)
             this.dataArticleDetailLissage = this.getLissage(data[0].commande_m)
            //  console.log('Article Lissage expo ??? sur 12 Mois :: ',this.dataArticleDetailLissage)
            //  console.log('Article Lissage expo sur 12 Mois :: ',this.getLissageMaster(data[0].commande_m))
             this.lissageExpoMaster = this.getLissageMaster(data[0].commande_m)
             this.moyenneMobileMaster = this.getmoyenneMobileMaster(data[0].commande_m)
             this.dataArticleDetailRegression= this.getRegression(data[0].commande_m)
             this.regressionMaster= this.getRegressionMaster(data[0].commande_m)
             this.dataArticleDetailDecomposition= this.getDecomposition(data[0].commandeone,data[0].commandetwo,data[0].commandethree)
             this.dataArticleDetailDecompositionMaster= this.getDecompositionMaster(data[0].commandeone,data[0].commandetwo,data[0].commandethree)
             
             this.getPeriodeRange(onedeb,onefin)
             var mMobilearticle: any = []
             var lissagearticle: any = []
             var regressionarticle: any = []
             var decompositionarticle: any = []
             var demandesarticle: any = []
   
             //CHARTS MATRIXs HERE
             //FIRST INDEX DEFAULT
             mMobilearticle.push({ month: this.periodeMois[this.periodeRange.length-1], moyenneMobile: parseFloat(this.demandesChartArticle[5]) })
             lissagearticle.push({ month: this.periodeMois[this.periodeRange.length-1], lissage: parseFloat(this.demandesChartArticle[5]) })
             regressionarticle.push({ month: this.periodeMois[this.periodeRange.length-1], regression: parseFloat(this.demandesChartArticle[5]) })
             decompositionarticle.push({ month: this.periodeMois[this.periodeRange.length-1], decomposition: parseFloat(this.demandesChartArticle[5]) })
            
             for(var i=0;i<6;i++){
              demandesarticle.push({ month: this.periodeMois[this.periodeRange[i]-1], commande: parseFloat(this.demandesChartArticle[i]) })
            }

           
             //THE OTHER INDEXS
             for(var i =0;i<6;i++){
               // console.log(this.periodeMois[this.periodeRange.length+i])
                if(this.periodeRange.length+i>11){
                    mMobilearticle.push({ month: this.periodeMois[this.periodeRange.length+i-12]+' *', moyenneMobile: parseFloat(this.dataArticleDetailMoyenne[i]) })
                    lissagearticle.push({ month: this.periodeMois[this.periodeRange.length+i-12]+' *', lissage: parseFloat(this.dataArticleDetailLissage[i]) })
                    regressionarticle.push({ month: this.periodeMois[this.periodeRange.length+i-12]+' *', regression: parseFloat(this.dataArticleDetailRegression[i]) })
                    decompositionarticle.push({ month: this.periodeMois[this.periodeRange.length+i-12]+' *', decomposition: parseFloat(this.dataArticleDetailDecomposition[i]) })
                    this.lesMoisa.push(this.periodeMois[this.periodeRange.length+i-12])
                }else{
                  mMobilearticle.push({ month: this.periodeMois[this.periodeRange.length+i], moyenneMobile: parseFloat(this.dataArticleDetailMoyenne[i]) })
                    lissagearticle.push({ month: this.periodeMois[this.periodeRange.length+i], lissage: parseFloat(this.dataArticleDetailLissage[i]) })
                    regressionarticle.push({ month: this.periodeMois[this.periodeRange.length+i], regression: parseFloat(this.dataArticleDetailRegression[i]) })
                    decompositionarticle.push({ month: this.periodeMois[this.periodeRange.length+i], decomposition: parseFloat(this.dataArticleDetailDecomposition[i]) })
                    this.lesMoisa.push(this.periodeMois[this.periodeRange.length+i])
                }
               // console.log(data)
               // this.chartData2[this.periodeRange[i]-1].moyenneMobile= this.dataFamilleMoyenne[i]
             }
             this.choixarticle.series[0].dataSource = demandesarticle
             this.choixarticle.series[1].dataSource = mMobilearticle
             this.choixarticle.series[2].dataSource = lissagearticle
             this.choixarticle.series[3].dataSource = regressionarticle
             this.choixarticle.series[4].dataSource = decompositionarticle
            
            //  console.log(data)
             this.choixarticle.refresh();
             
         },
           (err) => {
             console.log(JSON.stringify(err));
             this.dataLoadingArticleDetail = false
           }
         );
     
  }

// listOfDates(): any{
//   var d = new Date()
//   var Month = d.getMonth()
//   var MonthList = []
//   for(var i =0;i<=12;i++){
//     var m = Month+i+1
//     if(m>12){
//       m = m-12
//       MonthList.push((d.getFullYear()+1)+'-'+m+'-07')
//       MonthList.push((d.getFullYear()+1)+'-'+m+'-14')
//       MonthList.push((d.getFullYear()+1)+'-'+m+'-21')
//       MonthList.push((d.getFullYear()+1)+'-'+m+'-28')
//     }else{
//       MonthList.push((d.getFullYear())+'-'+m+'-07')
//       MonthList.push((d.getFullYear())+'-'+m+'-14')
//       MonthList.push((d.getFullYear())+'-'+m+'-21')
//       MonthList.push((d.getFullYear())+'-'+m+'-28')
//     }

//   }
//   return MonthList
// }

weekCount(year, month_number) {
  var firstOfMonth = new Date(year, month_number-1, 1);
  var lastOfMonth = new Date(year, month_number, 0);
  var used = firstOfMonth.getDay() + lastOfMonth.getDate();
  return Math.ceil( used / 7);
}

lastOfMonth(year: any,month: any): any{
  var lastday= new Date(year, month, 0);
  return lastday.getDate()
}

getMonthindex(m){
 return true
}
numWeeks: any
listOfDates(): any{
  this.numWeeks = []
  var d = new Date()
  var Month = d.getMonth()
  var MonthList = []
  for(var i =0;i<12;i++){
    // console.log('i est ',i)
    var m = Month+i+1
    // console.log('Morth is :: ',m)
    if(m>12){
      m = m-12
      MonthList.push((d.getFullYear()+1)+'-'+m+'-01')
    }else{
      MonthList.push(d.getFullYear()+'-'+m+'-01')
    }

  }
  return MonthList
}

  PublishArticle(){
    let postData = new FormData();
    postData.append('listeDates', JSON.stringify(this.listOfDates()));
    postData.append('listePrev', JSON.stringify(this.lissageExpoMaster));
    postData.append('methode', '2');
    postData.append('articleID', this.articleId);
    this.http.post<any>('http://stepup.ma/espace-equipement-api/api/prev/generate',postData,this.httpOptions).map((res) => res).subscribe((data) => {
      // this.getArticleDetailsMethode(this.articleCodeID)
      this.methodeSelected=2
      this.getarticlesdata(1);
        },
        (err) => {
            console.log(JSON.stringify(err));
          }
    );
    //  console.log('Working')
    //  console.log('Liste ofDates ',this.listOfDates())
    //  console.log('Liste of Previsions ',this.lissageExpoMaster)
  }
  PublishArticleMethodeMoyenne(){
    let postData = new FormData();
    postData.append('listeDates', JSON.stringify(this.listOfDates()));
    postData.append('listePrev', JSON.stringify(this.moyenneMobileMaster));
    postData.append('methode', '1');
    postData.append('articleID', this.articleId);
    this.http.post<any>('http://stepup.ma/espace-equipement-api/api/prev/generate',postData,this.httpOptions).map((res) => res).subscribe((data) => {
      // this.getArticleDetailsMethode(this.articleCodeID)
      this.methodeSelected=1
      this.getarticlesdata(1);
        },
        (err) => {
            console.log(JSON.stringify(err));
          }
    );
    //  console.log('Working')
    //  console.log('Liste ofDates ',this.listOfDates())
    //  console.log('Liste of Previsions ',this.lissageExpoMaster)
  }

  // A Modifier
  PublishArticleRegression(){
    // console.log('la regression master du ART ',this.regressionMaster)
    let postData = new FormData();
    postData.append('listeDates', JSON.stringify(this.listOfDates()));
    postData.append('listePrev', JSON.stringify(this.regressionMaster));
    postData.append('methode', '3');
    postData.append('articleID', this.articleId);
    this.http.post<any>('http://stepup.ma/espace-equipement-api/api/prev/generate',postData,this.httpOptions).map((res) => res).subscribe((data) => {
      // this.getArticleDetailsMethode(this.articleCodeID)
      this.methodeSelected=3
      this.getarticlesdata(1);
        },
        (err) => {
            console.log(JSON.stringify(err));
          }
    );
    //  console.log('Working')
    //  console.log('Liste ofDates ',this.listOfDates())
    //  console.log('Liste of Previsions ',this.lissageExpoMaster)
  }

 // A Modifier
 PublishArticleDecomposition(){
  // console.log('la regression master du ART ',this.regressionMaster)
  let postData = new FormData();
  postData.append('listeDates', JSON.stringify(this.listOfDates()));
  postData.append('listePrev', JSON.stringify(this.dataArticleDetailDecompositionMaster));
  postData.append('methode', '4');
  postData.append('articleID', this.articleId);
  this.http.post<any>('http://stepup.ma/espace-equipement-api/api/prev/generate',postData,this.httpOptions).map((res) => res).subscribe((data) => {
    // this.getArticleDetailsMethode(this.articleCodeID)
    this.methodeSelected=4
    this.getarticlesdata(1);
      },
      (err) => {
          console.log(JSON.stringify(err));
        }
  );
  //  console.log('Working')
  //  console.log('Liste ofDates ',this.listOfDates())
  //  console.log('Liste of Previsions ',this.lissageExpoMaster)
}
  getArticleDetailsPrevMaster(){
    var d = new Date();
    var lastDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 0);
    var oneF 
    var oneD
    if(d.getMonth() == 0){
      oneD = (d.getFullYear()-1)+'/07/01'
      oneF = (d.getFullYear()-1)+'/12/31'
    }else{
      oneF = d.getFullYear()+'/'+d.getMonth()+'/'+lastDayOfMonth.getDate()
      if(d.getMonth()-6>=0){
        oneD = d.getFullYear()+'/'+(d.getMonth()-5)+'/01'
      }else{
        var dif = d.getMonth()-5
        var monthRes = 13+dif
        oneD = (d.getFullYear()-1)+'/'+(monthRes)+'/01'
      }
    }

    var onedeb = d.getFullYear()+ '/03/01';
    var onefin = d.getFullYear()+ '/08/31';
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
    postData.append('code', this.articleCodeID);
   this.http.post<any>('http://stepup.ma/espace-equipement-api/api/aMobile?page=1',postData,this.httpOptions).map((res) => res).subscribe((data) => {
             this.getPeriodeRange(onedeb,onefin)
            //  console.log('Article Lissage expo sur 12 Mois Edited :: ',this.getLissageMaster(data.data[0].commande_m))
             this.lissageExpoMaster = this.getLissageMaster(data[0].commande_m)
             
         },
           (err) => {
             console.log(JSON.stringify(err));
           }
         );
     
  }

  articleCounts: any
  getArticleCounts(){
    this.articleCounts = []
    var d = new Date();
    var lastDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 0);
    var oneF 
    var oneD
    if(d.getMonth() == 0){
      oneD = (d.getFullYear()-1)+'/07/01'
      oneF = (d.getFullYear()-1)+'/12/31'
    }else{
      oneF = d.getFullYear()+'/'+d.getMonth()+'/'+lastDayOfMonth.getDate()
      if(d.getMonth()-6>=0){
        oneD = d.getFullYear()+'/'+(d.getMonth()-5)+'/01'
      }else{
        var dif = d.getMonth()-5
        var monthRes = 13+dif
        oneD = (d.getFullYear()-1)+'/'+(monthRes)+'/01'
      }
    }

    var onedeb = d.getFullYear()+ '/03/01';
    var onefin = d.getFullYear()+ '/08/31';
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
   this.http.post<any>('http://stepup.ma/espace-equipement-api/api/aMobile/count',postData,this.httpOptions).map((res) => res).subscribe((data) => {
          this.articleCounts.push(data)
            //  console.log('Voici la liste des counts',this.articleCounts)
            //  console.log('alors une valuer ',this.articleCounts[0]['3'])
         },
           (err) => {
             console.log(JSON.stringify(err));
           }
         );
     
  }


// Publication generale par Famille
lissageExpopublication: any
moyenneMobilepublication: any
regressionpublication: any
dataArticleDetailDecompositionpublication: any
publicationfamille: any = '1'
loadingIcon: any = false
publishDone: any = 0
getArticleDetailsPrevPubli(familleid){
  this.loadingIcon = true
  this.loadID = familleid
  var d = new Date();
  var onedeb = d.getFullYear()+ '/03/01';
  var onefin = d.getFullYear()+ '/08/31';
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
  postData.append('familleid', familleid);
 this.http.post<any>('http://stepup.ma/espace-equipement-api/api/aMobile?page=1',postData,this.httpOptions).map((res) => res).subscribe((data) => {
           var dataPublication=[]
          //  console.log('data length :: ',data.length)
           for(var i=0;i<data.length;i++){
             var funcMethode
            switch(data[i].methode) {
              case 1:
                funcMethode = this.getmoyenneMobileMaster(data[i].commande_m)
                break;
              case 2:
                funcMethode = this.getLissageMaster(data[i].commande_m)
                break;
              case 3:
                funcMethode = this.getRegressionMaster(data[i].commande_m)
                break;
              case 4:
                funcMethode = this.getDecompositionMaster(data[i].commandeone,data[i].commandetwo,data[i].commandethree)
                break;
              default:
                funcMethode = this.getLissageMaster(data[i].commande_m)
            }
             var subData = {
               articleid:data[i].id,
               familleid:data[i].famille_id,
               methode:data[i].methode,
               dataPrev:funcMethode,
             }
             dataPublication.push(subData)
           }
          //  console.log('la liste des données  à transferer :: ',dataPublication)
           let postData1 = new FormData();
           postData1.append('listeDates', JSON.stringify(this.listOfDates()));
           postData1.append('listePrev', JSON.stringify(dataPublication));
           this.http.post<any>('http://stepup.ma/espace-equipement-api/api/prev/generate/famille',postData1,this.httpOptions).map((res) => res).subscribe((data) => {
              // console.log('data Sent to the server!!')
              this.loadingIcon = false
              this.loadID = 0
              this.publishDone = familleid
               },
               (err) => {
                   console.log(JSON.stringify(err));
                 }
           );
          
    
       },
         (err) => {
           console.log(JSON.stringify(err));
         }
       );
   
}














}
