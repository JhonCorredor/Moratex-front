import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiposPrendasRoutingModule } from './tipos-prendas-routing.module';
import { GeneralModule } from 'src/app/general/general.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ArchivoModule } from 'src/app/parameters/archivo/archivo.module';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TiposPrendasIndexComponent } from './tipos-prendas-index/tipos-prendas-index.component';
import { TiposPrendasFormComponent } from './tipos-prendas-form/tipos-prendas-form.component';


@NgModule({
  declarations: [
    TiposPrendasIndexComponent,
    TiposPrendasFormComponent
  ],
  imports: [
    CommonModule,
    TiposPrendasRoutingModule,
    GeneralModule,
    ReactiveFormsModule,
    ArchivoModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
    
  ]
})
export class TiposPrendasModule { }
