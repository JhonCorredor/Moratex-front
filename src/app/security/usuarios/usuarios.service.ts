import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private url = environment.url;
  private header = new HttpHeaders();

  constructor(private http: HttpClient) { 
  }

  public datatable(data: DatatableParameter) : Observable<any> {
    return this.http.get<any>(`${this.url}Usuarios/datatable?PageNumber=${data.pageNumber}&PageSize=${data.pageSize}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}`)
  }

  public getById(id: any) : Observable<any> {
    return this.http.get<any>(`${this.url}Usuarios/${id}`);
  }

  public getAll() : Observable<any> {
    return this.http.get<any>(`${this.url}Usuarios`,);
  }

  public save(id: any, data: any) : Observable<any> {
    if (id) {
      return this.http.put<any>(`${this.url}Usuarios/${id}`, data, {headers: this.header});
    }
    return this.http.post<any>(`${this.url}Usuarios`, data, {headers: this.header});
  }

  public updatePassword(id: any, data: any) : Observable<any> {
    return this.http.put<any>(`${this.url}Usuarios/UpdatePassword/${id}`, data, {headers: this.header});
  }

  public delete(id: any) : Observable<any> {
    return this.http.delete<any>(`${this.url}Usuarios/${id}`, {headers: this.header});
  }
}
