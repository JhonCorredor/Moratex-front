import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArchivoFormComponent } from './archivo-form/archivo-form.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
// import { GeneralModule } from 'src/app/general/general.module';
// import { CUSTOM_ERROR_MESSAGES, NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
// import { CUSTOM_ERRORS } from 'src/app/admin/custom.error';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneralModule } from 'src/app/general/general.module';

import { ArchivosViewComponent } from './archivo-view/archivo-view.component';

@NgModule({
  declarations: [
    ArchivoFormComponent,
    ArchivosViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralModule,
    // NgBootstrapFormValidationModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
  ],
  exports: [
    ArchivoFormComponent
  ],
  providers: [
    // {
    //   provide: CUSTOM_ERROR_MESSAGES,
    //   useValue: CUSTOM_ERRORS,
    //   multi: true
    // }
  ]
})
export class ArchivoModule { }
