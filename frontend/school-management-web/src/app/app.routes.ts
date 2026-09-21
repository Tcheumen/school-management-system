import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

    /* =====================================================
       PUBLIC
    ===================================================== */

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    {
        path: 'login',
        loadComponent: () =>
            import(
                './features/auth/pages/login/login'
            ).then(
                m => m.Login
            )
    },

    {
        path: 'register',
        loadComponent: () =>
            import(
                './features/auth/pages/register/register'
            ).then(
                m => m.Register
            )
    },


    /* =====================================================
       ADMIN LAYOUT
    ===================================================== */

    {
        path: '',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ADMIN']
        },

        loadComponent: () =>
            import(
                './features/layouts/admin-layout/admin-layout'
            ).then(
                m => m.AdminLayout
            ),

        children: [

            /* DASHBOARD */

            {
                path: 'admin/dashboard',

                loadComponent: () =>
                    import(
                        './features/dashboard/admin-dashboard/admin-dashboard'
                    ).then(
                        m => m.AdminDashboard
                    )
            },


            /* STUDENTS */

            {
                path: 'students',

                loadComponent: () =>
                    import(
                        './features/students/pages/student-list/student-list'
                    ).then(
                        m => m.StudentList
                    )
            },

            {
                path: 'students/new',

                loadComponent: () =>
                    import(
                        './features/students/pages/student-form/student-form'
                    ).then(
                        m => m.StudentForm
                    )
            },

            {
                path: 'students/:id/edit',

                loadComponent: () =>
                    import(
                        './features/students/pages/student-form/student-form'
                    ).then(
                        m => m.StudentForm
                    )
            },


            /* TEACHERS */

            {
                path: 'teachers',

                loadComponent: () =>
                    import(
                        './features/teachers/pages/teacher-list/teacher-list'
                    ).then(
                        m => m.TeacherList
                    )
            },

            {
                path: 'teachers/new',

                loadComponent: () =>
                    import(
                        './features/teachers/pages/teacher-form/teacher-form'
                    ).then(
                        m => m.TeacherForm
                    )
            },

            {
                path: 'teachers/:id/edit',

                loadComponent: () =>
                    import(
                        './features/teachers/pages/teacher-form/teacher-form'
                    ).then(
                        m => m.TeacherForm
                    )
            },


            /* SUBJECTS */

            {
                path: 'subjects',

                loadComponent: () =>
                    import(
                        './features/subjects/pages/subject-list/subject-list'
                    ).then(
                        m => m.SubjectList
                    )
            },

            {
                path: 'subjects/new',

                loadComponent: () =>
                    import(
                        './features/subjects/pages/subject-form/subject-form'
                    ).then(
                        m => m.SubjectForm
                    )
            },

            {
                path: 'subjects/:id/edit',

                loadComponent: () =>
                    import(
                        './features/subjects/pages/subject-form/subject-form'
                    ).then(
                        m => m.SubjectForm
                    )
            },


            /* CLASSROOMS */

            {
                path: 'classrooms',

                loadComponent: () =>
                    import(
                        './features/classrooms/pages/classroom-list/classroom-list'
                    ).then(
                        m => m.ClassroomList
                    )
            },

            {
                path: 'classrooms/new',

                loadComponent: () =>
                    import(
                        './features/classrooms/pages/classroom-form/classroom-form'
                    ).then(
                        m => m.ClassroomForm
                    )
            },

            {
                path: 'classrooms/:id/edit',

                loadComponent: () =>
                    import(
                        './features/classrooms/pages/classroom-form/classroom-form'
                    ).then(
                        m => m.ClassroomForm
                    )
            },


            /* ACADEMIC YEARS */

            {
                path: 'academic-years',

                loadComponent: () =>
                    import(
                        './features/academic-years/pages/academic-year-list/academic-year-list'
                    ).then(
                        m => m.AcademicYearList
                    )
            },

            {
                path: 'academic-years/new',

                loadComponent: () =>
                    import(
                        './features/academic-years/pages/academic-year-form/academic-year-form'
                    ).then(
                        m => m.AcademicYearForm
                    )
            },

            {
                path: 'academic-years/:id/edit',

                loadComponent: () =>
                    import(
                        './features/academic-years/pages/academic-year-form/academic-year-form'
                    ).then(
                        m => m.AcademicYearForm
                    )
            },


            /* ENROLLMENTS */

            {
                path: 'enrollments',

                loadComponent: () =>
                    import(
                        './features/enrollments/pages/enrollment-list/enrollment-list'
                    ).then(
                        m => m.EnrollmentList
                    )
            },

            {
                path: 'enrollments/new',

                loadComponent: () =>
                    import(
                        './features/enrollments/pages/enrollment-form/enrollment-form'
                    ).then(
                        m => m.EnrollmentForm
                    )
            },

            {
                path: 'enrollments/:id/edit',

                loadComponent: () =>
                    import(
                        './features/enrollments/pages/enrollment-form/enrollment-form'
                    ).then(
                        m => m.EnrollmentForm
                    )
            },


            /* TEACHER ASSIGNMENTS */

            {
                path: 'teacher-assignments',

                loadComponent: () =>
                    import(
                        './features/teacher-assignments/pages/teacher-assignment-list/teacher-assignment-list'
                    ).then(
                        m => m.TeacherAssignmentList
                    )
            },

            {
                path: 'teacher-assignments/new',

                loadComponent: () =>
                    import(
                        './features/teacher-assignments/pages/teacher-assignment-form/teacher-assignment-form'
                    ).then(
                        m => m.TeacherAssignmentForm
                    )
            },


            /* SCHEDULES */

            {
                path: 'schedules',

                loadComponent: () =>
                    import(
                        './features/schedules/pages/schedule-list/schedule-list'
                    ).then(
                        m => m.ScheduleList
                    )
            },

            {
                path: 'schedules/new',

                loadComponent: () =>
                    import(
                        './features/schedules/pages/schedule-form/schedule-form'
                    ).then(
                        m => m.ScheduleForm
                    )
            },


            /* ATTENDANCES */

            {
                path: 'attendances',

                loadComponent: () =>
                    import(
                        './features/attendances/pages/attendance-list/attendance-list'
                    ).then(
                        m => m.AttendanceList
                    )
            },

            {
                path: 'attendances/new',

                loadComponent: () =>
                    import(
                        './features/attendances/pages/attendance-form/attendance-form'
                    ).then(
                        m => m.AttendanceForm
                    )
            },

            {
                path: 'attendances/:id/edit',

                loadComponent: () =>
                    import(
                        './features/attendances/pages/attendance-form/attendance-form'
                    ).then(
                        m => m.AttendanceForm
                    )
            },


            /* GRADES */

            {
                path: 'grades',

                loadComponent: () =>
                    import(
                        './features/grades/pages/grade-list/grade-list'
                    ).then(
                        m => m.GradeList
                    )
            },

            {
                path: 'grades/new',

                loadComponent: () =>
                    import(
                        './features/grades/pages/grade-form/grade-form'
                    ).then(
                        m => m.GradeForm
                    )
            },

            {
                path: 'grades/:id/edit',

                loadComponent: () =>
                    import(
                        './features/grades/pages/grade-form/grade-form'
                    ).then(
                        m => m.GradeForm
                    )
            },


            /* REPORT CARDS */

            {
                path: 'report-cards',

                loadComponent: () =>
                    import(
                        './features/report-cards/pages/report-card-view/report-card-view'
                    ).then(
                        m => m.ReportCardView
                    )
            }

        ]
    },


    /* =====================================================
       TEACHER LAYOUT
    ===================================================== */

    {
        path: '',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['TEACHER']
        },

        loadComponent: () =>
            import(
                './features/layouts/teacher-layout/teacher-layout'
            ).then(
                m => m.TeacherLayout
            ),

        children: [

            {
                path: 'teacher/dashboard',

                loadComponent: () =>
                    import(
                        './features/dashboard/teacher-dashboard/teacher-dashboard'
                    ).then(
                        m => m.TeacherDashboard
                    )
            },

            {
                path: 'teacher/assignments',

                loadComponent: () =>
                    import(
                        './features/teachers/pages/my-assignments/my-assignments'
                    ).then(
                        m => m.MyAssignments
                    )
            },

            {
                path: 'teacher/schedule',

                loadComponent: () =>
                    import(
                        './features/teachers/pages/my-schedule/my-schedule'
                    ).then(
                        m => m.MySchedule
                    )
            },

            {
                path: 'attendances',

                loadComponent: () =>
                    import(
                        './features/attendances/pages/attendance-list/attendance-list'
                    ).then(
                        m => m.AttendanceList
                    )
            },

            {
                path: 'attendances/new',

                loadComponent: () =>
                    import(
                        './features/attendances/pages/attendance-form/attendance-form'
                    ).then(
                        m => m.AttendanceForm
                    )
            },

            {
                path: 'attendances/:id/edit',

                loadComponent: () =>
                    import(
                        './features/attendances/pages/attendance-form/attendance-form'
                    ).then(
                        m => m.AttendanceForm
                    )
            },

            {
                path: 'grades',

                loadComponent: () =>
                    import(
                        './features/grades/pages/grade-list/grade-list'
                    ).then(
                        m => m.GradeList
                    )
            },

            {
                path: 'grades/new',

                loadComponent: () =>
                    import(
                        './features/grades/pages/grade-form/grade-form'
                    ).then(
                        m => m.GradeForm
                    )
            },

            {
                path: 'grades/:id/edit',

                loadComponent: () =>
                    import(
                        './features/grades/pages/grade-form/grade-form'
                    ).then(
                        m => m.GradeForm
                    )
            },

            {
                path: 'report-cards',

                loadComponent: () =>
                    import(
                        './features/report-cards/pages/report-card-view/report-card-view'
                    ).then(
                        m => m.ReportCardView
                    )
            }

        ]
    },


    /* =====================================================
       STUDENT
    ===================================================== */

    {
        path: '',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['STUDENT']
        },

        loadComponent: () =>
            import('./features/layouts/student-layout/student-layout')
                .then(m => m.StudentLayout),

        children: [

            {
                path: 'student/dashboard',
                loadComponent: () =>
                    import('./features/dashboard/student-dashboard/student-dashboard')
                        .then(m => m.StudentDashboard)
            },

            {
                path: 'student/schedule',
                loadComponent: () =>
                    import('./features/students/pages/student-schedule/student-schedule')
                        .then(m => m.StudentSchedule)
            },

            {
                path: 'student/attendance',
                loadComponent: () =>
                    import('./features/students/pages/student-attendance/student-attendance')
                        .then(m => m.StudentAttendance)
            },

            {
                path: 'student/grades',
                loadComponent: () =>
                    import('./features/students/pages/student-grades/student-grades')
                        .then(m => m.StudentGrades)
            },

            {
                path: 'student/report-card',
                loadComponent: () =>
                    import('./features/students/pages/student-report-card/student-report-card')
                        .then(m => m.StudentReportCard)
            }

        ]
    },


    /* =====================================================
       FALLBACK
    ===================================================== */

    {
        path: '**',
        redirectTo: 'login'
    }

];