import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { ProcedimientosFormComponent } from './procedimientos-form/procedimientos-form.component';
import { ProcedimientosIndexComponent } from './procedimientos-index/procedimientos-index.component';

const routes: Routes = [
  {
    path: '',
    component: ProcedimientosIndexComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'crear',
    component: ProcedimientosFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'editar/:id',
    component: ProcedimientosFormComponent,
    canActivate: [AuthGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcedimientosRoutingModule {}
