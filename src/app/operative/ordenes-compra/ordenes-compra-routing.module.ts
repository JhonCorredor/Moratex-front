import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { OrdenesCompraFormComponent } from './ordenes-compra-form/ordenes-compra-form.component';
import { OrdenesCompraIndexComponent } from './ordenes-compra-index/ordenes-compra-index.component'; 

const routes: Routes = [
  { path: '', component: OrdenesCompraIndexComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenesCompraRoutingModule { }
