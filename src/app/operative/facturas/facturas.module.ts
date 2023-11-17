import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturasRoutingModule } from './facturas-routing.module';
import { FacturasFormComponent } from './facturas-form/facturas-form.component';
import { FacturasIndexComponent } from './facturas-index/facturas-index.component';
import { FacturasDetallesPagosFormComponent } from './facturas-detalles-pagos-form/facturas-detalles-pagos-form.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneralModule } from 'src/app/general/general.module';

@NgModule({
  declarations: [
    FacturasFormComponent,
    FacturasIndexComponent,
    FacturasDetallesPagosFormComponent,
  ],
  imports: [
    CommonModule,
    FacturasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule
  ],
  providers: [
    // {
    //   provide: CUSTOM_ERROR_MESSAGES,
    //   useValue: CUSTOM_ERRORS,
    //   multi: true
    // }
  ]
})
export class FacturasModule { }
