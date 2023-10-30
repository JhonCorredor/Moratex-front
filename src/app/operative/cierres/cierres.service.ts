import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CierresService {
  private url = environment.url;
  private header = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.header.set('Content-Type', 'application/json');
  }

  public datatable(data: DatatableParameter): Observable<any> {
    return this.http.get<any>(
      `${this.url}Cierres/datatable?PageNumber=${data.pageNumber}&PageSize=${data.pageSize}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}`,
      { headers: this.header }
    );
  }

  public GetArchivoCierre(id : any) : Observable<any> {
    return this.http.get<any>(`${this.url}Cierres/GetArchivoCierre/${id}`, {headers: this.header});
  }

  public getById(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}Cierres/${id}`, {
      headers: this.header,
    });
  }

  public getAll(): Observable<any> {
    return this.http.get<any>(`${this.url}Cierres`, { headers: this.header });
  }

  public save(id: any, data: any): Observable<any> {
    if (id) {
      return this.http.put<any>(`${this.url}Cierres/${id}`, data, {
        headers: this.header,
      });
    }
    return this.http.post<any>(`${this.url}Cierres`, data, {
      headers: this.header,
    });
  }

  public delete(id: any): Observable<any> {
    return this.http.delete<any>(`${this.url}Cierres/${id}`, {
      headers: this.header,
    });
  }
}
