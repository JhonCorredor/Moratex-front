import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class OrdenesProduccionService {

  private BASE_URL = environment.url + "OrdenesProducciones/";

  private headers = new HttpHeaders({ 
    "Content-Type": "application/json", 
  });

  constructor(private http: HttpClient) { }

  public getAll(ruta : string){
    return this.http.get<any>(`${environment.url}${ruta}/AllSelect`, {headers: this.headers});
  }

  public getById(id : any) : Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}${id}`, {headers: this.headers});
  }

  public save(id : any, data : any) : Observable<any> {
    if (id != null && id != undefined) {
      return this.http.put<any>(`${this.BASE_URL}${id}`, JSON.stringify(data), {headers: this.headers});
    } else {
      return this.http.post<any>(`${this.BASE_URL}`, JSON.stringify(data), {headers: this.headers});
    }
  }

  getAllOPDetalles(data: DatatableParameter) {
    return this.http.get<any>(`${environment.url}OrdenesProduccionesDetalles/datatable?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}`, {headers: this.headers})
  }

  getOPDetallesById(id: any) {
    return this.http.get<any>(`${environment.url}OrdenesProduccionesDetalles/${id}`, {headers: this.headers});
  }

  public saveOPDetalles(id : any, data : any) : Observable<any> {
    if (id != null && id != undefined) {
      return this.http.put<any>(`${environment.url}OrdenesProduccionesDetalles/${id}`, JSON.stringify(data), {headers: this.headers});
    } else {
      return this.http.post<any>(`${environment.url}OrdenesProduccionesDetalles`, JSON.stringify(data), {headers: this.headers});
    }
  }

  deleteOPDetalles(id: any) {
    return this.http.delete<any>(`${environment.url}OrdenesProduccionesDetalles/${id}`, {headers: this.headers});
  }


  getAllOPCalidad(data: DatatableParameter) {
    return this.http.get<any>(`${environment.url}OrdenesProduccionesCalidades/datatable?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}`, {headers: this.headers})
  }

  getOPCalidadById(id: any) {
    return this.http.get<any>(`${environment.url}OrdenesProduccionesCalidades/${id}`, {headers: this.headers});
  }

  public saveOPCalidad(id : any, data : any) : Observable<any> {
    if (id != null && id != undefined) {
      return this.http.put<any>(`${environment.url}OrdenesProduccionesCalidades/${id}`, JSON.stringify(data), {headers: this.headers});
    } else {
      return this.http.post<any>(`${environment.url}OrdenesProduccionesCalidades`, JSON.stringify(data), {headers: this.headers});
    }
  }

  deleteOPCalidad(id: any) {
    return this.http.delete<any>(`${environment.url}OrdenesProduccionesCalidades/${id}`, {headers: this.headers});
  }

}
