import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcedimientosRoutingModule } from './procedimientos-routing.module';
import { GeneralModule } from 'src/app/general/general.module';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ProcedimientosIndexComponent } from './procedimientos-index/procedimientos-index.component';
import { ProcedimientosFormComponent } from './procedimientos-form/procedimientos-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxCurrencyModule } from 'ngx-currency';

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
    NgxCurrencyModule,
  ],
})
export class ProcedimientosModule {}
