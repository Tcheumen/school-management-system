import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    TeacherAssignment,
    TeacherAssignmentRequest
} from '../models/teacher-assignment.model';

@Injectable({
    providedIn: 'root'
})
export class TeacherAssignmentService {

    private readonly apiUrl =
        'http://localhost:8080/api/teacher-assignments';

    constructor(private http: HttpClient) { }

    getAll(): Observable<TeacherAssignment[]> {
        return this.http.get<TeacherAssignment[]>(
            this.apiUrl
        );
    }

    getById(
        id: number
    ): Observable<TeacherAssignment> {
        return this.http.get<TeacherAssignment>(
            `${this.apiUrl}/${id}`
        );
    }

    create(
        request: TeacherAssignmentRequest
    ): Observable<TeacherAssignment> {
        return this.http.post<TeacherAssignment>(
            this.apiUrl,
            request
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }
}