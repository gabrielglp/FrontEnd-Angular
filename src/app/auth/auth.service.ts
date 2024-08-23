import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from './cookie.service';

interface RegisterResponse {
  email: string;
  name: string;
  success: boolean;
  message: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface Cliente {
  clienteId: number;
  name: string;
  cpf: string;
  telephone: string;
  uf: string;
  address: string;
  district: string;
  complement: string;
  birthDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:44339/api';

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }

  register(userId: number, userName: string, email: string, password: string): Observable<RegisterResponse> {
    const body = { userId, userName, email, password };
    return this.http.post<RegisterResponse>(`${this.apiUrl}/Auth/registration`, body);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/Auth/login`, body);
  }

  setAuthToken(token: string): void {
    this.cookieService.setCookie('authToken', token, 1);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get(`${this.apiUrl}/Clientes`, { headers }).subscribe();
  }

  getAuthToken(): string | null {
    return this.cookieService.getCookie('authToken');
  }

  getClientes(): Observable<Cliente[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Cliente[]>(`${this.apiUrl}/Clientes`, { headers });
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Cliente>(`${this.apiUrl}/Clientes`, cliente, { headers });
  }

  updateCliente(id: number, cliente: Cliente): Observable<Cliente> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Cliente>(`${this.apiUrl}/Clientes/${id}`, cliente, { headers });
  }

  deleteCliente(id: number): Observable<void> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/Clientes/${id}`, { headers });
  }

  searchClientes(cpf?: string, name?: string): Observable<Cliente[]> {
    let params = new HttpParams();
    if (cpf) params = params.set('cpf', cpf);
    if (name) params = params.set('name', name);
  
    console.log(`Searching for: CPF=${cpf}, Name=${name}`);
    return this.http.get<Cliente[]>(`${this.apiUrl}/Clientes/search`, { params });
  }

  logout(): void {
    this.cookieService.deleteCookie('authToken');
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
