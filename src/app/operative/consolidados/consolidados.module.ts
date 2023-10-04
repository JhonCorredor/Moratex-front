import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsolidadosRoutingModule } from './consolidados-routing.module';
import { ArmarConsolidadoComponent } from './armar-consolidado/armar-consolidado.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralModule } from 'src/app/general/general.module';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';


@NgModule({
  declarations: [
    ArmarConsolidadoComponent
  ],
  imports: [
    CommonModule,
    ConsolidadosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
    TextMaskModule
  ]
})
export class ConsolidadosModule { }
