import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlesCalidadesRoutingModule } from './controles-calidades-routing.module';
import { GeneralModule } from 'src/app/general/general.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ArchivoModule } from 'src/app/parameters/archivo/archivo.module';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ControlesCalidadesIndexComponent } from './controles-calidades-index/controles-calidades-index.component';
import { ControlesCalidadesFormComponent } from './controles-calidades-form/controles-calidades-form.component';


@NgModule({
  declarations: [
    ControlesCalidadesIndexComponent,
    ControlesCalidadesFormComponent
  ],
  imports: [
    CommonModule,
    ControlesCalidadesRoutingModule,
    GeneralModule,
    ReactiveFormsModule,
    ArchivoModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
    
  ]
})
export class ControlesCalidadesModule { }
