import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { MaquinariasIndexComponent } from './maquinarias-index/maquinarias-index.component';

const routes: Routes = [{ path: '', component: MaquinariasIndexComponent, canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaquinariasRoutingModule { }
