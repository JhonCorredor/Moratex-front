import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { EmpresasFormComponent } from './empresas-form/empresas-form.component';
import { EmpresasIndexComponent } from './empresas-index/empresas-index.component';

const routes: Routes = [
  { path: '', component: EmpresasIndexComponent, canActivate: [AuthGuard] },
  { path: 'crear', component: EmpresasFormComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: EmpresasFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresasRoutingModule { }
