export interface Enrollment {
    id: number;

    studentId: number;
    studentFullName: string;

    classroomId: number;
    classroomName: string;

    academicYearId: number;
    academicYearName: string;
}

export interface EnrollmentRequest {
    studentId: number;
    classroomId: number;
    academicYearId: number;
}