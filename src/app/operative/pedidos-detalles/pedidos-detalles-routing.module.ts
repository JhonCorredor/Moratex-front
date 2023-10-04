import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { PedidosDetallesFormComponent } from './pedidos-detalles-form/pedidos-detalles-form.component';
import { PedidosDetallesIndexComponent } from './pedidos-detalles-index/pedidos-detalles-index.component'; 

const routes: Routes = [
  { path: '', component: PedidosDetallesIndexComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidosDetallesRoutingModule { }
