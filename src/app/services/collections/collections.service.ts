import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ApiResult {
  page: number;
  results: any[];
  totalPages: number;
  totalResults: number;
}

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  constructor(private http: HttpClient) { }

  getPayments(page = 1, mode = 0): Observable<ApiResult> {
    // return this.http.get<ApiResult>(
    //   `${environment.baseUrl}/movie/popular?page=${page}&api_key=${environment.apiKey}`
    // );
    return this.getJSON(page, mode);
  }

  public getJSON(page: number, mode: number): Observable<ApiResult> {
    return this.http.get<ApiResult>(`../assets/myData${mode}.json`);

  }

  // getMovieDetails(id: string): Observable<any> {
  //   return this.http.get<ApiResult>(
  //     `${environment.baseUrl}/movie/${id}?api_key=${environment.apiKey}`
  //   );
  // }
}
