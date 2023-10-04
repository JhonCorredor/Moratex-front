import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestGuard } from '../admin/guards/guest.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
 
  // MODULO SEGURIDAD
  { path: "", component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'roles', loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule) },
  { path: 'personas', loadChildren: () => import('./personas/personas.module').then(m => m.PersonasModule) },
  { path: 'usuarios', loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule) },  
  { path: 'formularios', loadChildren: () => import('./formularios/formularios.module').then(m => m.FormulariosModule) },
  { path: 'modulos',  loadChildren: () => import('./modulos/modulos.module').then(m => m.ModulosModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
