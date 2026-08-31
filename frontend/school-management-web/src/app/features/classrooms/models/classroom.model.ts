export interface Classroom {
    id: number;
    name: string;
    level: string;
    academicYearId: number;
    academicYearName?: string;
}

export interface ClassroomRequest {
    name: string;
    level: string;
    academicYearId: number;
}