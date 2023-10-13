import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'procedimientos',
    loadChildren: () =>
      import('./Procedimientos/procedimientos.module').then(
        (m) => m.ProcedimientosModule
      ),
  },

  {
    path: 'generar-cotizaciones',
    loadChildren: () =>
      import('./generar-cotizacion/generar-cotizacion.module').then(
        (m) => m.GenerarCotizacionModule
      ),
  },
  {
    path: 'generar-cotizacion-manual',
    loadChildren: () =>
      import(
        './generar-cotizacion-manual/generar-cotizacion-manual.module'
      ).then((m) => m.GenerarCotizacionManualModule),
  },
  {
    path: 'cotizaciones',
    loadChildren: () =>
      import('./cotizaciones/cotizaciones.module').then(
        (m) => m.CotizacionesModule
      ),
  },
  {
    path: 'pedidos',
    loadChildren: () =>
      import('./pedidos/pedidos.module').then((m) => m.PedidosModule),
  },
  {
    path: 'pedidos-detalles',
    loadChildren: () =>
      import('./pedidos-detalles/pedidos-detalles.module').then(
        (m) => m.PedidosDetallesModule
      ),
  },
  {
    path: 'consolidados',
    loadChildren: () =>
      import('./consolidados/consolidados.module').then(
        (m) => m.ConsolidadosModule
      ),
  },
  {
    path: 'talleres',
    loadChildren: () =>
      import('./talleres/talleres.module').then((m) => m.TalleresModule),
  },
  {
    path: 'ordenes-produccion',
    loadChildren: () =>
      import('./ordenes-produccion/ordenes-produccion.module').then(
        (m) => m.OrdenesProduccionModule
      ),
  },
  {
    path: 'ordenesPedidos',
    loadChildren: () =>
      import('./ordenes-pedidos/ordenes-pedidos.module').then(
        (m) => m.OrdenesPedidosModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperativeRoutingModule {}
