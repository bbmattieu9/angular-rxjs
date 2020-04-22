import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { ProductService } from '../product.service';
import { catchError, tap, map, filter } from 'rxjs/operators';
import { EMPTY, Subject, combineLatest } from 'rxjs';
import { Supplier } from 'src/app/suppliers/supplier';
import { SupplierService } from 'src/app/suppliers/supplier.service';
import { Product } from '../product';


@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit{
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

  pageTitle$ = this.product$
  .pipe(
    map((p: Product) => p ?  `Product Detail for: ${p.productName}` : null)
  );


  // Combining all streams together
  vm$ = combineLatest([
      this.product$,
      this.productSuppliers$,
      this.pageTitle$
  ]).pipe(
    filter(([product]) => Boolean(product)),
    map(([product, productSuppliers, pageTitle]) =>
    ({ product, productSuppliers, pageTitle}))
  );

  constructor(private productService: ProductService,
              private supplierService: SupplierService) { }


  ngOnInit() {
    console.warn('Not yet Implemented!');
}


}
