import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TalleresService {

  private BASE_URL = environment.url + "Talleres/";
  private headers = new HttpHeaders({
    "Content-Type": "application/json"
  });

  constructor(private http: HttpClient) { }

  public getDatatable( data : DatatableParameter) : Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}datatable?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}`, {headers: this.headers});
  }

  public getTallerById(id : any) : Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}${id}`, {headers: this.headers});
  }

  public save(id : any, data : any) : Observable<any> {
    if (id != null && id != undefined) {
      return this.http.put<any>(`${this.BASE_URL}${id}`, JSON.stringify(data), {headers: this.headers});
    } else {
      return this.http.post<any>(`${this.BASE_URL}`, JSON.stringify(data), {headers: this.headers});
    }
  }

  public delete(id : any ) : Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}${id}`, {headers: this.headers});
  }
}
