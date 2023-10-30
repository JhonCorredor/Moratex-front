import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { OrdenesPedidosFormComponent } from './ordenes-pedidos-form/ordenes-pedidos-form.component';
import { OrdenesPedidosIndexComponent } from './ordenes-pedidos-index/ordenes-pedidos-index.component';

const routes: Routes = [
  { path: '', component: OrdenesPedidosIndexComponent, canActivate: [AuthGuard] },
  { path: 'crear', component: OrdenesPedidosFormComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: OrdenesPedidosFormComponent, canActivate: [AuthGuard] },
  { path: 'ver/:id', component: OrdenesPedidosFormComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenesPedidosRoutingModule { }
