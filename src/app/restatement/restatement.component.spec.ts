import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestatementComponent } from './restatement.component';

/**
 * UNIT TEST — RestatementComponent
 *
 * Shell component with no logic — only verifies creation and template content.
 */

describe('RestatementComponent', () => {
  let component: RestatementComponent;
  let fixture: ComponentFixture<RestatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestatementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RestatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display restatement text in template', () => {
    expect(fixture.nativeElement.textContent).toContain('restatement works!');
  });
});
