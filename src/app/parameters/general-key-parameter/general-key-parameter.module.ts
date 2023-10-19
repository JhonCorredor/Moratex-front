import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {  GeneralKeyParameterRoutingModule } from './general-key-key-parameter-routing.module';
import { GeneralModule } from 'src/app/general/general.module';
import { GeneralKeyParameterIndexComponent } from './general-key-parameter-index/general-key-parameter-index.component';
import { GeneralKeyParameterFormComponent } from './general-key-parameter-form/general-key-parameter-form.component';


@NgModule({
  declarations: [
    GeneralKeyParameterIndexComponent,
    GeneralKeyParameterFormComponent
  ],
  imports: [
    CommonModule,
    GeneralKeyParameterRoutingModule,
    GeneralModule
  ]
})
export class GeneralKeyParameterModule { }
