import { Component, NgZone } from '@angular/core'; 
import { ImageService } from '../services/image-gallery.service';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email:string = '';
  password:string = '';

  constructor(private imageservice:ImageService, private userService:UserService, private router:Router, private ngZone:NgZone){

  }

  onLogin(){
    const email = this.email;
    const password = this.password;
    this.imageservice.login(email, password, "login").pipe(
      tap((event: HttpResponse<any>) => {
        if (event.type === HttpEventType.Response) {
          const response = event as HttpResponse<any>;
          if (response.body.status.remarks === 'success') {
            this.userService.setUserId(response.body.payload);
            this.ngZone.run(() => {
              this.router.navigate(['/image-gallery']);
            });
          } else {
            //this.openDialog("Email or password is incorrect. Please try again");
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle the error here
        // For example, open a dialog or log the error
        // this.openDialog("Email or password is incorrect. Please try again");
        // Return an observable with a user-facing error message
        return throwError(() => new Error('Something bad happened; please try again later.'));
      })
    ).subscribe();
  }
}

