import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
// import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { CotizacionesFormComponent } from './cotizaciones-form/cotizaciones-form.component';
import { CotizacionesIndexComponent } from './cotizaciones-index/cotizaciones-index.component';

const routes: Routes = [
  { path: '', component: CotizacionesIndexComponent, canActivate: [AuthGuard] },
  { path: 'crear', component: CotizacionesFormComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: CotizacionesFormComponent, canActivate: [AuthGuard] },
  { path: 'ver/:id', component: CotizacionesFormComponent, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizacionesRoutingModule { }
