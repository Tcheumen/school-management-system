import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    Attendance,
    AttendanceRequest
} from '../models/attendance.model';

@Injectable({
    providedIn: 'root'
})
export class AttendanceService {

    private readonly apiUrl =
        'http://localhost:8080/api/attendances';

    constructor(
        private http: HttpClient
    ) { }

    getAll(): Observable<Attendance[]> {
        return this.http.get<Attendance[]>(
            this.apiUrl
        );
    }

    getById(
        id: number
    ): Observable<Attendance> {
        return this.http.get<Attendance>(
            `${this.apiUrl}/${id}`
        );
    }

    create(
        request: AttendanceRequest
    ): Observable<Attendance> {
        return this.http.post<Attendance>(
            this.apiUrl,
            request
        );
    }

    update(
        id: number,
        request: AttendanceRequest
    ): Observable<Attendance> {
        return this.http.put<Attendance>(
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