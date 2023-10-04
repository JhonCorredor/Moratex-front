import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ConsolidadosService {

  private BASE_URL = environment.url + "Consolidado/";
  private headers = new HttpHeaders({ 
    "Content-Type": "application/json", 
  });

  constructor(private http: HttpClient) { }

  public getCotizacionById(cotizacionId: number) : Observable<any> {
    return this.http.get<any>(`${environment.url}Cotizaciones/${cotizacionId}`, {headers: this.headers});
  }

  public armarConsolidado(cotizacionId: any): Observable<any> {
    return this.http.get<any>(`${environment.url}Consolidado/ArmarConsolidado/${cotizacionId}`, {headers: this.headers});
  }

  public saveConsolidado(data: any) {
    return this.http.post<any>(`${environment.url}Consolidado`, data, {headers: this.headers});
  }
}
