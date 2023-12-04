import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';

@Injectable({
  providedIn: 'root'
})
export class FacturaCompraService {

  private BASE_URL = environment.url + "FacturasCompras/";
  private header = new HttpHeaders();
  
  constructor(private http: HttpClient) { }
  
  public datatable(data: DatatableParameter) : Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}datatable?PageNumber=${data.pageNumber}&PageSize=${data.pageSize}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}` )
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

  public getAllBillsDay(data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}getBillsDay?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}`, { headers: this.header });
  }

  public getAllBillsMonth(data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}getBillsMonth?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}`, { headers: this.header });
  }

  public getAllBillsCalendar(data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}getBillsCalendar?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}`, { headers: this.header });
  }

  public delete(id: any) : Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}${id}` );
  }

}
