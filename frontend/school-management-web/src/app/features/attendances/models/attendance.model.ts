export type AttendanceStatus =
    | 'PRESENT'
    | 'ABSENT'
    | 'LATE';

export interface Attendance {
    id: number;

    enrollmentId: number;

    studentId: number;
    studentFullName: string;

    classroomId: number;
    classroomName: string;

    classScheduleId: number;

    subjectId: number;
    subjectName: string;

    teacherId: number;
    teacherFullName: string;

    academicYearId: number;
    academicYearName: string;

    dayOfWeek: string;
    startTime: string;
    endTime: string;

    attendanceDate: string;
    status: AttendanceStatus;
    remarks?: string;
}

export interface AttendanceRequest {
    enrollmentId: number;
    classScheduleId: number;
    attendanceDate: string;
    status: AttendanceStatus;
    remarks?: string;
}