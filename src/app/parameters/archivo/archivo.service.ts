import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  private BASE_URL = environment.url + "Archivos/";
  private headers = new HttpHeaders({
    "Content-Type": "application/json", 
  });

  constructor(private http: HttpClient) { }

  public getAllArchivo( data : DatatableParameter) : Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}datatable?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&NameForeignKey=${data.nameForeignKey}&ForeignKey=${data.foreignKey}`, {headers: this.headers});
  }

  public getArchivoById(id : any) : Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}${id}`, {headers: this.headers});
  }

  public getAll(ruta: String) : Observable<any> {
    return this.http.get<any>(`${environment.url}${ruta}/AllSelect`, {headers: this.headers});
  }

  public save( data : any) : Observable<any> {
      return this.http.post<any>(`${this.BASE_URL}`, JSON.stringify(data), {headers: this.headers});
  }

  public delete(id : any ) : Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}${id}`, {headers: this.headers});
  }

}
