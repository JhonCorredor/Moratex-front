import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { OperacionesFormComponent } from './operaciones-form/operaciones-form.component';
import { OperacionesIndexComponent } from './operaciones-index/operaciones-index.component';

const routes: Routes = [
  { path: '', component: OperacionesIndexComponent, canActivate: [AuthGuard]},
  { path: 'crear', component: OperacionesFormComponent, canActivate: [AuthGuard]},
  { path: 'editar/:id', component: OperacionesFormComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperacionesRoutingModule { }
