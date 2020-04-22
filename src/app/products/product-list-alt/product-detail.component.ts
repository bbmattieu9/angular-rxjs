import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { ProductService } from '../product.service';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
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

  errorMesssageSubject = new Subject<string>();
  errorMessage$ = this.errorMesssageSubject.asObservable();

  productSuppliers$ = this.productService.selectedProductSuppliers$
  .pipe(
    catchError(err => {
      this.errorMesssageSubject.next(err);
      return EMPTY;
    })
  );


  // Get a single product
  product$ = this.productService.selectedProduct$
  .pipe(
    tap(product =>
      console.log('The product returned from ProductDetailComponent.product$() => :', JSON.stringify(product))),
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
