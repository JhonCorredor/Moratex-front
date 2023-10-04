import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { GeneralParameterIndexComponent } from './general-parameter-index/general-parameter-index.component';

const routes: Routes = [{ path: '', component: GeneralParameterIndexComponent, canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralParameterRoutingModule { }
