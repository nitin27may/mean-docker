import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ContactListComponent } from './contact-list.component';

describe('ContactListComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactListComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    const fixture = TestBed.createComponent(ContactListComponent);
    fixture.detectChanges();

    httpMock.expectOne(environment.apiEndpoint + '/contacts').flush({ data: [] });

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('sorts contacts newest first and pages them', () => {
    const fixture = TestBed.createComponent(ContactListComponent);
    fixture.detectChanges();

    httpMock.expectOne(environment.apiEndpoint + '/contacts').flush({
      data: [
        { _id: '1', firstName: 'Older', lastName: 'A', mobile: '1', create_date: '2024-01-01T00:00:00Z' },
        { _id: '2', firstName: 'Newer', lastName: 'B', mobile: '2', create_date: '2026-01-01T00:00:00Z' },
      ],
    });

    const component = fixture.componentInstance;

    expect(component.collectionSize()).toBe(2);
    expect(component.contacts()[0].firstName).toBe('Newer');
  });
});
