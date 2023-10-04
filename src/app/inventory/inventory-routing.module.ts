import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  { path: 'unidades-medidas', loadChildren: () => import('../parameters/general-parameter/general-parameter.module').then(m => m.GeneralParameterModule), 
   data: { ruta: 'UnidadesMedidas', titulo: "Unidades Medidas" , modulo :  "Inventario" , iconModule: "fas fa-cogs" ,  iconTitulo: "fa-solid fa-ruler-horizontal"} },
  //  <i class="fa-solid fa-ruler-horizontal"></i>
  { path: 'marcas', loadChildren: () => import('../parameters/general-parameter/general-parameter.module').then(m => m.GeneralParameterModule),
   data: { ruta: 'Marcas', titulo: "Marcas" , modulo :  "Inventario" , iconModule: "fas fa-cogs" , iconTitulo: "fa-solid fa-ruler-horizontal"} },
  { path: 'categorias', loadChildren: () => import('../parameters/general-parameter/general-parameter.module').then(m => m.GeneralParameterModule),
   data: { ruta: 'Categorias', titulo: "Categorias" , modulo :  "Inventario" , iconModule: "fas fa-cogs"} },
  { path: 'tipos-estados', loadChildren: () => import('../parameters/general-parameter/general-parameter.module').then(m => m.GeneralParameterModule),
   data: { ruta: 'TiposEstados', titulo: "Tipos Estados" , modulo :  "Inventario" , iconModule: "fas fa-cogs" } },
  // { path: 'tipos-caracteristicas', loadChildren: () => import('../parameters/general-parameter/general-parameter.module').then(m => m.GeneralParameterModule),
  //  data: { ruta: 'TiposCaracteristicas', titulo: "Tipos Caracteristicas" ,  modulo :  "Inventario" , iconModule: "fas fa-cogs"} },
  
  { path: 'estados', loadChildren:  () => import('../parameters/general-key-parameter/general-key-parameter.module').then(m => m.GeneralKeyParameterModule),
   data: { ruta: 'Estados', titulo: "Estados"  , foreignKeyRuta : "tipoEstado" , foreignKeyTitle:'Tipo de Estado' , serviceKey:"TiposEstados"  ,  modulo :  "Inventario" , iconModule: "fas fa-cogs"} },
  
  { path: 'inventarios', loadChildren: () => import('./inventarios/inventarios.module').then(m => m.InventariosModule) },
  { path: 'productos', loadChildren: () => import('./productos/productos.module').then(m => m.ProductosModule) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
