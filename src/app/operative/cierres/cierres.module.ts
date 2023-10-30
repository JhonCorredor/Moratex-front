import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CierresRoutingModule } from './cierres-routing.module';
import { CierresIndexComponent } from './cierres-index/cierres-index.component';
import { CierresFormComponent } from './cierres-form/cierres-form.component';
import { GeneralModule } from 'src/app/general/general.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [CierresIndexComponent, CierresFormComponent],
  imports: [
    CommonModule,
    CierresRoutingModule,
    GeneralModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    NgxSpinnerModule,
    HttpClientModule,
    NgbModule,
    TextMaskModule,
  ],
})
export class CierresModule {}
