import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { RolesFormComponent } from './roles-form/roles-form.component';
import { RolesIndexComponent } from './roles-index/roles-index.component';

const routes: Routes = [
  { path: '', component: RolesIndexComponent, canActivate: [AuthGuard] },
  { path: 'crear', component: RolesFormComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: RolesFormComponent, canActivate: [AuthGuard] }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
