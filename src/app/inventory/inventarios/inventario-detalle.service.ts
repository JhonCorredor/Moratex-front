import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';

@Injectable({
  providedIn: 'root'
})
export class InventarioDetalleService {

  private BASE_URL = environment.url + "InventariosDetalles/";
  // private BASE_URL : any;
  private headers = new HttpHeaders({
    "Content-Type": "application/json", 
    // "Authorization": `Bearer ${localStorage.getItem("token")}`,
    // "Access-Control-Allow-Origin": "*"
  });

  constructor(private http: HttpClient) { }

  public getAllInventarioDetalle( data : DatatableParameter) : Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}datatable?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}`, {headers: this.headers});
  }

  public getInventarioDetalleById(id : any) : Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}${id}`, {headers: this.headers});
  }

  public getInventarioDetalleByProductoId(id : any) : Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}getByIdProducto/${id}`, {headers: this.headers});
  }

  public getAll(ruta: String) : Observable<any> {
    return this.http.get<any>(`${environment.url}${ruta}/AllSelect`, {headers: this.headers});
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
