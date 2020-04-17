import { Component, OnInit } from '@angular/core';

import { Subscription, of, EMPTY } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html'
})
export class ProductListAltComponent implements OnInit {
  pageTitle = 'Products';
  errorMessage = '';
  selectedProductId;

  products$ = this.productService.products$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
);
  sub: Subscription;

  constructor(private productService: ProductService) { }

  ngOnInit(): void { }


  onSelected(productId: number): void {
    console.log('Not yet implemented');
  }
}
