this.http.post<any>('http://stepup.ma/espace-equipement-api/api/mMobile?page=1',postData,this.httpOptions).map((res) => res).subscribe((data) => {
          

          this.dataArticleDetailMoyenne = this.getmoyenneMobileArticleDetail(data.data[0].commande_m)
          this.demandesChartArticle = this.getdemandes(data.data[0].commande_m)
          this.dataArticleDetailLissage = this.getLissageArticleDetail(data.data[0].commande_m)
          this.dataArticleDetailRegression= this.getRegressionArticleDetail(data.data[0].commande_m)
          this.dataArticleDetailDecomposition= this.getDecompositionArticleDetail(data.data[0].commandeone,data.data[0].commandetwo,data.data[0].commandethree)
          
          this.getPeriodeRange(onedeb,onefin)
          var mMobilearticle: any = []
          var lissagearticle: any = []
          var regressionarticle: any = []
          var decompositionarticle: any = []
          var demandesarticle: any = []

          //CHARTS MATRIXs HERE
          //FIRST INDEX DEFAULT
          mMobilearticle.push({ month: this.periodeMois[this.periodeRange.length-1], moyenneMobile: parseFloat(this.demandesChartArticle[this.demandesChartArticle.length-1]) })
          lissagearticle.push({ month: this.periodeMois[this.periodeRange.length-1], lissage: parseFloat(this.demandesChartArticle[this.demandesChartArticle.length-1]) })
          regressionarticle.push({ month: this.periodeMois[this.periodeRange.length-1], regression: parseFloat(this.demandesChartArticle[this.demandesChartArticle.length-1]) })
          decompositionarticle.push({ month: this.periodeMois[this.periodeRange.length-1], decomposition: parseFloat(this.demandesChartArticle[this.demandesChartArticle.length-1]) })
          //THE OTHER INDEXS
          for(var i =0;i<this.periodeRange.length;i++){
            // console.log(this.periodeMois[this.periodeRange.length+i])
            mMobilearticle.push({ month: this.periodeMois[this.periodeRange.length+i], moyenneMobile: parseFloat(this.dataArticleDetailMoyenne[i]) })
            lissagearticle.push({ month: this.periodeMois[this.periodeRange.length+i], lissage: parseFloat(this.dataArticleDetailLissage[i]) })
            regressionarticle.push({ month: this.periodeMois[this.periodeRange.length+i], regression: parseFloat(this.dataArticleDetailRegression[i]) })
            decompositionarticle.push({ month: this.periodeMois[this.periodeRange.length+i], decomposition: parseFloat(this.dataArticleDetailDecomposition[i]) })
            demandesarticle.push({ month: this.periodeMois[i], commande: parseFloat(this.demandesChartArticle[i]) })
            // console.log(data)
            // this.chartData2[this.periodeRange[i]-1].moyenneMobile= this.dataFamilleMoyenne[i]
          }
          console.log('this is the mobile data array : ',mMobile)
          this.choixarticle.series[0].dataSource = demandesarticle
          this.choixarticle.series[1].dataSource = mMobilearticle
          this.choixarticle.series[2].dataSource = lissagearticle
          this.choixarticle.series[3].dataSource = regressionarticle
          this.choixarticle.series[4].dataSource = decompositionarticle
         
          console.log(data)
          this.choix.refresh();
          
      },
        (err) => {
          console.log(JSON.stringify(err));
        }
      );
  }

// FUNCTIONS HERE

  
  prevMoyenneMobiledetailArticle = []
  getmoyenneMobileArticleDetail(demandes) {          //data.data[0].commande_m
    var prevMoy = [];
    this.prevMoyenneMobiledetailArticle = []
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
        prevMoy.push(Math.round(moy));
      }else if(i == 3){
        var moy: any = (dmd[i] +dmd[i + 1] +dmd[i + 2]) /3;
        prevMoy.push(Math.round(moy));
        this.prevMoyenneMobiledetailArticle.push(Math.round(moy))
      }else if(i == 4){
        var moy: any = (dmd[i] +dmd[i + 1] + parseFloat(this.prevMoyenneMobiledetailArticle[0])) /3;
        prevMoy.push(Math.round(moy));
        this.prevMoyenneMobiledetailArticle.push(Math.round(moy))
      }else if(i == 5){
        var moy: any = (dmd[i] +parseFloat(this.prevMoyenneMobiledetailArticle[0]) + parseFloat(this.prevMoyenneMobiledetailArticle[1])) /3;
        prevMoy.push(Math.round(moy));
        this.prevMoyenneMobiledetailArticle.push(Math.round(moy))
      }
    }
    for(var i =0;i<3;i++){
      var o = (parseFloat(this.prevMoyenneMobiledetailArticle[i])+parseFloat(this.prevMoyenneMobiledetailArticle[i+1])+parseFloat(this.prevMoyenneMobiledetailArticle[i+2])) /3;
      this.prevMoyenneMobiledetailArticle.push(Math.round(o))
    }
    return this.prevMoyenneMobiledetailArticle
  }


   getLissageArticleDetail(demandes) {
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

    var prevision = this.lissageMobile(demandes) //FUNCTIONS HERE TO NOTIFY
    var lissage = (0.7*dmd[5])+(1-0.7)*parseFloat(prevision)
    lissageList.push(Math.round(lissage))

    for(var i=0;i<5;i++){
      if(i==0){
        var res: any = ((dmd[4]+dmd[5]+lissageList[0])/3).toFixed(2)
        lissageList.push(Math.round(res))
      }else if(i == 1){
        var res: any = ((dmd[5]+parseFloat(lissageList[0])+parseFloat(lissageList[1]))/3).toFixed(2)
        lissageList.push(Math.round(res))
      }else{
        var res: any = ((parseFloat(lissageList[i-2])+parseFloat(lissageList[i-1])+parseFloat(lissageList[i]))/3).toFixed(2)
        lissageList.push(Math.round(res))
      }
    }
    return lissageList
  }


   getRegressionArticleDetail(demandes) {
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
      regression.push(Math.round(res))
    }
    
    return regression
  }


   getDecompositionArticleDetail(x,y,z){
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
    for(var i=0;i<periodeMois.length;i++){
      var d = this.periodeRange[this.periodeRange.length-1]+1+i
      var res = (d*equation.a) + equation.b
      if(res<1){
        data.push(0)
      }else{
        data.push(Math.round(res))
      }
      
    }
    return data
    
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
    return dmd
  }
