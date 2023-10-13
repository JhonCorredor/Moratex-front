import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { CostosFormComponent } from './costos-form/costos-form.component';
import { CostosIndexComponent } from './costos-index/costos-index.component';

const routes: Routes = [
  { path: '', component: CostosIndexComponent, canActivate: [AuthGuard] },
  {
    path: 'crear',
    component: CostosFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'editar/:id',
    component: CostosFormComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CostosRoutingModule {}
