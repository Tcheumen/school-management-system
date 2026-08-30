import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    Teacher,
    TeacherRequest
} from '../models/teacher.model';

@Injectable({
    providedIn: 'root'
})
export class TeacherService {

    private readonly apiUrl =
        'http://localhost:8080/api/teachers';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Teacher[]> {
        return this.http.get<Teacher[]>(this.apiUrl);
    }

    getById(id: number): Observable<Teacher> {
        return this.http.get<Teacher>(
            `${this.apiUrl}/${id}`
        );
    }

    create(request: TeacherRequest): Observable<Teacher> {
        return this.http.post<Teacher>(
            this.apiUrl,
            request
        );
    }

    update(
        id: number,
        request: TeacherRequest
    ): Observable<Teacher> {
        return this.http.put<Teacher>(
            `${this.apiUrl}/${id}`,
            request
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }
}