import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonasRoutingModule } from './personas-routing.module';
import { PersonasIndexComponent } from './personas-index/personas-index.component';
import { PersonasFormComponent } from './personas-form/personas-form.component';
import { GeneralModule } from 'src/app/general/general.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSpinnerModule } from 'ngx-spinner';

import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    PersonasIndexComponent,
    PersonasFormComponent
  ],
  imports: [
    CommonModule,
    PersonasRoutingModule,
    GeneralModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      autoDismiss: true,
      preventDuplicates: true
    }),
    UiSwitchModule.forRoot({
      size: 'small',
      color: '#007bff',
      switchColor: '#007bff',
      defaultBgColor: 'white',
      defaultBoColor : '#007bff',
      checkedLabel: 'Si',
      uncheckedLabel: 'No'
    }),
    NgxSpinnerModule,
    HttpClientModule
  ]
})
export class PersonasModule { }
