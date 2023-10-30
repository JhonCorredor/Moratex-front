import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { CierresFormComponent } from './cierres-form/cierres-form.component';
import { CierresIndexComponent } from './cierres-index/cierres-index.component';

const routes: Routes = [
  { path: '', component: CierresIndexComponent, canActivate: [AuthGuard] },
  {
    path: 'crear',
    component: CierresFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'editar/:id',
    component: CierresFormComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CierresRoutingModule {}
