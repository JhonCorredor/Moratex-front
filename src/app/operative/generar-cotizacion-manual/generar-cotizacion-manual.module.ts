import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerarCotizacionManualRoutingModule } from './generar-cotizacion-manual-routing.module';
import { GenerarCotizacionManualIndexComponent } from './generar-cotizacion-manual-index/generar-cotizacion-manual-index.component';
import { GeneralModule } from 'src/app/general/general.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GenerarCotizacionManualFormComponent } from './generar-cotizacion-manual-form/generar-cotizacion-manual-form.component';


@NgModule({
  declarations: [
    GenerarCotizacionManualIndexComponent,
    GenerarCotizacionManualFormComponent
  ],
  imports: [
    CommonModule,
    GenerarCotizacionManualRoutingModule,
    GeneralModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
  ]
})
export class GenerarCotizacionManualModule { }
