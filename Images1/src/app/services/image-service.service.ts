import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ImageServiceService {

  private apiUrl = 'http://localhost/image_gallery_api'; // adjust this to your API URL

  constructor(private http: HttpClient) { }

  uploadImage(file: File, userID: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userID', userID.toString());
    return this.http.post(`${this.apiUrl}/upload`, formData).pipe(
      catchError((error: any) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  getImages(): Observable<any[]> {
    return this.http.get(`${this.apiUrl}/images`).pipe(
      map((response: any) => response.records),
      catchError((error: any) => {
        console.error(error);
        return throwError(error);
      })
    );
  }
  getComments(image_id: number): Observable<any[]> {
    return this.http.get(`${this.apiUrl}/comments?image_id=${image_id}`).pipe(
      tap((response: any) => console.log(response)),
      catchError((error: any) => {
        console.error(error);
        return throwError(error);
      })
    );
  }
  getImageById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/image/${id}`).pipe(
      catchError((error: any) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  deleteImage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`).pipe(
      catchError((error: any) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  login(email:string, password:string, request:string):Observable <any> {
    console.log("loginService");
    const URL = `${this.apiUrl}/${request}`;
    const data = {
      email: email,
      password: password
    }
    return this.http.post(URL, data,{
      observe: "events"
    })
  }
  
  signup(Email:string, FirstName:string, LastName:string, Password:string, rePassword:string, request:string):Observable <any>{
    console.log("signUpService");
    const URL = `${this.apiUrl}/${request}`;
    const data = {
      Email: Email,
      FirstName: FirstName,
      LastName: LastName,
      Password: Password,
      rePassword: rePassword
    }
    return this.http.post(URL, data,{
      observe: "events"
    })
  }

  addComment(comment:string, imageID:number, userID:number, request:string):Observable <any>{
    console.log("signUpService");
    const URL = `${this.apiUrl}/${request}`;
    const data = {
      comment: comment,
      imageID: imageID,
      userID: userID
    }
    return this.http.post(URL, data,{
      observe: "events"
    })
  } 
}
