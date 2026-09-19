export interface UserResponse {
    id: number;
    fullName: string;
    email: string;
    role: 'ADMIN' | 'TEACHER' | 'STUDENT';
}