import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { ProductService } from '../product.service';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';


@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit{
  pageTitle = 'Product Detail';
  errorMessage = '';


  // Get a single product
  product$ = this.productService.selectedProduct$
  .pipe(
    tap(products => console.log('The product returned from ProductDetailComponent.product$() => :', JSON.stringify(products))),
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );


  constructor(private productService: ProductService) { }


  ngOnInit() {
    console.warn('Not yet Implemented!');
}


}
