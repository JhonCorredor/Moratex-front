import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ControlesCalidadesService {

  private url = environment.url;
  private header = new HttpHeaders();

  constructor(private http: HttpClient) { 
    this.header.set("Content-Type", "application/json");
  }

  public datatable(data: DatatableParameter) : Observable<any> {
    return this.http.get<any>(`${this.url}ControlesCalidades/datatable?PageNumber=${data.pageNumber}&PageSize=${data.pageSize}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}`, {headers: this.header})
  }

  public getById(id: any) : Observable<any> {
    return this.http.get<any>(`${this.url}ControlesCalidades/${id}`, {headers: this.header});
  }

  public getAll() : Observable<any> {
    return this.http.get<any>(`${this.url}ControlesCalidades/AllSelect`, {headers: this.header});
  }

  public save(id: any, data: any) : Observable<any> {
    if (id) {
      return this.http.put<any>(`${this.url}ControlesCalidades/${id}`, data, {headers: this.header});
    }
    return this.http.post<any>(`${this.url}ControlesCalidades`, data, {headers: this.header});
  }

  public delete(id: any) : Observable<any> {
    return this.http.delete<any>(`${this.url}ControlesCalidades/${id}`, {headers: this.header});
  }
}
