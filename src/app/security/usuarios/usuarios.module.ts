import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosIndexComponent } from './usuarios-index/usuarios-index.component';
import { UsuariosFormComponent } from './usuarios-form/usuarios-form.component';
import { GeneralModule } from 'src/app/general/general.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSpinnerModule } from 'ngx-spinner';

import { HttpClientModule } from '@angular/common/http';
import { UsuariosPasswordFormComponent } from './usuarios-password-form/usuarios-password-form.component';
import { UsuariosRolesComponent } from './usuarios-roles/usuarios-roles.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    UsuariosIndexComponent,
    UsuariosFormComponent,
    UsuariosPasswordFormComponent,
    UsuariosRolesComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    GeneralModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      autoDismiss: true,
      preventDuplicates: true
    }),
    UiSwitchModule,
    NgxSpinnerModule,
    HttpClientModule,
    NgbNavModule
  ]
})
export class UsuariosModule { }
