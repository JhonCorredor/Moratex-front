import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { FacturasFormComponent } from './facturas-form/facturas-form.component';
import { FacturasIndexComponent } from './facturas-index/facturas-index.component';

const routes: Routes = [
  { path: '', component: FacturasIndexComponent, canActivate: [AuthGuard] },
  { path: 'crear', component: FacturasFormComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: FacturasFormComponent, canActivate: [AuthGuard] },
  { path: 'ver/:id', component: FacturasFormComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturasRoutingModule { }
