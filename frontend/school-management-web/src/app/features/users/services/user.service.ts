import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/user.model';

export interface CreateUserRequest {
    fullName: string;
    email: string;
    password: string;
    role: User['role'];
}

export interface UpdateUserRequest {
    fullName: string;
    email: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly apiUrl =
        'http://localhost:8080/api/users';

    constructor(
        private http: HttpClient
    ) { }

    // GET ALL USERS
    getAll(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    // CREATE USER
    create(
        request: CreateUserRequest
    ): Observable<User> {
        return this.http.post<User>(
            this.apiUrl,
            request
        );
    }

    // UPDATE USER
    update(
        id: number,
        request: UpdateUserRequest
    ): Observable<User> {
        return this.http.put<User>(
            `${this.apiUrl}/${id}`,
            request
        );
    }

    // DELETE USER
    delete(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }
}