import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrendasRoutingModule } from './prendas-routing.module';
import { PrendasIndexComponent } from './prendas-index/prendas-index.component';
import { GeneralModule } from 'src/app/general/general.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSpinnerModule } from 'ngx-spinner';

import { HttpClientModule } from '@angular/common/http';
import { PrendasFormComponent } from './prendas-form/prendas-form.component';
import { PrendasPiezasFormComponent } from './prendas-piezas-form/prendas-piezas-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { ConsumosPrendasFormComponent } from './prendas-consumo-form/consumo-prendas-form.component';
import { ArchivoModule } from 'src/app/parameters/archivo/archivo.module';
import { ConsumosPrendasTallasFormComponent } from './prendas-consumo-tallas-form/prendas-consumos-tallas-form.component';
import { PrendasOperacionesFormComponent } from './prendas-operaciones-form/prendas-operaciones-form.component';


@NgModule({
  declarations: [
    PrendasIndexComponent,
    PrendasFormComponent,
    PrendasPiezasFormComponent,
    ConsumosPrendasFormComponent,
    ConsumosPrendasTallasFormComponent,
    PrendasOperacionesFormComponent
  
  ],
  imports: [
    CommonModule,
    PrendasRoutingModule,
    GeneralModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    NgxSpinnerModule,
    HttpClientModule,
    NgbModule,
    TextMaskModule,
    ArchivoModule
  ]
})
export class PrendasModule { }
