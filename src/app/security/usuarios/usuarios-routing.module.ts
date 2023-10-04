import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { UsuariosFormComponent } from './usuarios-form/usuarios-form.component';
import { UsuariosIndexComponent } from './usuarios-index/usuarios-index.component';

const routes: Routes = [
  { path: '', component: UsuariosIndexComponent, canActivate: [AuthGuard] },
  { path: 'crear', component: UsuariosFormComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: UsuariosFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
