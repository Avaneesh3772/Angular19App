import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ANIMATION_TEST_PROVIDER } from '../../shared/testing/test-helpers';
import { RoleService } from '../role.service';
import { RoleAssignmentComponent } from './role-assignment.component';

describe('RoleAssignmentComponent', () => {
  let component: RoleAssignmentComponent;
  let fixture: ComponentFixture<RoleAssignmentComponent>;
  let roleServiceSpy: jasmine.SpyObj<RoleService>;

  beforeEach(async () => {
    roleServiceSpy = jasmine.createSpyObj('RoleService', [
      'getUsersSearchList',
      'getUserFullDetails',
    ]);
    roleServiceSpy.getUsersSearchList.and.returnValue(of([]));
    roleServiceSpy.getUserFullDetails.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [RoleAssignmentComponent],
      providers: [
        ANIMATION_TEST_PROVIDER,
        { provide: RoleService, useValue: roleServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
