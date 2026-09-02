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
        path: 'subjects',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['ADMIN']
        },
        loadComponent: () =>
            import(
                './features/subjects/pages/subject-list/subject-list'
            ).then(m => m.SubjectList)
    },
    {
        path: 'subjects/new',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['ADMIN']
        },
        loadComponent: () =>
            import(
                './features/subjects/pages/subject-form/subject-form'
            ).then(m => m.SubjectForm)
    },
    {
        path: 'subjects/:id/edit',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['ADMIN']
        },
        loadComponent: () =>
            import(
                './features/subjects/pages/subject-form/subject-form'
            ).then(m => m.SubjectForm)
    },

    {
        path: 'classrooms',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['ADMIN']
        },
        loadComponent: () =>
            import(
                './features/classrooms/pages/classroom-list/classroom-list'
            ).then(m => m.ClassroomList)
    },
    {
        path: 'classrooms/new',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['ADMIN']
        },
        loadComponent: () =>
            import(
                './features/classrooms/pages/classroom-form/classroom-form'
            ).then(m => m.ClassroomForm)
    },
    {
        path: 'classrooms/:id/edit',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['ADMIN']
        },
        loadComponent: () =>
            import(
                './features/classrooms/pages/classroom-form/classroom-form'
            ).then(m => m.ClassroomForm)
    },

    {
        path: 'academic-years',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['ADMIN']
        },
        loadComponent: () =>
            import(
                './features/academic-years/pages/academic-year-list/academic-year-list'
            ).then(m => m.AcademicYearList)
    },
    {
        path: 'academic-years/new',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['ADMIN']
        },
        loadComponent: () =>
            import(
                './features/academic-years/pages/academic-year-form/academic-year-form'
            ).then(m => m.AcademicYearForm)
    },
    {
        path: 'academic-years/:id/edit',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['ADMIN']
        },
        loadComponent: () =>
            import(
                './features/academic-years/pages/academic-year-form/academic-year-form'
            ).then(m => m.AcademicYearForm)
    },

    {
        path: 'enrollments',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['ADMIN']
        },
        loadComponent: () =>
            import(
                './features/enrollments/pages/enrollment-list/enrollment-list'
            ).then(m => m.EnrollmentList)
    },
    {
        path: 'enrollments/new',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['ADMIN']
        },
        loadComponent: () =>
            import(
                './features/enrollments/pages/enrollment-form/enrollment-form'
            ).then(m => m.EnrollmentForm)
    },
    {
        path: 'enrollments/:id/edit',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['ADMIN']
        },
        loadComponent: () =>
            import(
                './features/enrollments/pages/enrollment-form/enrollment-form'
            ).then(m => m.EnrollmentForm)
    },

    {
        path: 'teacher-assignments',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['ADMIN']
        },
        loadComponent: () =>
            import(
                './features/teacher-assignments/pages/teacher-assignment-list/teacher-assignment-list'
            ).then(m => m.TeacherAssignmentList)
    },
    {
        path: 'teacher-assignments/new',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['ADMIN']
        },
        loadComponent: () =>
            import(
                './features/teacher-assignments/pages/teacher-assignment-form/teacher-assignment-form'
            ).then(m => m.TeacherAssignmentForm)
    },

    {
        path: 'schedules',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ADMIN']
        },

        loadComponent: () =>
            import(
                './features/schedules/pages/schedule-list/schedule-list'
            ).then(
                m => m.ScheduleList
            )
    },
    {
        path: 'schedules/new',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ADMIN']
        },

        loadComponent: () =>
            import(
                './features/schedules/pages/schedule-form/schedule-form'
            ).then(
                m => m.ScheduleForm
            )
    },
    {
        path: 'attendances',
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            roles: ['ADMIN', 'TEACHER']
        },
        loadComponent: () =>
            import(
                './features/attendances/pages/attendance-list/attendance-list'
            ).then(
                m => m.AttendanceList
            )
    },
    {
        path: 'attendances/new',
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            roles: ['ADMIN', 'TEACHER']
        },
        loadComponent: () =>
            import(
                './features/attendances/pages/attendance-form/attendance-form'
            ).then(
                m => m.AttendanceForm
            )
    },
    {
        path: 'attendances/:id/edit',
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            roles: ['ADMIN', 'TEACHER']
        },
        loadComponent: () =>
            import(
                './features/attendances/pages/attendance-form/attendance-form'
            ).then(
                m => m.AttendanceForm
            )
    },

    {
        path: 'grades',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ADMIN', 'TEACHER']
        },

        loadComponent: () =>
            import(
                './features/grades/pages/grade-list/grade-list'
            ).then(
                m => m.GradeList
            )
    },
    {
        path: 'grades/new',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ADMIN', 'TEACHER']
        },

        loadComponent: () =>
            import(
                './features/grades/pages/grade-form/grade-form'
            ).then(
                m => m.GradeForm
            )
    },
    {
        path: 'grades/:id/edit',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ADMIN', 'TEACHER']
        },

        loadComponent: () =>
            import(
                './features/grades/pages/grade-form/grade-form'
            ).then(
                m => m.GradeForm
            )
    },
    {
        path: 'report-cards',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: [
                'ADMIN',
                'TEACHER'
            ]
        },

        loadComponent: () =>
            import(
                './features/report-cards/pages/report-card-view/report-card-view'
            ).then(
                m => m.ReportCardView
            )
    },
    
    {
        path: '**',
        redirectTo: 'login'
    }
];