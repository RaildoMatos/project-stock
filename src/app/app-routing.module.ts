import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: 'products',
  //   loadComponent: () =>
  //     import('./components/products/products.component').then(
  //       (x) => x.ProductsComponent
  //     ),
  //   // canActivate:[authGuard]
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
