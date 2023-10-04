import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { GenerarCotizacionIndexComponent } from './generar-cotizacion-index/generar-cotizacion-index.component';
import { PrecotizacionComponent } from './precotizacion/precotizacion.component';

const routes: Routes = [
  { path: '', component: GenerarCotizacionIndexComponent, canActivate: [AuthGuard]},
  { path: 'precotizacion/:empresaid/:iva', component: PrecotizacionComponent, canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerarCotizacionRoutingModule { }
