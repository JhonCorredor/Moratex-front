import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CostosService {
  private url = environment.url;
  private header = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.header.set('Content-Type', 'application/json');
  }

  public datatable(data: DatatableParameter): Observable<any> {
    return this.http.get<any>(
      `${this.url}Costos/datatable?PageNumber=${data.pageNumber}&PageSize=${data.pageSize}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}`,
      { headers: this.header }
    );
  }

  public getAllCostosDay(data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.url}Costos/getBillsDay?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}`, { headers: this.header });
  }

  public getAllCostosMonth(data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.url}Costos/getBillsMonth?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}`, { headers: this.header });
  }

  public getAllCostosCalendar(data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.url}Costos/getBillsCalendar?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}`, { headers: this.header });
  }

  public getById(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}Costos/${id}`, {
      headers: this.header,
    });
  }

  public getAll(): Observable<any> {
    return this.http.get<any>(`${this.url}Costos`, { headers: this.header });
  }

  public save(id: any, data: any): Observable<any> {
    if (id) {
      return this.http.put<any>(`${this.url}Costos/${id}`, data, {
        headers: this.header,
      });
    }
    return this.http.post<any>(`${this.url}Costos`, data, {
      headers: this.header,
    });
  }

  public delete(id: any): Observable<any> {
    return this.http.delete<any>(`${this.url}Costos/${id}`, {
      headers: this.header,
    });
  }
}
