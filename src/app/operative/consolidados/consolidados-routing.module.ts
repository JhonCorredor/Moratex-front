import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { ArmarConsolidadoComponent } from './armar-consolidado/armar-consolidado.component';

const routes: Routes = [
  { path: 'armar-consolidado/:cotizacionid', component: ArmarConsolidadoComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsolidadosRoutingModule { }
