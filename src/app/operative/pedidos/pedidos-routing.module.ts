import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { PedidosFormComponent } from './pedidos-form/pedidos-form.component';
import { PedidosIndexComponent } from './pedidos-index/pedidos-index.component'; 

const routes: Routes = [
  { path: '', component: PedidosIndexComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidosRoutingModule { }
