import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';

@Injectable({
  providedIn: 'root'
})
export class FacturaCompraDetalleService {

  private BASE_URL = environment.url + "FacturasComprasDetalles/";

  constructor(private http: HttpClient) { }
  public datatable(data: DatatableParameter) : Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}datatable?PageNumber=${data.pageNumber}&PageSize=${data.pageSize}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}` )
  }

  public getById(id: any) : Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}${id}` );
  }

  public save(id: any, data: any) : Observable<any> {
    if (id) {
      return this.http.put<any>(`${this.BASE_URL}${id}`, data );
    }
    return this.http.post<any>(`${this.BASE_URL}`, data );
  }

  public getAll(ruta : string){
    return this.http.get<any>(`${environment.url}${ruta}/AllSelect`);
  }


  public delete(id: any) : Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}${id}` );
  }

}
