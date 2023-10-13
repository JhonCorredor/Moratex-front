import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CostosRoutingModule } from './costos-routing.module';
import { CostosIndexComponent } from './costos-index/costos-index.component';
import { CostosFormComponent } from './costos-form/costos-form.component';
import { GeneralModule } from 'src/app/general/general.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { ArchivoModule } from 'src/app/parameters/archivo/archivo.module';

@NgModule({
  declarations: [CostosIndexComponent, CostosFormComponent],
  imports: [
    CommonModule,
    CostosRoutingModule,
    GeneralModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    NgxSpinnerModule,
    HttpClientModule,
    NgbModule,
    TextMaskModule,
    ArchivoModule,
  ],
})
export class CostosModule {}
