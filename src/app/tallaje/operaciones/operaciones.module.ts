import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperacionesRoutingModule } from './operaciones-routing.module';
import { OperacionesIndexComponent } from './operaciones-index/operaciones-index.component';
import { GeneralModule } from 'src/app/general/general.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ArchivoModule } from 'src/app/parameters/archivo/archivo.module';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { OperacionesFormComponent } from './operaciones-form/operaciones-form.component';
import { OperacionesControlesCalidadesComponent } from './operaciones-controles-calidades/operaciones-controles-calidades.component';


@NgModule({
  declarations: [
    OperacionesIndexComponent,
    OperacionesFormComponent,
    OperacionesControlesCalidadesComponent
  ],
  imports: [
    CommonModule,
    OperacionesRoutingModule,
    GeneralModule,
    ReactiveFormsModule,
    ArchivoModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
    
  ]
})
export class OperacionesModule { }
