import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestatedReportsComponent } from './restated-reports.component';

describe('RestatedReportsComponent', () => {
  let component: RestatedReportsComponent;
  let fixture: ComponentFixture<RestatedReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestatedReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestatedReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
