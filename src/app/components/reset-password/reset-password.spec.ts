import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPassword } from './reset-password';
import { DataService } from '../../services/data-service';
import { AuthService } from '../../services/auth-service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('ResetPassword', () => {
  let component: ResetPassword;
  let fixture: ComponentFixture<ResetPassword>;
let dataService:jasmine.SpyObj<DataService>;
let authService:jasmine.SpyObj<AuthService>
  beforeEach(async () => {
    dataService=jasmine.createSpyObj('DataService',['handleFormError',
  'handleSuccess',
  'handleApiError']);
    authService=jasmine.createSpyObj('AuthService',['resetPassword'])
    await TestBed.configureTestingModule({
      imports: [ResetPassword],
      providers:[provideRouter([]),{provide:DataService,useValue:dataService},{provide:AuthService,useValue:authService}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize a password sign form',()=>{
    expect(component.passwordForm).toBeTruthy();
    expect(component.passwordForm.contains('token')).toBeTruthy();
    expect(component.passwordForm.contains('email')).toBeTruthy();
  });
  // it('should  should handle a successful password reset',()=>{
  //   const response={message:'password reset successfully'}
  //   authService.resetPassword.and.returnValue(of(response));
  //   expect(dataService.resetPassword).toHaveBeenCalledWith(response);
  // })
  describe('onSubmit function',()=>{
    it('should call handleFormError when the form is invalid',()=>{
      const response={message:"Please fill all the data required correctly!"}
      expect(dataService.handleFormError).toHaveBeenCalledWith(response);
    })
  })
});
