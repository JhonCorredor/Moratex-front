import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';

@Injectable({
  providedIn: 'root'
})
export class ProductoProveedoresService {

  private BASE_URL = environment.url + "ProductosProveedores/";

  constructor(private http: HttpClient) { }

  public getAllProductoProveedores( data : DatatableParameter) : Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}datatable?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&foreignKey=${data.foreignKey}`);
  }

  public getProductoProveedoresById(id : any) : Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}${id}`);
  }

  public getAll(ruta: String) : Observable<any> {
    return this.http.get<any>(`${environment.url}${ruta}/AllSelect`);
  }


  public save(id : any, data : any) : Observable<any> {
    if (id != null && id != undefined) {
      return this.http.put<any>(`${this.BASE_URL}${id}`, JSON.stringify(data));
    } else {
      return this.http.post<any>(`${this.BASE_URL}`, JSON.stringify(data));
    }
  }

  public delete(id : any ) : Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}${id}`);
  }

}
