import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SortService } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-ralance',
  templateUrl: './ralance.component.html',
  styleUrls: ['./ralance.component.scss'],
  providers: [SortService]
})
export class RalanceComponent implements OnInit {
  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + window.localStorage.getItem('ESP_access_token')
    })
  }
  constructor(private http: HttpClient) { }
  public initialPage: Object;
  public initialSort: Object;
  ngOnInit() {
    this.getFamilleListe()
    this.initialPage = { pageSizes: true, pageCount: 1 };
    this.initialSort = {
      columns: [{ field: 'cmder', direction: 'Ascending' },
    ]
  };
  }

  FamilleListe: any
  familleD: any
  getFamilleListe(){
    this.http.get<any>('http://stepup.ma/espace-equipement-api/api/params', this.httpOptions).map(res => res).subscribe(data => {
      this.FamilleListe = data.familles
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
  dataLoading = false
  getArticleListe(id){
    let postData = new FormData();
    var d= new Date()
    var debut = d.getFullYear()+'-'+(d.getMonth()+1)+"-01"
    var fin = d.getFullYear()+'-'+(d.getMonth()+1)+"-31"
    postData.append('dateDebut', debut);
    postData.append('dateFin', fin);
    postData.append('familleID', id);
    this.dataLoading = true
    this.http.post<any>('http://stepup.ma/espace-equipement-api/api/ralance/articles',postData, this.httpOptions).map(res => res).subscribe(data => {
      this.dataLoading = false
      this.ArticleListe = data
    }, err => {
      console.log(JSON.stringify(err));
      this.dataLoading = false
    });
  }
  selectFamille(id) {
    // console.log(id);
    this.familleD = id
    this.ArticleListe = []
    this.selectedParamArticle = ''
    this.getArticleListe(id)
}

selectArticle(id) {
  this.selectedParamArticle = id
}

vmj(a){
  var cmd = parseFloat(a)
  var x = cmd/22
  return x.toFixed(2)
}

couverture(stock,commande){
  var vmj = this.vmj(commande)
  if(parseFloat(vmj)>0){
    var c = stock/parseFloat(vmj)
    return c.toFixed(2)
  }else{
    return 0
  }
}

}
