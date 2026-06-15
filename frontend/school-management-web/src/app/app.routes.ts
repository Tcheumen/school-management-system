import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard as AdminDashboardComponent } from './features/admin/dashboard/dashboard';
import { Dashboard as TeacherDashboardComponent } from './features/teacher/dashboard/dashboard';
import { Dashboard as StudentDashboardComponent } from './features/student/dashboard/dashboard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'admin/dashboard',
        component: AdminDashboardComponent
    },
    {
        path: 'teacher/dashboard',
        component: TeacherDashboardComponent
    },
    {
        path: 'student/dashboard',
        component: StudentDashboardComponent
    }
];