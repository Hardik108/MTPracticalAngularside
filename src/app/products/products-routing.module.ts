import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './products.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [{ path: '', component: ProductsComponent }, { path: 'manage', component: ManageComponent }, { path: 'manage/:id', component: ManageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
