import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerarCotizacionRoutingModule } from './generar-cotizacion-routing.module';
import { GenerarCotizacionIndexComponent } from './generar-cotizacion-index/generar-cotizacion-index.component';
import { GeneralModule } from 'src/app/general/general.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { GenerarCotizacionEmpleadosComponent } from './generar-cotizacion-empleados/generar-cotizacion-empleados.component';
import { GenerarCotizacionModeloscargosComponent } from './generar-cotizacion-modeloscargos/generar-cotizacion-modeloscargos.component';
import { PrecotizacionComponent } from './precotizacion/precotizacion.component';


@NgModule({
  declarations: [
    GenerarCotizacionIndexComponent,
    GenerarCotizacionEmpleadosComponent,
    GenerarCotizacionModeloscargosComponent,
    PrecotizacionComponent
  ],
  imports: [
    CommonModule,
    GenerarCotizacionRoutingModule,
    GeneralModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
  ]
})
export class GenerarCotizacionModule { }
