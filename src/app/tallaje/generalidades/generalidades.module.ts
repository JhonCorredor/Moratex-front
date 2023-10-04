import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralidadesRoutingModule } from './generalidades-routing.module';
import { GeneralidadesIndexComponent } from './generalidades-index/generalidades-index.component';
import { GeneralidadesFormComponent } from './generalidades-form/generalidades-form.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
// import { GeneralModule } from 'src/app/general/general.module';
// import { CUSTOM_ERROR_MESSAGES, NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
// import { CUSTOM_ERRORS } from 'src/app/admin/custom.error';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneralModule } from 'src/app/general/general.module';

import { GeneralTallajeModule } from '../general-tallaje/general-tallaje.module';

@NgModule({
  declarations: [
    GeneralidadesFormComponent,
    GeneralidadesIndexComponent,
  ],
  imports: [
    CommonModule,
    GeneralTallajeModule,
    GeneralidadesRoutingModule,
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
export class GeneralidadesModule { }
