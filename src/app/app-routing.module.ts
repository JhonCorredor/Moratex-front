import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RadicadosFormComponent } from './pqrs/radicado/radicado-form/radicado-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: "login", loadChildren: () => import('./security/security.module').then(m => m.SecurityModule) },
  { path: "dashboard", loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: "parametros", loadChildren: () => import('./parameters/parameters.module').then(m => m.ParametersModule) },
  { path: "tallaje", loadChildren: () => import('./tallaje/tallaje.module').then(m => m.TallajeModule) },
  { path: "inventario", loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule) },
  { path: "seguridad", loadChildren: () => import('./security/security.module').then(m => m.SecurityModule) },
  { path: "operativo", loadChildren: () => import('./operative/operative.module').then(m => m.OperativeModule) },
  { path: "pqrs" , loadChildren: () => import('./pqrs/pqrs.module').then(m => m.PqrsModule) },
  { path: "radicar-pqrs" , component : RadicadosFormComponent  , data: { admin : false }},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
