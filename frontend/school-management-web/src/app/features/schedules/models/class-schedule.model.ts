export interface ClassSchedule {
    id: number;

    teacherAssignmentId: number;

    teacherId: number;
    teacherFullName: string;

    subjectId: number;
    subjectName: string;

    classroomId: number;
    classroomName: string;

    academicYearId: number;
    academicYearName: string;

    dayOfWeek: string;

    startTime: string;
    endTime: string;
}

export interface ClassScheduleRequest {
    teacherAssignmentId: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}