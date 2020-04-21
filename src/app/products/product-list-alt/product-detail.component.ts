import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { ProductService } from '../product.service';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Supplier } from 'src/app/suppliers/supplier';
import { SupplierService } from 'src/app/suppliers/supplier.service';


@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit{
  pageTitle = 'Product Detail';
  errorMessage = '';

  productSuppliers$ = this.supplierService.suppliers$.pipe(
    tap(
      supplierDetail => console.log(' SupplierInfo :', JSON.stringify(supplierDetail))
    )
  );


  // Get a single product
  product$ = this.productService.selectedProduct$
  .pipe(
    tap(products => console.log('The product returned from ProductDetailComponent.product$() => :', JSON.stringify(products))),
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );


  constructor(private productService: ProductService,
              private supplierService: SupplierService) { }


  ngOnInit() {
    console.warn('Not yet Implemented!');
}


}
