import { Routes } from '@angular/router';

import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';

import { AdminDashboard } from './features/dashboard/admin-dashboard/admin-dashboard';
import { TeacherDashboard } from './features/dashboard/teacher-dashboard/teacher-dashboard';
import { StudentDashboard } from './features/dashboard/student-dashboard/student-dashboard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'login', component: Login },
    { path: 'register', component: Register },

    { path: 'admin/dashboard', component: AdminDashboard },
    { path: 'teacher/dashboard', component: TeacherDashboard },
    { path: 'student/dashboard', component: StudentDashboard }
];