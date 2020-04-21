import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { throwError, combineLatest, of } from 'rxjs';
import { Supplier } from './supplier';
import { tap, catchError, map, concatMap, mergeMap, switchMap } from 'rxjs/operators';
import { ProductService } from '../products/product.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {


  suppliersUrl = 'api/suppliers';

   // Get Suppliers
    suppliers$ = this.http.get<Supplier[]>(this.suppliersUrl)
    .pipe(
      tap(suppliersData => console.log('Suppliers Data :', JSON.stringify(suppliersData))),
      catchError(this.handleError)
    );


    // higher-order mapping operators
    // concatMap()
    suppliersWithConactMap$ = of(1, 5, 8)
    .pipe(tap(id => console.log('concatMap source Observable', id)),
    concatMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`)));

    // mergeMap()
    suppliersWithMergeMap$ = of(1, 5, 8)
    .pipe(tap(id => console.log('concatMap source Observable', id)),
    mergeMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`)));

    // mergeMap()
    suppliersWithSwitchMap$ = of(1, 5, 8)
    .pipe(tap(id => console.log('switchtMap source Observable', id)),
    switchMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`)));


    constructor(private http: HttpClient,
                ) {
      this.suppliersWithConactMap$.subscribe(item => console.log('concatMap result', item));
      this.suppliersWithMergeMap$.subscribe(item => console.log('mergeMap result', item));
      this.suppliersWithSwitchMap$.subscribe(item => console.log('switchMap result', item));
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
