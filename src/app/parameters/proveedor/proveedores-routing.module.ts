import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { ProveedoresFormComponent } from './proveedores-form/proveedores-form.component';
import { ProveedoresIndexComponent } from './proveedores-index/proveedores-index.component';

const routes: Routes = [
  { path: '', component: ProveedoresIndexComponent, canActivate: [AuthGuard] },
  { path: 'crear', component: ProveedoresFormComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: ProveedoresFormComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedoresRoutingModule { }
