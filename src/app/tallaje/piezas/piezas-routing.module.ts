import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { PiezasFormComponent } from './piezas-form/piezas-form.component';
import { PiezasIndexComponent } from './piezas-index/piezas-index.component';

const routes: Routes = [
  { path: '', component: PiezasIndexComponent, canActivate: [AuthGuard] },
  { path: 'crear', component: PiezasFormComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: PiezasFormComponent, canActivate: [AuthGuard] }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PiezasRoutingModule { }
