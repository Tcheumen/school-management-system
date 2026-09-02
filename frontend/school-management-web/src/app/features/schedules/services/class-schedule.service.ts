import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    ClassSchedule,
    ClassScheduleRequest
} from '../models/class-schedule.model';

@Injectable({
    providedIn: 'root'
})
export class ClassScheduleService {

    private readonly apiUrl =
        'http://localhost:8080/api/class-schedules';

    constructor(
        private http: HttpClient
    ) { }

    getAll(): Observable<ClassSchedule[]> {
        return this.http.get<ClassSchedule[]>(
            this.apiUrl
        );
    }

    getById(
        id: number
    ): Observable<ClassSchedule> {
        return this.http.get<ClassSchedule>(
            `${this.apiUrl}/${id}`
        );
    }

    create(
        request: ClassScheduleRequest
    ): Observable<ClassSchedule> {
        return this.http.post<ClassSchedule>(
            this.apiUrl,
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