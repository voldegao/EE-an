import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy,LocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GridModule } from '@syncfusion/ej2-angular-grids';
import { PageService, SortService, FilterService, GroupService,DetailRowService, ExcelExportService, PdfExportService,AggregateService,EditSettingsModel, IEditCell, EditService } from '@syncfusion/ej2-angular-grids';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { CategoryService, LegendService, TooltipService,ColumnSeriesService,StepLineSeriesService } from '@syncfusion/ej2-angular-charts';
import { DataLabelService, LineSeriesService} from '@syncfusion/ej2-angular-charts';
import { DialogModule, TooltipModule } from '@syncfusion/ej2-angular-popups';
import { PivotViewModule } from '@syncfusion/ej2-angular-pivotview';
import { ToolbarService } from '@syncfusion/ej2-angular-grids';


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

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { BiaisComponent } from './biais/biais.component';
import { MadComponent } from './mad/mad.component';
import { PrevStatistiqueComponent } from './prevStatistique/prev-statistique.component';
import { MenuComponent } from './menu/menu.component';
import { MethodeComponent } from './methode/methode.component';
import { LoginComponent } from './login/login.component';
import { GenerationcmdComponent } from './generationcmd/generationcmd.component';
import { SnopComponent } from './snop/snop.component';
import { SnopdetailsComponent } from './snopdetails/snopdetails.component';
import { RalanceComponent } from './ralance/ralance.component';
import { InterfaçageComponent } from './interfaçage/interfaçage.component';
import { SimulationComponent } from './simulation/simulation.component';
import { PyramidaleComponent } from './pyramidale/pyramidale.component';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';


@NgModule({
  declarations: [							
    AppComponent,
    TestComponent,
    BiaisComponent,
    MadComponent,
    AppComponent,
    LoginComponent,
    CoefficientComponent,
    DetectionComponent,
    ShartComponent,
    FdetailsComponent,
    AdetailsComponent,
    FilterComponent,
    StocksComponent,
    MadfComponent,
    CofficientTwoComponent,
    MadpComponent,
    MadfilterComponent,
    PgraphComponent,
    StockgraphComponent,
    PrevStatistiqueComponent,
    MenuComponent,
      MethodeComponent,
      LoginComponent,
      GenerationcmdComponent,
      SnopComponent,
      SnopdetailsComponent,
      RalanceComponent,
      InterfaçageComponent,
      SimulationComponent,
      PyramidaleComponent
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    GridModule,
    ChartModule,
    FormsModule,
    DialogModule,
    TooltipModule,
    PivotViewModule,
    ToastModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [PageService,
    ToolbarService,
                SortService,
                FilterService,
                GroupService,
                ColumnSeriesService,
                  EditService,
                AggregateService ,
                StepLineSeriesService,
                ExcelExportService, PdfExportService,
                CategoryService, LegendService, TooltipService, DataLabelService, LineSeriesService,DetailRowService,{provide:LocationStrategy,useClass:HashLocationStrategy} ],
  bootstrap: [AppComponent]
})
export class AppModule { }
