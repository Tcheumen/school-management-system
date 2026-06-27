import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginRequest } from '../models/login-request';
import { RegisterRequest } from '../models/register-request';
import { AuthResponse } from '../models/auth-response';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly apiUrl = 'http://localhost:8080/api/auth';

    constructor(private http: HttpClient) { }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
    }

    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
    }

    saveAuth(response: AuthResponse): void {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('email', response.email);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getRole(): string | null {
        return localStorage.getItem('role');
    }

    logout(): void {
        localStorage.clear();
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}