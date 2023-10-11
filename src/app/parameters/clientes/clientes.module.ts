import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesFormComponent } from './clientes-form/clientes-form.component';
import { ClientesIndexComponent } from './clientes-index/clientes-index.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneralModule } from 'src/app/general/general.module';

@NgModule({
  declarations: [
    ClientesFormComponent,
    ClientesIndexComponent,
  ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule
  ],
  providers: [
    // {
    //   provide: CUSTOM_ERROR_MESSAGES,
    //   useValue: CUSTOM_ERRORS,
    //   multi: true
    // }
  ]
})
export class ClientesModule { }
