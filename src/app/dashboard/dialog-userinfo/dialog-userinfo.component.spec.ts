import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ANIMATION_TEST_PROVIDER, createDialogProviders } from '../../shared/testing/test-helpers';
import { UserList } from '../dashboard.models';
import { DialogUserinfoComponent } from './dialog-userinfo.component';

const mockUser: UserList = {
  id: 1,
  name: 'Test User',
  username: 'testuser',
  email: 'test@test.com',
  phone: '111-222-3333',
  website: 'test.com',
  address: {
    street: 'Main St',
    suite: 'A1',
    city: 'New York',
    zipcode: '10001',
    geo: { lat: '1', lng: '2' },
  },
  company: { name: 'Acme', catchPhrase: 'phrase', bs: 'bs' },
};

describe('DialogUserinfoComponent', () => {
  let component: DialogUserinfoComponent;
  let fixture: ComponentFixture<DialogUserinfoComponent>;
  const dialogProviders = createDialogProviders({ userInfo: mockUser });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogUserinfoComponent],
      providers: [ANIMATION_TEST_PROVIDER, ...dialogProviders],
    })
      .overrideComponent(DialogUserinfoComponent, {
        set: { providers: dialogProviders },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DialogUserinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive user info from dialog data', () => {
    expect(component.userInfo.name).toBe('Test User');
  });
});
