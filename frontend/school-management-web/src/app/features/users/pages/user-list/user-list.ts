
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { User } from '../../models/user.model';
import { UserService, CreateUserRequest, UpdateUserRequest } from '../../services/user.service';

type RoleFilter = 'ALL' | 'ADMIN' | 'TEACHER' | 'STUDENT';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserList implements OnInit {

  users: User[] = [];

  loading = true;
  errorMessage = '';

  searchTerm = '';
  selectedRole: RoleFilter = 'ALL';

  selectedUser: User | null = null;

  // CREATE / EDIT MODAL

  showUserForm = false;
  editingUser: User | null = null;

  saving = false;
  formError = '';

  userForm = {
    fullName: '',
    email: '',
    password: '',
    role: 'STUDENT' as User['role']
  };

  // DELETE MODAL

  userToDelete: User | null = null;
  deleting = false;
  deleteError = '';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userService.getAll().subscribe({
      next: users => {
        this.users = users;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: error => {
        console.error('Error loading users:', error);

        this.errorMessage = 'Unable to load users.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get totalUsers(): number {
    return this.users.length;
  }

  get totalAdmins(): number {
    return this.users.filter(
      user => user.role === 'ADMIN'
    ).length;
  }

  get totalTeachers(): number {
    return this.users.filter(
      user => user.role === 'TEACHER'
    ).length;
  }

  get totalStudents(): number {
    return this.users.filter(
      user => user.role === 'STUDENT'
    ).length;
  }

  get filteredUsers(): User[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.users.filter(user => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search);

      const matchesRole =
        this.selectedRole === 'ALL' ||
        user.role === this.selectedRole;

      return matchesSearch && matchesRole;
    });
  }

  getInitials(fullName: string): string {
    const names = fullName.trim().split(/\s+/);

    if (!fullName.trim()) {
      return 'U';
    }

    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    return (
      names[0].charAt(0) +
      names[names.length - 1].charAt(0)
    ).toUpperCase();
  }

  getRoleLabel(role: User['role']): string {
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'TEACHER':
        return 'Teacher';
      case 'STUDENT':
        return 'Student';
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = 'ALL';
  }

  viewUser(user: User): void {
   

    this.selectedUser = user;
    this.cdr.detectChanges();
  }

  closeUserDetails(): void {
    this.selectedUser = null;
    this.cdr.detectChanges();
  }

  // OPEN CREATE MODAL

  openCreateModal(): void {
    this.editingUser = null;

    this.userForm = {
      fullName: '',
      email: '',
      password: '',
      role: 'STUDENT'
    };

    this.formError = '';
    this.showUserForm = true;
  }

  // OPEN EDIT MODAL

  openEditModal(user: User): void {
    this.editingUser = user;

    this.userForm = {
      fullName: user.fullName,
      email: user.email,
      password: '',
      role: user.role
    };

    this.formError = '';
    this.showUserForm = true;
  }

  // CLOSE FORM

  closeUserForm(): void {
    if (this.saving) return;

    this.showUserForm = false;
    this.editingUser = null;
    this.formError = '';
  }

  // SAVE USER

  saveUser(): void {

    if (this.saving) return;

    const fullName = this.userForm.fullName.trim();
    const email = this.userForm.email.trim();

    if (!fullName || !email) {
      this.formError = 'Full name and email are required.';
      return;
    }

    if (!this.editingUser && this.userForm.password.length < 8) {
      this.formError = 'Password must contain at least 8 characters.';
      return;
    }

    this.saving = true;
    this.formError = '';

    if (this.editingUser) {

      const request: UpdateUserRequest = {
        fullName,
        email
      };

      this.userService.update(
        this.editingUser.id,
        request
      ).subscribe({
        next: () => {
          this.saving = false;
          this.showUserForm = false;
          this.editingUser = null;
          this.loadUsers();
        },

        error: error => {
          console.error('CREATE USER ERROR:', error);
          console.error('STATUS:', error.status);
          console.error('BACKEND RESPONSE:', error.error);
          console.log('REQUEST SENT:', request);

          this.saving = false;

          this.formError =
            typeof error.error === 'string'
              ? error.error
              : error.error?.message ||
              error.error?.detail ||
              'Unable to create user.';

          this.cdr.detectChanges();
        }
      });

    } else {

      const request: CreateUserRequest = {
        fullName,
        email,
        password: this.userForm.password,
        role: this.userForm.role
      };

      this.userService.create(request).subscribe({
        next: () => {
          this.saving = false;
          this.showUserForm = false;
          this.loadUsers();
        },

        error: error => {
          this.saving = false;
          this.formError =
            error.error?.message ||
            'Unable to create user.';

          this.cdr.detectChanges();
        }
      });
    }
  }

  // OPEN DELETE MODAL

  confirmDelete(user: User): void {
    this.userToDelete = user;
    this.deleteError = '';
  }

  // CLOSE DELETE MODAL

  closeDeleteModal(): void {
    if (this.deleting) return;

    this.userToDelete = null;
    this.deleteError = '';
  }

  // DELETE USER

  deleteUser(): void {

    if (!this.userToDelete || this.deleting) return;

    this.deleting = true;
    this.deleteError = '';

    this.userService.delete(
      this.userToDelete.id
    ).subscribe({
      next: () => {
        this.deleting = false;
        this.userToDelete = null;
        this.loadUsers();
      },

      error: error => {
        this.deleting = false;
        this.deleteError =
          error.error?.message ||
          'Unable to delete user.';

        this.cdr.detectChanges();
      }
    });
  }
}
