import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProveedoresRoutingModule } from './proveedores-routing.module';
import { ProveedoresIndexComponent } from './proveedores-index/proveedores-index.component';
import { ProveedoresFormComponent } from './proveedores-form/proveedores-form.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
// import { GeneralModule } from 'src/app/general/general.module';
// import { CUSTOM_ERROR_MESSAGES, NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
// import { CUSTOM_ERRORS } from 'src/app/admin/custom.error';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneralModule } from 'src/app/general/general.module';

import { ProductoPorveedoresFormComponent } from './producto-porveedores-form/producto-porveedores-form.component';

@NgModule({
  declarations: [
    ProveedoresFormComponent,
    ProveedoresIndexComponent,
    ProductoPorveedoresFormComponent,
  ],
  imports: [
    CommonModule,
    ProveedoresRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralModule,
    // NgBootstrapFormValidationModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
  ],
  providers: [
    // {
    //   provide: CUSTOM_ERROR_MESSAGES,
    //   useValue: CUSTOM_ERRORS,
    //   multi: true
    // }
  ]
})
export class ProveedoresModule { }
