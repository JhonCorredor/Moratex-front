import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'medios', loadChildren: () => import('../parameters/general-parameter/general-parameter.module').then(m => m.GeneralParameterModule), data: { ruta: 'Medios', titulo: "Medios" , modulo :  "Pqrs" , iconModule: "fas fa-cogs"} },
  { path: 'tiposRadicados', loadChildren: () => import('../parameters/general-parameter/general-parameter.module').then(m => m.GeneralParameterModule), data: { ruta: 'tiposRadicados', titulo: "Tipos Radicados" , modulo :  "Pqrs" , iconModule: "fas fa-cogs"} },
  { path: 'radicado' , loadChildren: () => import('./radicado/radicado.module').then( m => m.RadicadosModule) , data : { admin : true } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PqrsRoutingModule { }
