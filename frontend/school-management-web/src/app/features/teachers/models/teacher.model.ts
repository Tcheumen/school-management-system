export interface Teacher {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    specialty: string;
}

export interface TeacherRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    specialty: string;
}