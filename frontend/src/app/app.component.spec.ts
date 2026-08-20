import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it(`should have the 'contacts' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);

    expect(fixture.componentInstance.title).toEqual('contacts');
  });

  it('hosts the notification container', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-notification-container')).toBeTruthy();
  });
});
