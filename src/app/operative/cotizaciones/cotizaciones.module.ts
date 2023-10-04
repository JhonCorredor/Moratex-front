import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CotizacionesRoutingModule } from './cotizaciones-routing.module';
import { CotizacionesIndexComponent } from './cotizaciones-index/cotizaciones-index.component';
import { CotizacionesFormComponent } from './cotizaciones-form/cotizaciones-form.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneralModule } from 'src/app/general/general.module';
import { CotizacionesConsolidadoFormComponent } from './cotizaciones-consolidado-form/cotizaciones-consolidado-form.component';
import { ConsolidadoIndexComponent } from './consolidado-index/consolidado-index.component';
import { CotizacionesDetallesIndexComponent } from './cotizaciones-detalles/cotizaciones-detalles-index/cotizaciones-detalles-index.component';
import { CotizacionesDetallesFormComponent } from './cotizaciones-detalles/cotizaciones-detalles-form/cotizaciones-detalles-form.component';
import { TextMaskModule } from 'angular2-text-mask';


@NgModule({
  declarations: [
    CotizacionesFormComponent,
    CotizacionesIndexComponent,
    CotizacionesConsolidadoFormComponent,
    ConsolidadoIndexComponent,
    CotizacionesDetallesIndexComponent,
    CotizacionesDetallesFormComponent
  ],
  imports: [
    CommonModule,
    CotizacionesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
    TextMaskModule
  ],
  providers: [
    // {
    //   provide: CUSTOM_ERROR_MESSAGES,
    //   useValue: CUSTOM_ERRORS,
    //   multi: true
    // }
  ]
})
export class CotizacionesModule { }
