import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideErrorTailorConfig } from '../../../@core/components/validation';
import { ContactFormComponent } from './contact-form.component';

describe('ContactFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactFormComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        // The form uses the error-tailor directives, which need their config token.
        provideErrorTailorConfig({ errors: { useFactory: () => ({}), deps: [] } }),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContactFormComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('requires the fields the API marks required', () => {
    const fixture = TestBed.createComponent(ContactFormComponent);
    fixture.detectChanges();

    const form = fixture.componentInstance.contactForm;
    expect(form.valid).toBe(false);

    form.patchValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      mobile: '9876543210',
      city: 'Toronto',
      postalCode: 'M5V',
    });

    expect(form.valid).toBe(true);
  });
});
