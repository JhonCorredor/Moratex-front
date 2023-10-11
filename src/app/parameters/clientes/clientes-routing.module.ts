import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { ClientesFormComponent } from './clientes-form/clientes-form.component';
import { ClientesIndexComponent } from './clientes-index/clientes-index.component';

const routes: Routes = [
  { path: '', component: ClientesIndexComponent, canActivate: [AuthGuard] },
  { path: 'crear', component: ClientesFormComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: ClientesFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
