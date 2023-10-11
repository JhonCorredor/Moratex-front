import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcedimientosRoutingModule } from './procedimientos-routing.module';
import { GeneralModule } from 'src/app/general/general.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSpinnerModule } from 'ngx-spinner';

import { HttpClientModule } from '@angular/common/http';
import { ProcedimientosIndexComponent } from './procedimientos-index/procedimientos-index.component';
import { ProcedimientosFormComponent } from './procedimientos-form/procedimientos-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ProcedimientosIndexComponent, ProcedimientosFormComponent],
  imports: [
    CommonModule,
    ProcedimientosRoutingModule,
    GeneralModule,
    ReactiveFormsModule,
    // NgBootstrapFormValidationModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
  ],
})
export class ProcedimientosModule {}
