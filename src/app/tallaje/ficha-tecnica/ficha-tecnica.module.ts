import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FichaTecnicaRoutingModule } from './ficha-tecnica-routing.module';
import { GeneralModule } from 'src/app/general/general.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ArchivoModule } from 'src/app/parameters/archivo/archivo.module';
import { DataTablesModule } from 'angular-datatables';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FichaTecnicaIndexComponent } from './ficha-tecnica-index/ficha-tecnica-index.component';
import { FichaTenicaVerComponent } from './ficha-tenica-ver/ficha-tenica-ver.component';
import { FichaTenicaPrendasComponent } from './ficha-tenica-prendas/ficha-tenica-prendas.component';
import { FichaTecnicaPiezasComponent } from './ficha-tecnica-piezas/ficha-tecnica-piezas.component';
import { FichaTecnicaInsumosComponent } from './ficha-tecnica-insumos/ficha-tecnica-insumos.component';
import { FichaTecnicaInsumosTallasComponent } from './ficha-tecnica-insumos-tallas/ficha-tecnica-insumos-tallas.component';
import { FichaTecnicaOperacionesComponent } from './ficha-tecnica-operaciones/ficha-tecnica-operaciones.component';


@NgModule({
  declarations: [
    FichaTecnicaIndexComponent,
    FichaTenicaVerComponent,
    FichaTenicaPrendasComponent,
    FichaTecnicaPiezasComponent,
    FichaTecnicaInsumosComponent,
    FichaTecnicaInsumosTallasComponent,
    FichaTecnicaOperacionesComponent
  ],
  imports: [
    CommonModule,
    FichaTecnicaRoutingModule,
    GeneralModule,
    ReactiveFormsModule,
    ArchivoModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
    
  ]
})
export class FichaTecnicaModule { }
