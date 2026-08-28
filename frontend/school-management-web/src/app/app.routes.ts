import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/pages/login/login')
                .then(m => m.Login)
    },

    {
        path: 'admin/dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/dashboard/admin-dashboard/admin-dashboard')
                .then(m => m.AdminDashboard)
    },

    {
        path: 'teacher/dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/dashboard/teacher-dashboard/teacher-dashboard')
                .then(m => m.TeacherDashboard)
    },

    {
        path: 'student/dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/dashboard/student-dashboard/student-dashboard')
                .then(m => m.StudentDashboard)
    },

    {
        path: '**',
        redirectTo: 'login'
    }
];