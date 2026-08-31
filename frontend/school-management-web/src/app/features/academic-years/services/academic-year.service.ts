import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    AcademicYear,
    AcademicYearRequest
} from '../models/academic-year.model';

@Injectable({
    providedIn: 'root'
})
export class AcademicYearService {

    private readonly apiUrl =
        'http://localhost:8080/api/academic-years';

    constructor(private http: HttpClient) { }

    getAll(): Observable<AcademicYear[]> {
        return this.http.get<AcademicYear[]>(
            this.apiUrl
        );
    }

    getById(id: number): Observable<AcademicYear> {
        return this.http.get<AcademicYear>(
            `${this.apiUrl}/${id}`
        );
    }

    create(
        request: AcademicYearRequest
    ): Observable<AcademicYear> {
        return this.http.post<AcademicYear>(
            this.apiUrl,
            request
        );
    }

    update(
        id: number,
        request: AcademicYearRequest
    ): Observable<AcademicYear> {
        return this.http.put<AcademicYear>(
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