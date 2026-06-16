import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleComponent } from './role.component';

/**
 * UNIT TEST — RoleComponent
 *
 * Shell component with no logic — only verifies creation and template content.
 */

describe('RoleComponent', () => {
  let component: RoleComponent;
  let fixture: ComponentFixture<RoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display role text in template', () => {
    expect(fixture.nativeElement.textContent).toContain('role works!');
  });
});
