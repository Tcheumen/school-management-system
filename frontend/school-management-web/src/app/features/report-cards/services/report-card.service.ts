import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    ReportCard
} from '../models/report-card.model';

@Injectable({
    providedIn: 'root'
})
export class ReportCardService {

    private readonly apiUrl =
        'http://localhost:8080/api/report-cards';

    constructor(
        private http: HttpClient
    ) { }

    getByEnrollment(
        enrollmentId: number,
        term: string
    ): Observable<ReportCard> {

        return this.http.get<ReportCard>(
            `${this.apiUrl}/enrollments/${enrollmentId}`,
            {
                params: {
                    term
                }
            }
        );
    }
}