import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdenesPedidosRoutingModule } from './ordenes-pedidos-routing.module';
import { OrdenesPedidosFormComponent } from './ordenes-pedidos-form/ordenes-pedidos-form.component';
import { OrdenesPedidosIndexComponent } from './ordenes-pedidos-index/ordenes-pedidos-index.component';
import { SeguimientosFormComponent } from './seguimientos-form/seguimientos-form.component';
import { OrdenesPedidosProductosFormComponent } from './ordenes-pedidos-productos-form/ordenes-pedidos-productos-form.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneralModule } from 'src/app/general/general.module';

@NgModule({
  declarations: [
    OrdenesPedidosFormComponent,
    OrdenesPedidosIndexComponent,
    SeguimientosFormComponent,
    OrdenesPedidosProductosFormComponent,
  ],
  imports: [
    CommonModule,
    OrdenesPedidosRoutingModule,
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
export class OrdenesPedidosModule { }
