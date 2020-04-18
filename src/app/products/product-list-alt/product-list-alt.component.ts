import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Subscription, of, EMPTY, Subject } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent implements OnInit {

  constructor(private productService: ProductService) { }
  pageTitle = 'Products List';
  private errorMessageSubject  = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  selectedProduct$ = this.productService.selectedProduct$;

  // List of products with their category
  products$ = this.productService.productWithCategory$.pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  sub: Subscription;

  ngOnInit(): void { }


  onSelected(productId: number): void {
    this.productService.slecetedProductChanged(productId);
  }




}
