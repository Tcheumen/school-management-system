import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    Classroom,
    ClassroomRequest
} from '../models/classroom.model';

@Injectable({
    providedIn: 'root'
})
export class ClassroomService {

    private readonly apiUrl =
        'http://localhost:8080/api/classrooms';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Classroom[]> {
        return this.http.get<Classroom[]>(this.apiUrl);
    }

    getById(id: number): Observable<Classroom> {
        return this.http.get<Classroom>(
            `${this.apiUrl}/${id}`
        );
    }

    create(
        request: ClassroomRequest
    ): Observable<Classroom> {
        return this.http.post<Classroom>(
            this.apiUrl,
            request
        );
    }

    update(
        id: number,
        request: ClassroomRequest
    ): Observable<Classroom> {
        return this.http.put<Classroom>(
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