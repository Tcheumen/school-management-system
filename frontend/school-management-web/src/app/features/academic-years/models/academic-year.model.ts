export interface AcademicYear {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    active: boolean;
}


export interface AcademicYearRequest {
    name: string;
    startDate: string;
    endDate: string;
    active: boolean;
}