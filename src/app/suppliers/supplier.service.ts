import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { throwError } from 'rxjs';
import { Supplier } from './supplier';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private http: HttpClient) { }
  suppliersUrl = 'api/suppliers';

  // Get suppiers
   // Get Suppliers
    suppliers$ = this.http.get<Supplier[]>(this.suppliersUrl)
    .pipe(
      tap(suppliersData => console.log('Suppliers Data :', suppliersData)),
      catchError(this.handleError)
    );

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
