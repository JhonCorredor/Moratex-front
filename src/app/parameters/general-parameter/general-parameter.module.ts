import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralParameterRoutingModule } from './general-parameter-routing.module';
import { GeneralModule } from 'src/app/general/general.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSpinnerModule } from 'ngx-spinner';

import { HttpClientModule } from '@angular/common/http';
import { GeneralParameterIndexComponent } from './general-parameter-index/general-parameter-index.component';
import { GeneralParameterFormComponent } from './general-parameter-form/general-parameter-form.component';


@NgModule({
  declarations: [
    GeneralParameterIndexComponent,
    GeneralParameterFormComponent
  ],
  imports: [
    CommonModule,
    GeneralParameterRoutingModule,
    GeneralModule         
  ]
})
export class GeneralParameterModule { }
