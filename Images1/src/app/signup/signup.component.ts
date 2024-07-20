import { Component, NgZone } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ImageServiceService } from '../services/image-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm:{
    Email: string;
    FirstName: string;
    LastName: string;
    Password: string;
    rePassword: string; 
  } = {
    Email:"",
    FirstName:"",
    LastName:"",
    Password:"",
    rePassword:""
  };
  error: string = "";

  constructor (private Router: Router, private ngZone: NgZone, private ImageService: ImageServiceService, private _snackBar: MatSnackBar, private userService: UserService){

  }

  onSignup(){
    this.ImageService.signup(this.signupForm.Email, this.signupForm.FirstName, this.signupForm.LastName, this.signupForm.Password, this.signupForm.rePassword, "signup").pipe(
      tap((event: HttpResponse<any>) => {
        if (event.type === HttpEventType.Response) {
          const response = event as HttpResponse<any>;
          if (response.body.status.remarks === 'success') {
            this._snackBar.open('SignUp Successfully', 'Close', {
              duration: 8000,
            });
            this.userService.setUserId(response.body.payload);
            this.ngZone.run(() => {
              this.Router.navigate(['/image-gallery']);
            });
          } else {
            //this.openDialog("Email or password is incorrect. Please try again");
            this._snackBar.open("Email or password is incorrect. Please try again","Close", {
              duration: 5000, 
            });
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.error.status.message === 'Email Already Taken') {
          this._snackBar.open('Email is already taken', 'Close', {
            duration: 8000,
          });

        } else if (error.error.status.message === 'Passwords do not match'){
          this._snackBar.open('Passwords do not match', 'Close', {
            duration: 5000,
          });
        } else if (error.error.status.message === 'Name should be less than 30 characters'){
          this._snackBar.open('Name should be less than 30 characters', 'Close', {
            duration: 5000,
          });
        }
        return throwError(() => new Error('Something bad happened; please try again later.'));
      })
    ).subscribe();
  }
}
