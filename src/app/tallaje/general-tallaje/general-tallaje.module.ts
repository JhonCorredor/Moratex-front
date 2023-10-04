import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralTallajeRoutingModule } from './general-tallaje-routing.module';
import { GeneralModule } from 'src/app/general/general.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSpinnerModule } from 'ngx-spinner';

import { HttpClientModule } from '@angular/common/http';
import { GeneralTallajeIndexComponent } from './general-tallaje-index/general-tallaje-index.component';
import { GeneralTallajeFormComponent } from './general-tallaje-form/general-tallaje-form.component';


@NgModule({
  declarations: [
    GeneralTallajeIndexComponent,
    GeneralTallajeFormComponent
  ],
  imports: [
    CommonModule,
    GeneralTallajeRoutingModule,
    GeneralModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      autoDismiss: true,
      preventDuplicates: true
    }),
    UiSwitchModule,
    NgxSpinnerModule,
    HttpClientModule
  ],
  exports: [
    GeneralTallajeIndexComponent,
    GeneralTallajeFormComponent
  ]
})
export class GeneralTallajeModule { }
