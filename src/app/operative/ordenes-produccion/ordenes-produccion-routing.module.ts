import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpFormComponent } from './op-form/op-form.component';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';

const routes: Routes = [
  {path: 'ordenes-produccion-create/:consolidadodetalleid', component: OpFormComponent, canActivate: [AuthGuard]},
  {path: 'editar/:id', component: OpFormComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenesProduccionRoutingModule { }
