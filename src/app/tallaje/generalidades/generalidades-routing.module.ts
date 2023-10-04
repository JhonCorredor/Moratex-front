import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
// import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { GeneralidadesFormComponent } from './generalidades-form/generalidades-form.component';
import { GeneralidadesIndexComponent } from './generalidades-index/generalidades-index.component';

const routes: Routes = [
  { path: '', component: GeneralidadesIndexComponent, canActivate: [AuthGuard] },
  { path: 'crear', component: GeneralidadesFormComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: GeneralidadesFormComponent, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralidadesRoutingModule { }
