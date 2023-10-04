import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { FichaTecnicaIndexComponent } from './ficha-tecnica-index/ficha-tecnica-index.component';
import { FichaTenicaVerComponent } from './ficha-tenica-ver/ficha-tenica-ver.component';

const routes: Routes = [
  {path: '', component: FichaTecnicaIndexComponent, canActivate: [AuthGuard]},
  {path: 'ver/:id', component: FichaTenicaVerComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FichaTecnicaRoutingModule { }
