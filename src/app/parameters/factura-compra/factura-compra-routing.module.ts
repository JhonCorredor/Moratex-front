import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { FacturaCompraFormComponent } from './factura-compra-form/factura-compra-form.component';
import { FacturaCompraIndexComponent } from './factura-compra-index/factura-compra.component';

const routes: Routes = [
  { path: '', component: FacturaCompraIndexComponent, canActivate: [AuthGuard] },
  { path: 'crear', component: FacturaCompraFormComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: FacturaCompraFormComponent, canActivate: [AuthGuard] },
  { path: 'ver/:id', component: FacturaCompraFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturaCompraRoutingModule { }
