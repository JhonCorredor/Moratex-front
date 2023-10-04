import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenesCompraRoutingModule } from './ordenes-compra-routing.module';
import { OrdenesCompraIndexComponent } from './ordenes-compra-index/ordenes-compra-index.component';
import { OrdenesCompraFormComponent } from './ordenes-compra-form/ordenes-compra-form.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
// import { GeneralModule } from 'src/app/general/general.module';
// import { CUSTOM_ERROR_MESSAGES, NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
// import { CUSTOM_ERRORS } from 'src/app/admin/custom.error';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneralModule } from 'src/app/general/general.module';


@NgModule({
  declarations: [
    OrdenesCompraFormComponent,
    OrdenesCompraIndexComponent,
  ],
  imports: [
    CommonModule,
    OrdenesCompraRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralModule,
    // NgBootstrapFormValidationModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
    ,
  ],
  providers: [
    // {
    //   provide: CUSTOM_ERROR_MESSAGES,
    //   useValue: CUSTOM_ERRORS,
    //   multi: true
    // }
  ]
})
export class OrdenesCompraModule { }
