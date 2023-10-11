import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

    private url = environment.url;
    private ruta =  "Clientes";
  
    // private url : any;
    private header = new HttpHeaders();
  
    constructor(private http: HttpClient) { 
      this.header.set("Content-Type", "application/json");
      // this.header.set("allow-origin", "*");
    }

  public getAllClientes( data : DatatableParameter) : Observable<any> {
    return this.http.get<any>(`${this.url}${this.ruta}/datatable?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}`, {headers: this.header});
  }

  public getClientesById(id : any) : Observable<any> {
    return this.http.get<any>(`${this.url}${this.ruta}/${id}`, {headers: this.header});
  }

  public getAll(ruta: String) : Observable<any> {
    return this.http.get<any>(`${environment.url}${ruta}/AllSelect`, {headers: this.header});
  }

  public save(id : any, data : any) : Observable<any> {
    if (id != null && id != undefined) {
      return this.http.put<any>(`${this.url}${this.ruta}/${id}`, data, {headers: this.header});
    } else {
      return this.http.post<any>(`${this.url}${this.ruta}`, data, {headers: this.header});
    }
  }

  public delete(id : any ) : Observable<any> {
    return this.http.delete<any>(`${this.url}${this.ruta}/${id}`, {headers: this.header});
  }
}
