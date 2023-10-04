import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';

@Injectable({
  providedIn: 'root'
})
export class CotizacionesConsolidadoService {

  private BASE_URL = environment.url + "CotizacionesDetallesEmpleados/";
  private headers = new HttpHeaders({ 
    "Content-Type": "application/json", 
  });

  constructor(private http: HttpClient) { }

  public datatable( data : DatatableParameter) : Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}datatable?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}`, {headers: this.headers});
  }

  public save(data : any) : Observable<any> {
     return this.http.post<any>(`${this.BASE_URL}importar`, JSON.stringify(data), {headers: this.headers});
  }

  public delete(id : any ) : Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}${id}`, {headers: this.headers});
  }
}

