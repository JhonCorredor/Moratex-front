import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaquinariasRoutingModule } from './maquinarias-routing.module';
import { GeneralModule } from 'src/app/general/general.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ArchivoModule } from 'src/app/parameters/archivo/archivo.module';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MaquinariasIndexComponent } from './maquinarias-index/maquinarias-index.component';
import { MaquinariasFormComponent } from './maquinarias-form/maquinarias-form.component';


@NgModule({
  declarations: [
    MaquinariasIndexComponent,
    MaquinariasFormComponent
  ],
  imports: [
    CommonModule,
    MaquinariasRoutingModule,
    GeneralModule,
    ReactiveFormsModule,
    ArchivoModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
    
  ]
})
export class MaquinariasModule { }
