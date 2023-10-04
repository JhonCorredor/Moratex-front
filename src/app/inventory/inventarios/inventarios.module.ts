import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventariosRoutingModule } from './inventarios-routing.module';
import { InventariosIndexComponent } from './inventarios-index/inventarios-index.component';
import { InventariosFormComponent } from './inventarios-form/inventarios-form.component';
import { InventarioDetalleFormComponent } from './inventario-detalle-form/inventario-detalle-formcomponent';
import { GeneralModule } from 'src/app/general/general.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    InventariosIndexComponent,
    InventariosFormComponent,
    InventarioDetalleFormComponent
  ],
  imports: [
    CommonModule,
    InventariosRoutingModule,
    GeneralModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
    UiSwitchModule,
    NgbModule,
    NgxSpinnerModule,
    HttpClientModule
  ]
})
export class InventariosModule { }
