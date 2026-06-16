import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display copyright text', () => {
    const footerText = fixture.nativeElement.querySelector('.footer-container p');
    expect(footerText?.textContent).toContain('Copyright 1999-2020 by Refsnes Data');
    expect(footerText?.textContent).toContain('All Rights Reserved');
  });

  it('should render footer container', () => {
    const container = fixture.nativeElement.querySelector('.footer-container');
    expect(container).toBeTruthy();
  });
});
