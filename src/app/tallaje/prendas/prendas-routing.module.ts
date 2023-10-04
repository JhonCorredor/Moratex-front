import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { PrendasFormComponent } from './prendas-form/prendas-form.component';
import { PrendasIndexComponent } from './prendas-index/prendas-index.component';

const routes: Routes = [
  { path: '', component: PrendasIndexComponent, canActivate: [AuthGuard] },
  { path: 'crear', component: PrendasFormComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: PrendasFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrendasRoutingModule { }
