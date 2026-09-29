import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Signup } from './signup';
import { AuthService } from '../../services/auth-service';
import { DataService } from '../../services/data-service';
import { SeoService } from '../../services/seo.service';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;

  let authService: jasmine.SpyObj<AuthService>;
  let dataService: jasmine.SpyObj<DataService>;
  let seoService: jasmine.SpyObj<SeoService>;

  beforeEach(async () => {

    authService = jasmine.createSpyObj('AuthService', ['register']);

    dataService = jasmine.createSpyObj('DataService', [
      'handleApiError'
    ]);

    seoService = jasmine.createSpyObj('SeoService', [
      'setSignupPageSEO'
    ]);

    await TestBed.configureTestingModule({
      imports: [Signup],

      providers: [
        provideRouter([]),

        {
          provide: AuthService,
          useValue: authService
        },

        {
          provide: DataService,
          useValue: dataService
        },

        {
          provide: SeoService,
          useValue: seoService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call setSignupPageSEO on init',()=>{
    expect(seoService.setSignupPageSEO).toHaveBeenCalled()
    })
});