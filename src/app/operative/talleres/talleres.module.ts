import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TalleresRoutingModule } from './talleres-routing.module';
import { TalleresIndexComponent } from './talleres-index/talleres-index.component';
import { TalleresFormComponent } from './talleres-form/talleres-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralModule } from 'src/app/general/general.module';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    TalleresIndexComponent,
    TalleresFormComponent
  ],
  imports: [
    CommonModule,
    TalleresRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule
  ]
})
export class TalleresModule { }
