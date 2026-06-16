import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { RxjsSharedService } from '../../services/rxjs-shared.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let messageSubject: BehaviorSubject<string>;

  beforeEach(async () => {
    messageSubject = new BehaviorSubject<string>('');

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        {
          provide: RxjsSharedService,
          useValue: {
            headerMessage$: messageSubject.asObservable(),
            sendHeaderMessage: jasmine.createSpy('sendHeaderMessage'),
            clearHeaderMessage: jasmine.createSpy('clearHeaderMessage'),
            getCurrentMessage: () => messageSubject.getValue(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display logo title CQRS', () => {
    const logo = fixture.nativeElement.querySelector('.logo h1');
    expect(logo?.textContent).toContain('CQRS');
  });

  it('should display username', () => {
    const user = fixture.nativeElement.querySelector('.user h2');
    expect(user?.textContent).toContain('Avaneesh Mishra');
  });

  it('should not show rxjs banner when message is empty', () => {
    const banner = fixture.nativeElement.querySelector('.rxjs-message-banner');
    expect(banner).toBeNull();
  });

  it('should show rxjs banner when headerMessage$ emits a message', () => {
    messageSubject.next('Hello from BehaviorSubject');
    fixture.detectChanges();

    const banner = fixture.nativeElement.querySelector('.rxjs-message-banner');
    expect(banner).toBeTruthy();
    expect(banner.textContent).toContain('BehaviorSubject');
    expect(banner.textContent).toContain('Hello from BehaviorSubject');
  });

  it('should hide rxjs banner again when message is cleared', () => {
    messageSubject.next('Temporary message');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.rxjs-message-banner')).toBeTruthy();

    messageSubject.next('');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.rxjs-message-banner')).toBeNull();
  });

  it('should expose headerMessage$ from RxjsSharedService', () => {
    expect(component.headerMessage$).toBeTruthy();
  });
});
