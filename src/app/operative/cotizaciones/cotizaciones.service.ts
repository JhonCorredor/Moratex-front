import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';

@Injectable({
  providedIn: 'root'
})
export class CotizacionesService {

  private BASE_URL = environment.url + "CotizacionesManuales/";
  private headers = new HttpHeaders({ 
    "Content-Type": "application/json", 
  });

  constructor(private http: HttpClient) { }

  public getAllCotizaciones( data : DatatableParameter) : Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}datatable?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}`, {headers: this.headers});
  }

  public getCotizacionesById(id : any) : Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}${id}`, {headers: this.headers});
  }

  public getAll(ruta : string){
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

  public consolidado(data: any): Observable<any> {
    return this.http.get<any>(`${environment.url}ConsolidadosDetalles/datatable?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}`, {headers: this.headers});
  }

  public findIfExistsByConsolidadoDetalleId(consolidadoDetalleId: any) {
    return this.http.get<any>(`${environment.url}OrdenesProducciones/FindIfExistsByConsolidadoDetalleId/${consolidadoDetalleId}`, {headers: this.headers});
  }

}
