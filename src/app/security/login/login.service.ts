import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = environment.url;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) { 
    this.headers = new HttpHeaders({
      "Content-Type": "application/json"
    })
  }


  IniciarSesion(data: any) : Observable<any> {
    return this.http.post<any>(`${this.url}Usuarios/Authenticate`, data, {headers: this.headers})
  }
}
