import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresasRoutingModule } from './empresas-routing.module';
import { EmpresasIndexComponent } from './empresas-index/empresas-index.component';
import { EmpresasFormComponent } from './empresas-form/empresas-form.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
// import { GeneralModule } from 'src/app/general/general.module';
// import { CUSTOM_ERROR_MESSAGES, NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
// import { CUSTOM_ERRORS } from 'src/app/admin/custom.error';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneralModule } from 'src/app/general/general.module';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

import { HttpClientModule } from '@angular/common/http';
import { EmpresasModelosCargosComponent } from './empresas-modelos-cargos/empresas-modelos-cargos.component';
import { ArchivoModule } from '../archivo/archivo.module';

@NgModule({
  declarations: [
    EmpresasFormComponent,
    EmpresasIndexComponent,
    EmpresasModelosCargosComponent
  ],
  imports: [
    CommonModule,
    EmpresasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    HttpClientModule,
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
export class EmpresasModule { }
