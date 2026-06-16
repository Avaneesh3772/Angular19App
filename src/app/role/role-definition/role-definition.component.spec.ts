import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ANIMATION_TEST_PROVIDER } from '../../shared/testing/test-helpers';
import { RoleService } from '../role.service';
import { RoleDefinitionComponent } from './role-definition.component';

describe('RoleDefinitionComponent', () => {
  let component: RoleDefinitionComponent;
  let fixture: ComponentFixture<RoleDefinitionComponent>;
  let roleServiceSpy: jasmine.SpyObj<RoleService>;

  beforeEach(async () => {
    roleServiceSpy = jasmine.createSpyObj('RoleService', ['getUsersList']);
    roleServiceSpy.getUsersList.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [RoleDefinitionComponent],
      providers: [
        ANIMATION_TEST_PROVIDER,
        { provide: RoleService, useValue: roleServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
