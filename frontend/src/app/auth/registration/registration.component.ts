import { Component, OnInit } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {AuthResponseData, AuthService, Role} from '../auth.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {SignupForm} from '../signupform.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error: string = null;
  isAdmin = false;
  userSub: Subscription;

  private closeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe( user => {
      if (!!user) {
        this.router.navigate(['/home']);
      }
    });
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onAdmin(): void {
    this.isAdmin = !this.isAdmin;
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    this.isLoading = true;

    let signupForm: SignupForm = null;
    const email = form.value.email;
    const password = form.value.password;
    if (!this.isLoginMode) {
      const firstName = form.value.firstName;
      const lastName = form.value.lastName;
      const address = form.value.address;
      const cap = form.value.cap;
      const city = form.value.city;
      signupForm = new SignupForm(
        firstName, lastName, password, email, address, cap, city
      );
    }

    let authObs: Observable<AuthResponseData>;
    let registrationObs: Observable<string>;

    if (this.isLoginMode) {
      authObs = this.authService.login(
        email,
        password,
        this.isAdmin ? Role.ADMIN : Role.USER);
    } else {
      registrationObs = this.authService.signup(signupForm);
    }

    if (registrationObs) {
      registrationObs.subscribe(
        resData => {
          console.log('Registration: ' + resData);
          authObs = this.authService.login(
            email,
            password,
            this.isAdmin ? Role.ADMIN : Role.USER);
        },
        errorMessage => {
          console.log(errorMessage);
          this.error = errorMessage;
          this.isLoading = false;
        }
      );
    }

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }

  onHandleError(): void {
    this.error = null;
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
