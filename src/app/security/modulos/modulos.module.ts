import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulosRoutingModule } from './modulos-routing.module';
import { GeneralModule } from 'src/app/general/general.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ModulosIndexComponent } from './modulos-index/modulos-index.component';
import { ModulosFormComponent } from './modulos-form/modulos-form.component';


@NgModule({
  declarations: [
    ModulosIndexComponent,
    ModulosFormComponent
  ],
  imports: [
    CommonModule,
    ModulosRoutingModule,
    GeneralModule,
    ReactiveFormsModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
    
  ]
})
export class ModulosModule { }
