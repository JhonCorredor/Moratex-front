import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { EmpleadosFormComponent } from './empleados-form/empleados-form.component';
import { EmpleadosIndexComponent } from './empleados-index/empleados-index.component';

const routes: Routes = [
  { path: '', component: EmpleadosIndexComponent, canActivate: [AuthGuard] },
  { path: 'crear', component: EmpleadosFormComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: EmpleadosFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadosRoutingModule { }
