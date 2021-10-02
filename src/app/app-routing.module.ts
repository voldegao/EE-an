import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CoefficientComponent } from './coefficient/coefficient.component';
import { DetectionComponent } from './detection/detection.component';
import { ShartComponent } from './shart/shart.component';
import { FdetailsComponent } from './fdetails/fdetails.component';
import { AdetailsComponent } from './adetails/adetails.component';
import { FilterComponent } from './filter/filter.component';
import { StocksComponent } from './stocks/stocks.component';
import { MadfComponent } from './madf/madf.component';
import { CofficientTwoComponent } from './cofficient-two/cofficient-two.component';
import { MadpComponent } from './madp/madp.component';
import { MadfilterComponent } from './madfilter/madfilter.component';
import { PgraphComponent } from './pgraph/pgraph.component';
import { StockgraphComponent } from './stockgraph/stockgraph.component';
import { TestComponent } from './test/test.component';
import { BiaisComponent } from './biais/biais.component';
import { MadComponent } from './mad/mad.component';
import { HomeComponent } from './home/home.component';
import { PrevStatistiqueComponent } from './prevStatistique/prev-statistique.component';
import { MethodeComponent } from './methode/methode.component';
import { GenerationcmdComponent } from './generationcmd/generationcmd.component';
import { SnopComponent } from './snop/snop.component';
import { SnopdetailsComponent } from './snopdetails/snopdetails.component';
import { RalanceComponent } from './ralance/ralance.component';
import { InterfaçageComponent } from './interfaçage/interfaçage.component';
import { SimulationComponent } from './simulation/simulation.component';
import { PyramidaleComponent } from './pyramidale/pyramidale.component';


const routes: Routes = [
  // { path: 'test', component: TestComponent },
  // { path: 'biais', component: BiaisComponent },
  // { path: 'mad', component: MadComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component:HomeComponent},
  {path: 'login', component:LoginComponent},
  {path: 'coefficient', component: CoefficientComponent},
  {path: 'biais', component: DetectionComponent},
  {path: 'shart' , component: ShartComponent},
  {path: 'biaisfamille' , component: FdetailsComponent },
  {path: 'biaisarticle' , component: AdetailsComponent },
  {path: 'filter' , component:FilterComponent},
  {path: 'stocksecurite' , component:StocksComponent },
  {path: 'mad', component:MadfComponent},
  {path: 'cofficient-two', component:CofficientTwoComponent},
  {path: 'madp', component:MadpComponent},
  {path: 'madfilter' , component:MadfilterComponent},
  {path: 'pgraph' , component:PgraphComponent},
  {path: 'stockgraph' , component: StockgraphComponent},
  {path: 'statistique' , component: PrevStatistiqueComponent},
  {path: 'methode' , component: MethodeComponent},
  {path: 'generation-commande' , component: GenerationcmdComponent},
  {path: 'snop' , component: SnopComponent},
  {path: 'snopdetails' , component: SnopdetailsComponent},
  {path: 'ralance' , component: RalanceComponent},
  {path: 'interfaçage' , component: InterfaçageComponent},
  {path: 'simulation' , component: SimulationComponent},
  {path: 'pyramidale' , component: PyramidaleComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
