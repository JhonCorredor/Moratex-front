import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { RadicadosFormComponent } from './radicado-form/radicado-form.component';
import { RadicadosIndexComponent } from './radicado-index/radicado-index.component';

const routes: Routes = [
  { path: '', component: RadicadosIndexComponent },
  { path: 'crear'  , component: RadicadosFormComponent , canActivate: [AuthGuard]},
  { path: 'editar/:id'  , component: RadicadosFormComponent , canActivate: [AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RadicadosRoutingModule { }
