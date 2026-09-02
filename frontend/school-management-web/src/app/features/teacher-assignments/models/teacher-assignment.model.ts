export interface TeacherAssignment {
    id: number;

    teacherId: number;
    teacherFullName: string;

    subjectId: number;
    subjectName: string;

    classroomId: number;
    classroomName: string;

    academicYearId: number;
    academicYearName: string;
}

export interface TeacherAssignmentRequest {
    teacherId: number;
    subjectId: number;
    classroomId: number;
    academicYearId: number;
}