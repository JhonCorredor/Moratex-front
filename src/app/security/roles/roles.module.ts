import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { GeneralModule } from 'src/app/general/general.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSpinnerModule } from 'ngx-spinner';

import { HttpClientModule } from '@angular/common/http';
import { RolesIndexComponent } from './roles-index/roles-index.component';
import { RolesFormComponent } from './roles-form/roles-form.component';
import { RolesFormularioFormComponent } from './roles-formulario-form/roles-formulario-formcomponent';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    RolesIndexComponent,
    RolesFormComponent,
    RolesFormularioFormComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    GeneralModule,
    ReactiveFormsModule,
    // NgBootstrapFormValidationModule,
    DataTablesModule,
    UiSwitchModule,
    NgbModule,
  ],
  
})
export class RolesModule { }
