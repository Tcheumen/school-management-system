import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    Grade,
    GradeRequest
} from '../models/grade.model';

@Injectable({
    providedIn: 'root'
})
export class GradeService {

    private readonly apiUrl =
        'http://localhost:8080/api/grades';

    constructor(
        private http: HttpClient
    ) { }

    getAll(): Observable<Grade[]> {
        return this.http.get<Grade[]>(
            this.apiUrl
        );
    }

    getById(
        id: number
    ): Observable<Grade> {
        return this.http.get<Grade>(
            `${this.apiUrl}/${id}`
        );
    }

    create(
        request: GradeRequest
    ): Observable<Grade> {
        return this.http.post<Grade>(
            this.apiUrl,
            request
        );
    }

    update(
        id: number,
        request: GradeRequest
    ): Observable<Grade> {
        return this.http.put<Grade>(
            `${this.apiUrl}/${id}`,
            request
        );
    }

    delete(
        id: number
    ): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }
}