import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'bancos',
    loadChildren: () =>
      import('./general-parameter/general-parameter.module').then(
        (m) => m.GeneralParameterModule
      ),
    data: {
      ruta: 'Bancos',
      titulo: ' Banco',
      modulo: 'Parametros',
      iconModule: 'fas fa-cogs',
    },
  },
  {
    path: 'paises',
    loadChildren: () =>
      import('./general-parameter/general-parameter.module').then(
        (m) => m.GeneralParameterModule
      ),
    data: {
      ruta: 'Paises',
      titulo: ' Paises',
      modulo: 'Parametros',
      iconModule: 'fas fa-cogs',
    },
  },
  {
    path: 'medidas',
    loadChildren: () =>
      import('./general-parameter/general-parameter.module').then(
        (m) => m.GeneralParameterModule
      ),
    data: {
      ruta: 'Medidas',
      titulo: ' Medidas',
      modulo: 'Parametros',
      iconModule: 'fas fa-cogs',
    },
  },
  {
    path: 'cargos',
    loadChildren: () =>
      import('./general-parameter/general-parameter.module').then(
        (m) => m.GeneralParameterModule
      ),
    data: { ruta: 'Cargos', titulo: 'Cargos', modulo: 'Parametros' },
  },
  {
    path: 'bodegas',
    loadChildren: () =>
      import('./general-parameter/general-parameter.module').then(
        (m) => m.GeneralParameterModule
      ),
    data: { ruta: 'Bodegas', titulo: 'Bodegas', modulo: 'Parametros' },
  },
  {
    path: 'unidadesMedidas',
    loadChildren: () =>
      import('./general-parameter/general-parameter.module').then(
        (m) => m.GeneralParameterModule
      ),
    data: {
      ruta: 'UnidadesMedidas',
      titulo: 'Unidades de Medidas',
      modulo: 'Parametros',
    },
  },
  {
    path: 'categorias',
    loadChildren: () =>
      import('./general-parameter/general-parameter.module').then(
        (m) => m.GeneralParameterModule
      ),
    data: {
      ruta: 'Categorias',
      titulo: 'Categorias',
      modulo: 'Parametros',
    },
  },
  {
    path: 'tiposEstados',
    loadChildren: () =>
      import('./general-parameter/general-parameter.module').then(
        (m) => m.GeneralParameterModule
      ),
    data: {
      ruta: 'TiposEstados',
      titulo: 'TiposEstados',
      modulo: 'Parametros',
    },
  },
  {
    path: 'mediosPagos',
    loadChildren: () =>
      import('./general-parameter/general-parameter.module').then(
        (m) => m.GeneralParameterModule
      ),
    data: {
      ruta: 'MediosPagos',
      titulo: 'MediosPagos',
      modulo: 'Parametros',
    },
  },

  {
    path: 'estados',
    loadChildren: () =>
      import('./general-key-parameter/general-key-parameter.module').then(
        (m) => m.GeneralKeyParameterModule
      ),
    data: {
      ruta: 'Estados',
      titulo: 'Estados',
      foreignKeyRuta: 'tipoEstado',
      foreignKeyTitle: 'Tipo Estado',
      serviceKey: 'TiposEstados',
      modulo: 'Parametros',
      iconModule: 'fas fa-cogs',
    },
  },
  {
    path: 'departamentos',
    loadChildren: () =>
      import('./general-key-parameter/general-key-parameter.module').then(
        (m) => m.GeneralKeyParameterModule
      ),
    data: {
      ruta: 'Departamentos',
      titulo: 'Departamentos',
      foreignKeyRuta: 'pais',
      foreignKeyTitle: 'Pais',
      serviceKey: 'Paises',
      modulo: 'Parametros',
      iconModule: 'fas fa-cogs',
    },
  },
  {
    path: 'sedes',
    loadChildren: () =>
      import('./general-key-parameter/general-key-parameter.module').then(
        (m) => m.GeneralKeyParameterModule
      ),
    data: {
      ruta: 'Sedes',
      titulo: 'Sedes',
      foreignKeyRuta: 'empresa',
      foreignKeyTitle: 'Empresa',
      serviceKey: 'Empresas',
      modulo: 'Parametros',
      iconModule: 'fas fa-cogs',
    },
  },
  {
    path: 'areas',
    loadChildren: () =>
      import('./general-key-parameter/general-key-parameter.module').then(
        (m) => m.GeneralKeyParameterModule
      ),
    data: {
      ruta: 'Areas',
      titulo: 'Areas',
      foreignKeyRuta: 'sede',
      foreignKeyTitle: 'Sede',
      serviceKey: 'Sedes',
      modulo: 'Parametros',
      iconModule: 'fas fa-cogs',
    },
  },
  {
    path: 'ciudades',
    loadChildren: () =>
      import('./general-key-parameter/general-key-parameter.module').then(
        (m) => m.GeneralKeyParameterModule
      ),
    data: {
      ruta: 'Ciudades',
      titulo: 'Ciudades',
      foreignKeyRuta: 'departamento',
      foreignKeyTitle: 'Departamento',
      serviceKey: 'Departamentos',
      modulo: 'Parametros',
      iconModule: 'fas fa-cogs',
    },
  },

  {
    path: 'archivo',
    loadChildren: () =>
      import('./archivo/archivo.module').then((m) => m.ArchivoModule),
  },
  {
    path: 'proveedores',
    loadChildren: () =>
      import('./proveedor/proveedores.module').then((m) => m.ProveedoresModule),
  },
  {
    path: 'empresas',
    loadChildren: () =>
      import('./empresas/empresas.module').then((m) => m.EmpresasModule),
  },
  {
    path: 'empleados',
    loadChildren: () =>
      import('./empleados/empleados.module').then((m) => m.EmpleadosModule),
  },
  {
    path: 'clientes',
    loadChildren: () =>
      import('./clientes/clientes.module').then((m) => m.ClientesModule),
  },
  {
    path: 'factura-compra',
    loadChildren: () =>
      import('./factura-compra/factura-compra.module').then(
        (m) => m.FacturaCompraModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParametersRoutingModule {}
