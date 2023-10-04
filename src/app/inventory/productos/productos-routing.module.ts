import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { ProductosFormComponent } from './productos-form/productos-form.component';
import { ProductosIndexComponent } from './productos-index/productos-index.component';

const routes: Routes = [
  { path: '', component: ProductosIndexComponent, canActivate: [AuthGuard] },
  { path: 'crear', component: ProductosFormComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: ProductosFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
