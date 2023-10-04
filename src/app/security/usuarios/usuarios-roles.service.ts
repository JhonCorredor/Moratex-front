import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsuariosRolesService {

  private url = environment.url;
  private header = new HttpHeaders();

  constructor(private http: HttpClient) { 
    this.header.set("Content-Type", "application/json");
  }

  public datatable(data: DatatableParameter) : Observable<any> {
    return this.http.get<any>(`${this.url}UsuariosRoles/datatable?PageNumber=${data.pageNumber}&PageSize=${data.pageSize}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}`, {headers: this.header})
  }

  public getById(id: any) : Observable<any> {
    return this.http.get<any>(`${this.url}UsuariosRoles/${id}`, {headers: this.header});
  }

  public getAll(ruta : string) : Observable<any> {
    return this.http.get<any>(`${environment.url}${ruta}`, {headers: this.header});
  }

  public save(id: any, data: any) : Observable<any> {
    if (id != 0) {
      return this.http.put<any>(`${this.url}UsuariosRoles/${id}`, data, {headers: this.header});
    }
    return this.http.post<any>(`${this.url}UsuariosRoles`, data, {headers: this.header});
  }

  public delete(id: any) : Observable<any> {
    return this.http.delete<any>(`${this.url}UsuariosRoles/${id}`, {headers: this.header});
  }
}
