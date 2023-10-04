import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'criterios-aceptaciones', loadChildren: () => import('../parameters/general-key-parameter/general-key-parameter.module').then(m => m.GeneralKeyParameterModule), 
    data: { ruta: 'CriteriosAceptaciones', titulo: "Criterios Aceptaciones"  , foreignKeyRuta : "tipoCriterioAceptacion" , foreignKeyTitle:'Tipo Criterio Aceptacion' ,  serviceKey:"TiposCriteriosAceptaciones"  , modulo :  "Pqrs" , iconModule: "fas fa-cogs"} },
  { path: 'tallas',  loadChildren: () => import('../parameters/general-key-parameter/general-key-parameter.module').then(m => m.GeneralKeyParameterModule),
    data: { ruta: 'Tallas', titulo: "Tallas"  , foreignKeyRuta : "tipoTalla" , foreignKeyTitle:'Tipo Talla' ,  serviceKey:"TiposTallas"  , modulo :  "Pqrs" , iconModule: "fas fa-cogs"} },
 
  { path: 'tipos-piezas', loadChildren: () => import('../parameters/general-parameter/general-parameter.module').then(m => m.GeneralParameterModule), data: { ruta: 'TiposPiezas', titulo: "Tipos Piezas" , modulo :  "Pqrs" , iconModule: "fas fa-cogs" } },
  { path: 'tipos-tallas', loadChildren: () => import('../parameters/general-parameter/general-parameter.module').then(m => m.GeneralParameterModule), data: { ruta: 'TiposTallas', titulo: "Tipos Tallas" , modulo :  "Pqrs" , iconModule: "fas fa-cogs" } },
  { path: 'tipos-operaciones', loadChildren: () => import('../parameters/general-parameter/general-parameter.module').then(m => m.GeneralParameterModule), data: { ruta: 'TiposOperaciones', titulo: "Tipos Operaciones" , modulo :  "Pqrs" , iconModule: "fas fa-cogs" } },
  
  { path: 'tipos-prendas', loadChildren: () => import('./tipos-prendas/tipos-prendas.module').then(m => m.TiposPrendasModule), },
  { path: 'generalidades', loadChildren: () => import('./generalidades/generalidades.module').then(m => m.GeneralidadesModule) },
  { path: 'modelos', loadChildren: () => import('./modelos/modelos.module').then(m => m.ModelosModule) },
  { path: 'prendas', loadChildren: () => import('./prendas/prendas.module').then(m => m.PrendasModule)  },
  { path: 'maquinarias', loadChildren: () => import('./maquinarias/maquinarias.module').then(m => m.MaquinariasModule) },
  { path: 'operaciones', loadChildren: () => import('./operaciones/operaciones.module').then(m => m.OperacionesModule) },
  { path: 'controles-calidades', loadChildren: () => import('./controles-calidades/controles-calidades.module').then(m => m.ControlesCalidadesModule) },
  { path: 'piezas', loadChildren: () => import('./piezas/piezas.module').then(m => m.PiezasModule) },
  { path: 'ficha-tecnica', loadChildren: () => import('./ficha-tecnica/ficha-tecnica.module').then(m => m.FichaTecnicaModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TallajeRoutingModule { }
