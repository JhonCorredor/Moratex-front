import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { GeneralidadesFormComponent } from '../generalidades/generalidades-form/generalidades-form.component';
import { ModelosFormComponent } from './modelos-form/modelos-form.component';
import { ModelosIndexComponent } from './modelos-index/modelos-index.component';

const routes: Routes = [
  { path: '', component: ModelosIndexComponent, canActivate: [AuthGuard] },
  { path: 'crear', component: ModelosFormComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: ModelosFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelosRoutingModule { }
