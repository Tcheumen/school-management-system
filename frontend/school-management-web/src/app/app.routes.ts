import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

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
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
            import('./features/dashboard/admin-dashboard/admin-dashboard')
                .then(m => m.AdminDashboard)
    },

    {
        path: 'teacher/dashboard',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['TEACHER'] },
        loadComponent: () =>
            import('./features/dashboard/teacher-dashboard/teacher-dashboard')
                .then(m => m.TeacherDashboard)
    },

    {
        path: 'student/dashboard',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['STUDENT'] },
        loadComponent: () =>
            import('./features/dashboard/student-dashboard/student-dashboard')
                .then(m => m.StudentDashboard)
    },

    {
        path: 'students',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['ADMIN']
        },
        loadComponent: () =>
            import(
                './features/students/pages/student-list/student-list'
            ).then(m => m.StudentList)
    },
    {
        path: 'students/new',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['ADMIN']
        },
        loadComponent: () =>
            import(
                './features/students/pages/student-form/student-form'
            ).then(m => m.StudentForm)
    },
    {
        path: 'students/:id/edit',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['ADMIN']
        },
        loadComponent: () =>
            import(
                './features/students/pages/student-form/student-form'
            ).then(m => m.StudentForm)
    },

    {
        path: 'teachers',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
            import(
                './features/teachers/pages/teacher-list/teacher-list'
            ).then(m => m.TeacherList)
    },
    {
        path: 'teachers/new',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
            import(
                './features/teachers/pages/teacher-form/teacher-form'
            ).then(m => m.TeacherForm)
    },
    {
        path: 'teachers/:id/edit',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
            import(
                './features/teachers/pages/teacher-form/teacher-form'
            ).then(m => m.TeacherForm)
    },

    {
        path: '**',
        redirectTo: 'login'
    }
];