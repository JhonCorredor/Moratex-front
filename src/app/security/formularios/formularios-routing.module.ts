import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
// import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { FormulariosFormComponent } from './formularios-form/formularios-form.component';
import { FormulariosIndexComponent } from './formularios-index/formularios-index.component';

const routes: Routes = [
  { path: '', component: FormulariosIndexComponent, canActivate: [AuthGuard]
  //  canActivate: [AuthGuard] 
  },
  // { path: 'crear', component: FormulariosFormComponent, canActivate: [AuthGuard] },
  // { path: 'editar/:id', component: FormulariosFormComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormulariosRoutingModule { }
