import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadosRoutingModule } from './empleados-routing.module';
import { EmpleadosIndexComponent } from './empleados-index/empleados-index.component';
import { EmpleadosFormComponent } from './empleados-form/empleados-form.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneralModule } from 'src/app/general/general.module';

import { EmpleadosMedidasComponent } from './empleados-medidas/empleados-medidas.component';
import { ArchivoFormComponent } from '../archivo/archivo-form/archivo-form.component';
import { ArchivoModule } from '../archivo/archivo.module';
import { EmpleadosCargeMasivoFormComponent } from './empleados-carge-masivo-form/empleados-carge-masivo-form.component';

@NgModule({
  declarations: [
    EmpleadosFormComponent,
    EmpleadosIndexComponent,
    EmpleadosMedidasComponent,
    EmpleadosCargeMasivoFormComponent
  ],
  imports: [
    CommonModule,
    EmpleadosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
    ArchivoModule
  ],
  providers: [
    // {
    //   provide: CUSTOM_ERROR_MESSAGES,
    //   useValue: CUSTOM_ERRORS,
    //   multi: true
    // }
  ]
})
export class EmpleadosModule { }
