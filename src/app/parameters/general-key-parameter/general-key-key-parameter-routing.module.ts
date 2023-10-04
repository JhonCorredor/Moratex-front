import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/admin/guards/auth.guard';
import { GeneralKeyParameterIndexComponent } from './general-key-parameter-index/general-key-parameter-index.component';

const routes: Routes = [{ path: '', component: GeneralKeyParameterIndexComponent, canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralKeyParameterRoutingModule { }
