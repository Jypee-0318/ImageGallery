import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private apiUrl = 'http://localhost/image_gallery_api'; // adjust this to your API URL

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
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
}
