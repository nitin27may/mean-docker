import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ContactDetailsComponent } from './contact-details.component';

const contact = {
  _id: '1',
  firstName: 'Ada',
  lastName: 'Lovelace',
  mobile: '9876543210',
  email: 'ada@example.com',
};

describe('ContactDetailsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactDetailsComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          // The component reads the contact off the route resolver rather than
          // fetching it itself.
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { contactDetails: contact } } },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContactDetailsComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('reads the resolved contact off the route', () => {
    const fixture = TestBed.createComponent(ContactDetailsComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.contact()).toEqual(contact);
  });
});
