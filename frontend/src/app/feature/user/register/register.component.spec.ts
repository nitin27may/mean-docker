import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(RegisterComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('starts invalid and requires matching passwords', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const form = fixture.componentInstance.registerForm;

    expect(form.valid).toBe(false);

    form.patchValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      username: 'ada@example.com',
      password: 'Passw0rd!',
      confirmPassword: 'Different1!',
    });

    expect(form.errors?.['passwordMustMatch']).toBe(true);

    form.patchValue({ confirmPassword: 'Passw0rd!' });

    expect(form.errors?.['passwordMustMatch']).toBeUndefined();
  });
});
