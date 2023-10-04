import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelosRoutingModule } from './modelos-routing.module';
import { ModelosIndexComponent } from './modelos-index/modelos-index.component';
import { ModelosFormComponent } from './modelos-form/modelos-form.component';
import { GeneralModule } from 'src/app/general/general.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSpinnerModule } from 'ngx-spinner';

import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { ModelosPrendasFormComponent } from './modelos-prendas-form/modelos-prendas-form.component';
import { ModelosCriteriosFormComponent } from './modelos-criterios-form/modelos-criterios-form.component';
import { ArchivoModule } from 'src/app/parameters/archivo/archivo.module';


@NgModule({
  declarations: [
    ModelosIndexComponent,
    ModelosFormComponent,
    ModelosPrendasFormComponent,
    ModelosCriteriosFormComponent
  ],
  imports: [
    CommonModule,
    ModelosRoutingModule,
    GeneralModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
    UiSwitchModule,
    NgxSpinnerModule,
    HttpClientModule,
    NgbModule,
    TextMaskModule,
    ArchivoModule
  ]
})
export class ModelosModule { }
