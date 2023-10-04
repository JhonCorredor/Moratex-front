import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RadicadosRoutingModule } from './radicado-routing.module';
import { RadicadosIndexComponent } from './radicado-index/radicado-index.component';
import { RadicadosFormComponent } from './radicado-form/radicado-form.component';
import { GeneralModule } from 'src/app/general/general.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSpinnerModule } from 'ngx-spinner';

import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    RadicadosIndexComponent,
    RadicadosFormComponent
  ],
  imports: [
    CommonModule,
    RadicadosRoutingModule,
    GeneralModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
    UiSwitchModule,
    NgxSpinnerModule,
    HttpClientModule
  ]
})
export class RadicadosModule { }
