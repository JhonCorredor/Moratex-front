import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { InventariosFormComponent } from './inventarios-form/inventarios-form.component';
import { InventariosIndexComponent } from './inventarios-index/inventarios-index.component';

const routes: Routes = [
  // { path: '', component: InventariosIndexComponent, canActivate: [AuthGuard] }
  
  { path: '', component: InventariosIndexComponent, canActivate: [AuthGuard] },
  { path: 'crear', component: InventariosFormComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: InventariosFormComponent , canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventariosRoutingModule { }
