import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { GenerarCotizacionManualIndexComponent } from './generar-cotizacion-manual-index/generar-cotizacion-manual-index.component';

const routes: Routes = [
  { path: '', component: GenerarCotizacionManualIndexComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerarCotizacionManualRoutingModule { }
