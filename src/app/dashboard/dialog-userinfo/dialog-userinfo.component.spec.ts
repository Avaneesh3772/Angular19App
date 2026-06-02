import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUserinfoComponent } from './dialog-userinfo.component';

describe('DialogUserinfoComponent', () => {
  let component: DialogUserinfoComponent;
  let fixture: ComponentFixture<DialogUserinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogUserinfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogUserinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
