export interface ReportCardGrade {
    subjectId: number;
    subjectName: string;

    teacherId: number;
    teacherFullName: string;

    value: number;
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

    grades: ReportCardGrade[];

    average: number;
}