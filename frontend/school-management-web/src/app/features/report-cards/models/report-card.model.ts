export interface ReportCardSubject {
    subjectId: number;
    subjectName: string;

    teacherFullName: string;

    grade: number;
    remarks?: string;
}

export interface ReportCard {
    enrollmentId: number;

    studentId: number;
    studentFullName: string;

    classroomId: number;
    classroomName: string;

    academicYearId: number;
    academicYearName: string;

    term: string;

    average: number;

    totalAbsences: number;
    totalLate: number;

    subjects: ReportCardSubject[];

    
}