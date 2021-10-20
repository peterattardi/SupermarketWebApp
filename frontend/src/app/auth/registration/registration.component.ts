import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {AuthResponseData, AuthService, Role} from '../auth.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {SignupForm} from '../signupform.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  hide = true;
  isLoading = false;
  userSub: Subscription;
  isGuest = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe( user => {
      if (!!user) {
        if (user.role === 'GUEST') {
          this.isGuest = true;
        } else if (user.role === 'USER') {
          this.router.navigate(['/catalogue']);
        } else {
          this.router.navigate(['/management']);
        }
      }
    });
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action);
  }

  onSubmit(form: NgForm): void {

    let loginSub: Subscription;
    let registrationSub: Subscription;

    const unsubscribe = () => {
       if (loginSub) {
          loginSub.unsubscribe();
       }
       if (registrationSub) {
          registrationSub.unsubscribe();
       }
    };

    if (!form.valid) {
      return;
    }

    const login = () => {
      loginSub = loginObs.subscribe(
        () => {
          this.isLoading = false;
          this.router.navigate(['/catalogue']);
        },
        errorMessage => {
          this.isLoading = false;
          this.openSnackBar(errorMessage, 'Ok');
        },
        () => unsubscribe()
      );
    };

    const register = () => {
      registrationSub = registrationObs.subscribe(
        resData => {
          loginObs = this.authService.login(
            email,
            password,
            Role.USER);
          login();
        },
        errorMessage => {
          this.isLoading = false;
          if (errorMessage === 'Session expired') {
            this.authService.logout();
          }
          this.openSnackBar(errorMessage, 'Ok');
        }
      );
    };

    this.isLoading = true;

    let signupForm: SignupForm = null;
    const email = form.value.email;
    const password = form.value.password;
    const firstName = form.value.firstName;
    const lastName = form.value.lastName;
    const address = form.value.address;
    const cap = form.value.cap;
    const city = form.value.city;
    signupForm = new SignupForm(
      firstName, lastName, email, password, address, cap, city
    );

    let loginObs: Observable<AuthResponseData>;
    let registrationObs: Observable<string>;

    if (this.isGuest) {
      registrationObs = this.authService.signupGuest(signupForm);
    } else {
      registrationObs = this.authService.signup(signupForm);
    }

    register();
    form.reset();
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
