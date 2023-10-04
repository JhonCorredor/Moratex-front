import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {  GeneralKeyParameterRoutingModule } from './general-key-key-parameter-routing.module';
import { GeneralModule } from 'src/app/general/general.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSpinnerModule } from 'ngx-spinner';

import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { GeneralKeyParameterIndexComponent } from './general-key-parameter-index/general-key-parameter-index.component';
import { GeneralKeyParameterFormComponent } from './general-key-parameter-form/general-key-parameter-form.component';


@NgModule({
  declarations: [
    GeneralKeyParameterIndexComponent,
    GeneralKeyParameterFormComponent
  ],
  imports: [
    CommonModule,
    GeneralKeyParameterRoutingModule,
    GeneralModule
  ]
})
export class GeneralKeyParameterModule { }
