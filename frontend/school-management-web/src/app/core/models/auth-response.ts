export interface AuthResponse {
    token: string;
    email: string;
    role: 'ADMIN' | 'TEACHER' | 'STUDENT';
}