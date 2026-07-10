import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CameraSimulation } from '../camera-simulation/camera-simulation';
import { DataService } from '../services/data.service';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CameraSimulation],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private dataService = inject(DataService);
  private supabaseService = inject(SupabaseService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  loginSuccess = signal(false);

  togglePassword() {
    this.showPassword.update(show => !show);
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    try {
      // 1. Authenticate with Supabase
      const { data, error } = await this.supabaseService.login(email, password);
      
      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('No user data returned.');
      }

      // 2. Fetch User Profile & Role from public schema
      const profile = await this.supabaseService.getUserProfile(data.user.id);
      
      if (!profile) {
        throw new Error('Profile not found in database.');
      }

      // 3. Update the global current user state (for now in DataService)
      // Note: DataService will be refactored soon to hold the real profile instead of mock interface
      this.dataService.setCurrentUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role === 'owner' ? 'propietario' : 'conductor', // mapping to old terminology for now
        avatarUrl: profile.avatar_url || (profile.role === 'owner' 
          ? 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80' 
          : 'https://randomuser.me/api/portraits/men/32.jpg'),
        reputation: profile.reputation || 5.0,
        memberSince: profile.created_at 
          ? new Date(profile.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
          : 'Enero 2023',
      } as any);

      this.loginSuccess.set(true);
      
      // 4. Redirect based on role
      setTimeout(() => {
        if (profile.role === 'owner') {
          this.router.navigate(['/owner']);
        } else {
          this.router.navigate(['/driver']);
        }
      }, 500);

    } catch (err: any) {
      this.errorMessage.set(err.message || 'Ocurrió un error al iniciar sesión.');
      this.isLoading.set(false);
    }
  }
}
