import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    Enrollment,
    EnrollmentRequest
} from '../models/enrollment.model';

@Injectable({
    providedIn: 'root'
})
export class EnrollmentService {

    private readonly apiUrl =
        'http://localhost:8080/api/enrollments';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(
            this.apiUrl
        );
    }

    getById(id: number): Observable<Enrollment> {
        return this.http.get<Enrollment>(
            `${this.apiUrl}/${id}`
        );
    }

    create(
        request: EnrollmentRequest
    ): Observable<Enrollment> {
        return this.http.post<Enrollment>(
            this.apiUrl,
            request
        );
    }

    update(
        id: number,
        request: EnrollmentRequest
    ): Observable<Enrollment> {
        return this.http.put<Enrollment>(
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