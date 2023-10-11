import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';

@Injectable({
  providedIn: 'root'
})

export class FormulariosService {

  private url = environment.url;
  private ruta = "Formularios";
  private header = new HttpHeaders();

  constructor(private http: HttpClient) { 
    this.header.set("Content-Type", "application/json");
    // this.header.set("allow-origin", "*");
  }

  public getAllFormularios( data : DatatableParameter) : Observable<any> {
    return this.http.get<any>(`${this.url}${this.ruta}/datatable?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}`, {headers: this.header});
  }

  public getFormulariosById(id : any) : Observable<any> {
    return this.http.get<any>(`${this.url}${this.ruta}/${id}`, {headers: this.header});
  }

  public save(id : any, data : any) : Observable<any> {
    if (id) {
      return this.http.put<any>(`${this.url}${this.ruta}/${id}`, data, {headers: this.header});
    }
    return this.http.post<any>(`${this.url}${this.ruta}`, data, {headers: this.header});
  }

  public delete(id : any ) : Observable<any> {
    return this.http.delete<any>(`${this.url}${this.ruta}/${id}`, {headers: this.header});
  }

}
