import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ROUTER_TEST_PROVIDER } from '../../testing/test-helpers';
import { PageNotFoundComponent } from './page-not-found.component';

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNotFoundComponent],
      providers: [ROUTER_TEST_PROVIDER],
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display 404 heading', () => {
    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading?.textContent?.trim()).toBe('404');
  });

  it('should display page not found message', () => {
    const subheading = fixture.nativeElement.querySelector('h2');
    const message = fixture.nativeElement.querySelector('p');

    expect(subheading?.textContent?.trim()).toBe('Page Not Found');
    expect(message?.textContent).toContain('The page you are looking for does not exist');
  });

  it('should have a link to dashboard', () => {
    const link = fixture.nativeElement.querySelector('a');
    expect(link?.textContent?.trim()).toBe('Go to Dashboard');
    expect(link?.getAttribute('href')).toBe('/dashboard');
  });

  it('should use RouterLink directive on dashboard link', () => {
    const linkDebugEl = fixture.debugElement.query(By.css('a'));
    expect(linkDebugEl.attributes['ng-reflect-router-link']).toBe('/dashboard');
  });
});
