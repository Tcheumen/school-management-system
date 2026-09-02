export type GradeTerm =
    | 'TERM_1'
    | 'TERM_2'
    | 'TERM_3';

export interface Grade {
    id: number;

    enrollmentId: number;

    studentId: number;
    studentFullName: string;

    classroomId: number;
    classroomName: string;

    academicYearId: number;
    academicYearName: string;

    teacherAssignmentId: number;

    teacherId: number;
    teacherFullName: string;

    subjectId: number;
    subjectName: string;

    value: number;
    term: GradeTerm;
    remarks?: string;
}

export interface GradeRequest {
    enrollmentId: number;
    teacherAssignmentId: number;
    value: number;
    term: GradeTerm;
    remarks?: string;
}