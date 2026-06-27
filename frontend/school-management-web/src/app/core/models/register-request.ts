export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'TEACHER' | 'STUDENT';
}