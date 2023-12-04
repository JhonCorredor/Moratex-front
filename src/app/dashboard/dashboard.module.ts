import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { GeneralModule } from '../general/general.module';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [
    DashboardComponent,
    NotificacionesComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    GeneralModule,
    DataTablesModule
  ]
})
export class DashboardModule { }
