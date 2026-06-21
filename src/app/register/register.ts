import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CameraSimulation } from '../camera-simulation/camera-simulation';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CameraSimulation],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);

  currentStep = signal(1);
  showPassword = signal(false);
  
  driverSkipped = false;
  ownerSkipped = false;

  // Forms
  personalForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?\d{9,13}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  driverForm: FormGroup = this.fb.group({
    patent: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]{6,8}$/)]],
    color: ['', [Validators.required]],
    model: ['', [Validators.required]]
  });

  ownerForm: FormGroup = this.fb.group({
    garageAddress: ['', [Validators.required]],
    schedule: ['', [Validators.required]],
    rate: ['', [Validators.required, Validators.min(1)]],
    aiInstructions: ['']
  });

  ngOnInit() {
    // We can use query params to automatically highlight paths if needed
  }

  togglePassword() {
    this.showPassword.update(show => !show);
  }

  nextStep() {
    if (this.currentStep() === 1) {
      if (this.personalForm.invalid) {
        this.personalForm.markAllAsTouched();
        return;
      }
      this.currentStep.set(2);
    } else if (this.currentStep() === 2) {
      if (this.driverForm.invalid) {
        this.driverForm.markAllAsTouched();
        return;
      }
      this.driverSkipped = false;
      this.currentStep.set(3);
    }
  }

  skipStep(step: number) {
    if (step === 2) {
      this.driverSkipped = true;
      this.currentStep.set(3);
    } else if (step === 3) {
      this.ownerSkipped = true;
      this.onFinish();
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  onFinish() {
    if (!this.ownerSkipped && this.ownerForm.invalid) {
      this.ownerForm.markAllAsTouched();
      return;
    }

    let finalRole: 'conductor' | 'propietario' | 'both' = 'conductor';
    if (!this.driverSkipped && !this.ownerSkipped) {
      finalRole = 'both';
    } else if (!this.ownerSkipped) {
      finalRole = 'propietario';
    }

    const newUser = this.dataService.addUser({
      name: this.personalForm.value.fullName,
      email: this.personalForm.value.email,
      role: finalRole === 'both' ? 'conductor' : finalRole // Default landing mode
    });
    
    this.dataService.currentUser.set(newUser);
    
    if (finalRole === 'propietario') {
      this.router.navigate(['/owner']);
    } else {
      this.router.navigate(['/driver']);
    }
  }
}
