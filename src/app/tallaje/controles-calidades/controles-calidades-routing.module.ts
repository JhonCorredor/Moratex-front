import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { ControlesCalidadesIndexComponent } from './controles-calidades-index/controles-calidades-index.component';

const routes: Routes = [
  {path: '', component: ControlesCalidadesIndexComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlesCalidadesRoutingModule { }
