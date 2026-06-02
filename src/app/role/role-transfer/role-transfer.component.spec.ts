import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleTransferComponent } from './role-transfer.component';

describe('RoleTransferComponent', () => {
  let component: RoleTransferComponent;
  let fixture: ComponentFixture<RoleTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleTransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
