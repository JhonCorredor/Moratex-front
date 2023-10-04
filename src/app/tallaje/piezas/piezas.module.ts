import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PiezasRoutingModule } from './piezas-routing.module';
import { GeneralModule } from 'src/app/general/general.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSpinnerModule } from 'ngx-spinner';

import { HttpClientModule } from '@angular/common/http';
import { PiezasIndexComponent } from './piezas-index/piezas-index.component';
import { PiezasFormComponent } from './piezas-form/piezas-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ArchivoModule } from 'src/app/parameters/archivo/archivo.module';


@NgModule({
  declarations: [
    PiezasIndexComponent,
    PiezasFormComponent,
  ],
  imports: [
    CommonModule,
    PiezasRoutingModule,
    GeneralModule,
    ReactiveFormsModule,
    ArchivoModule,
    // NgBootstrapFormValidationModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
  ],
  
})
export class PiezasModule { }
