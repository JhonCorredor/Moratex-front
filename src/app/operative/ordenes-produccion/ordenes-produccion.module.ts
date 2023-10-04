import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenesProduccionRoutingModule } from './ordenes-produccion-routing.module';
import { OpFormComponent } from './op-form/op-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralModule } from 'src/app/general/general.module';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { OpDetailIndexComponent } from './op-detail-index/op-detail-index.component';
import { OpDetailFormComponent } from './op-detail-form/op-detail-form.component';
import { OpQualityIndexComponent } from './op-quality-index/op-quality-index.component';
import { OpQualityFormComponent } from './op-quality-form/op-quality-form.component';


@NgModule({
  declarations: [
    OpFormComponent,
    OpDetailIndexComponent,
    OpDetailFormComponent,
    OpQualityIndexComponent,
    OpQualityFormComponent
  ],
  imports: [
    CommonModule,
    OrdenesProduccionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
    TextMaskModule
  ]
})
export class OrdenesProduccionModule { }
