import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Observable, of, EMPTY, Subject, combineLatest, BehaviorSubject } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { catchError, map } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  pageTitle = 'Product List';
  errorMessage = '';
  // categories;

  // Creating Action stream
  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  products$ = combineLatest([
    this.productService.addNewProduct$,
    this.categorySelectedAction$
  ]).pipe(
    map(([products, selectedCategoryId]) =>
        products.filter(product => selectedCategoryId ? product.categoryId === selectedCategoryId : true)),
    catchError(err => {
      this.errorMessage = err;
      return of([]);

      // or

      // return EMPTY;
    })
);


categories$ = this.productCategorySrv.productCategories$
  .pipe(
  catchError(err => {
    this.errorMessage = err;
    return EMPTY;
  })
);


// productsSimpleFilter$ = this.productService.productWithCategory$.pipe(
//   map(products =>
//     products.filter(product => this.selectedCategoryId ? product.categoryId === this.selectedCategoryId : true )
//   )
// );

  constructor(private productService: ProductService,
              private productCategorySrv: ProductCategoryService) { }

  ngOnInit(): void {

  }

  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
