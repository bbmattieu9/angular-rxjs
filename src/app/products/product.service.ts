import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError, combineLatest, BehaviorSubject, Subject, merge } from 'rxjs';
import { catchError, tap, map, scan, shareReplay } from 'rxjs/operators';

import { Product } from './product';
import { Supplier } from '../suppliers/supplier';
import { SupplierService } from '../suppliers/supplier.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient,
              private supplierService: SupplierService,
              private procductCatergoryService: ProductCategoryService) { }
  private productsUrl = 'api/products';
  private suppliersUrl = this.supplierService.suppliersUrl;

  // create an action stream for product selected from drop-down list
  private productSelectedSubject = new BehaviorSubject<number>(0);
  productSelectedAction$ = this.productSelectedSubject.asObservable();


  // create an action stream for the InsertedProduct
  private productInsertedSubject = new Subject<Product>();
  productInsertedAction$ = this.productInsertedSubject.asObservable();


  // Get all products
  products$ = this.http.get<Product[]>(this.productsUrl)
  .pipe(
    tap(data => console.log('Products: ', JSON.stringify(data))),
    catchError(this.handleError)
  );


  // Get all products with their category then increase product price by 1.5
  productWithCategory$ = combineLatest([
    this.products$,
    this.procductCatergoryService.productCategories$
  ]).pipe(
      map(([products, catergories]) =>
        products.map(product => ({
          ...product,
          price: product.price * 1.5,
          category: catergories.find(c => product.categoryId === c.id).name,
          searchKey: [product.productName]
        }) as Product)
      ),
      shareReplay(1),
  );

  selectedProduct$ = combineLatest([
    this.productWithCategory$,
    this.productSelectedAction$
  ])
  .pipe(
    map(([products, selectedProductId]) =>
        products.find(product => product.id === selectedProductId)),
    tap(product => console.log(`Selected-Product is: ${product}`)),
    shareReplay(1)
  );

    addNewProduct$ = merge(
      this.productWithCategory$,
      this.productInsertedAction$
    ).pipe(
      scan((acc: Product[], value: Product) => [...acc, value])
    );

    addProduct(newProduct?: Product) {
      newProduct = newProduct || this.fakeProduct();
      this.productInsertedSubject.next(newProduct);
    }

  slecetedProductChanged(selectedProductId: number): void {
    this.productSelectedSubject.next(selectedProductId);
  }


  private fakeProduct() {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      category: 'Toolbox',
      quantityInStock: 30
    };
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
