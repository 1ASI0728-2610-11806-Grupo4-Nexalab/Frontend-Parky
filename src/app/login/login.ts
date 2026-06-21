import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CameraSimulation } from '../camera-simulation/camera-simulation';
import { DataService } from '../services/data.service';

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

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const email = this.loginForm.get('email')?.value;

    // Simulate API request
    setTimeout(() => {
      this.isLoading.set(false);

      // Find user in dataService or create a fallback
      const existingUser = this.dataService.users().find(u => u.email.toLowerCase() === email.toLowerCase());

      if (existingUser) {
        this.dataService.currentUser.set(existingUser);
      } else {
        // Create a basic mock user for demonstration
        const namePart = email.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const newUser = this.dataService.addUser({
          name: formattedName,
          email: email,
          role: 'conductor'
        });
        this.dataService.currentUser.set(newUser);
      }

      this.loginSuccess.set(true);
      
      // Redirect to some success state / dashboard
      setTimeout(() => {
        const user = this.dataService.currentUser();
        if (user?.role === 'propietario') {
          this.router.navigate(['/owner']);
        } else {
          this.router.navigate(['/driver']);
        }
      }, 1000);
    }, 1500);
  }
}
