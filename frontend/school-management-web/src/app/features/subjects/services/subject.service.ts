import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    Subject,
    SubjectRequest
} from '../models/subject.model';

@Injectable({
    providedIn: 'root'
})
export class SubjectService {

    private readonly apiUrl =
        'http://localhost:8080/api/subjects';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Subject[]> {
        return this.http.get<Subject[]>(this.apiUrl);
    }

    getById(id: number): Observable<Subject> {
        return this.http.get<Subject>(
            `${this.apiUrl}/${id}`
        );
    }

    create(
        request: SubjectRequest
    ): Observable<Subject> {
        return this.http.post<Subject>(
            this.apiUrl,
            request
        );
    }

    update(
        id: number,
        request: SubjectRequest
    ): Observable<Subject> {
        return this.http.put<Subject>(
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