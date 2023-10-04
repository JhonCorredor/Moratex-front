import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FichaTenicaService {
  private url = environment.url;
  private header = new HttpHeaders();

  constructor(private http: HttpClient) { 
    this.header.set("Content-Type", "application/json");
  }

  public datatableModelo(data: DatatableParameter) : Observable<any> {
    return this.http.get<any>(`${this.url}Modelos/datatable?PageNumber=${data.pageNumber}&PageSize=${data.pageSize}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}`, {headers: this.header})
  }

  public getPrendasByModelo(modeloId: any) : Observable<any> {
    return this.http.get<any>(`${this.url}ModelosPrendas/AllByModelo/${modeloId}`, {headers: this.header})
  }

  public getPiezasByPrenda(prendaId: any) : Observable<any> {
    return this.http.get<any>(`${this.url}PrendasPiezas/AllByPrenda/${prendaId}`, {headers: this.header})
  }
  public getConsumosPrendasByPrenda(prendaId: any) : Observable<any> {
    return this.http.get<any>(`${this.url}ConsumosPrendas/AllByPrenda/${prendaId}`, {headers: this.header})
  }

  public getConsumosPrendasTallasByPrenda(prendaId: any) : Observable<any> {
    return this.http.get<any>(`${this.url}ConsumosPrendasTallas/AllByPrenda/${prendaId}`, {headers: this.header})
  }

  public getOperacionesByPrenda(prendaId: any) : Observable<any> {
    return this.http.get<any>(`${this.url}PrendasOperaciones/AllByPrenda/${prendaId}`, {headers: this.header})
  }

  public getModeloById(id: any) : Observable<any> {
    return this.http.get<any>(`${this.url}Modelos/${id}`, {headers: this.header});
  }
}
