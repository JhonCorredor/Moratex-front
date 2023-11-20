import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturaCompraRoutingModule } from './factura-compra-routing.module';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneralModule } from 'src/app/general/general.module';
import { FacturaCompraIndexComponent } from './factura-compra-index/factura-compra.component';
import { FacturaCompraFormComponent } from './factura-compra-form/factura-compra-form.component';
import { FacturaCompraDetalleFormComponent } from './factura-compra-detalle-form/factura-compra-detalle-form.component';
import { FacturasComprasDetallesPagosFormComponent } from './facturas-compra-detalles-pagos-form/facturas-compras-detalles-pagos-form.component';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
  declarations: [
    FacturaCompraFormComponent,
    FacturaCompraDetalleFormComponent,
    FacturaCompraIndexComponent,
    FacturasComprasDetallesPagosFormComponent,
  ],
  imports: [
    CommonModule,
    FacturaCompraRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
    NgxCurrencyModule
  ],
  providers: [
  ]
})
export class FacturaCompraModule { }
