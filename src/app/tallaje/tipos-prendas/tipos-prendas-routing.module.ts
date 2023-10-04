import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { TiposPrendasIndexComponent } from './tipos-prendas-index/tipos-prendas-index.component';

const routes: Routes = [{ path: '', component: TiposPrendasIndexComponent, canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiposPrendasRoutingModule { }
