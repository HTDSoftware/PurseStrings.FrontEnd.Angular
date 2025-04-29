import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggingService } from '../../../core/services/logging.service';
import { Item, ItemDTO, PaginatedItems } from '../models/item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private readonly baseUrl: string = '/api/Items';

  constructor(private http: HttpClient, private logger: LoggingService) { }

  getAll(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.baseUrl}/ListAllItems`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getDetails(itemName: string): Observable<Item> {
    const encodedItemName = encodeURIComponent(itemName);
    return this.http.get<Item>(`${this.baseUrl}/GetItemDetails?itemName=${encodedItemName}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getAllDTOAsOfDate(asOfDate: Date): Observable<ItemDTO[]> {
    const datePipe = new DatePipe('en-AU');
    const formattedDate = datePipe.transform(asOfDate, 'yyyy-MM-dd') || '';
    const encodedAsOfDate = encodeURIComponent(formattedDate);

    return this.http.get<ItemDTO[]>(`${this.baseUrl}/ListAllItemsDTO?asOfDate=${encodedAsOfDate}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getAllPaginated(pageIndex: number = 0, pageSize: number = 30): Observable<PaginatedItems> {
    const encodedPageIndex = encodeURIComponent(pageIndex.toString());
    const encodedPageSize = encodeURIComponent(pageSize.toString());
    return this.http
      .get<PaginatedItems>(`${this.baseUrl}/GetItemsPaginated?pageIndex=${encodedPageIndex}&pageSize=${encodedPageSize}`)
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.logger.sendLog({
      level: 'ERR',
      component: 'item.service.ts',
      message: `Error: ${JSON.stringify(error)}`
    });

    return throwError(() => new Error(error.message || 'Server error'));
  }
}
