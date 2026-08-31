import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AcademicYear } from '../models/academic-year.model';

@Injectable({
    providedIn: 'root'
})
export class AcademicYearService {

    private readonly apiUrl =
        'http://localhost:8080/api/academic-years';

    constructor(private http: HttpClient) { }

    getAll(): Observable<AcademicYear[]> {
        return this.http.get<AcademicYear[]>(this.apiUrl);
    }

    getById(id: number): Observable<AcademicYear> {
        return this.http.get<AcademicYear>(
            `${this.apiUrl}/${id}`
        );
    }
}