import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatDialog, MatDialogModule} from '@angular/material/dialog'
import { ImagePreviewComponent } from '../image-preview/image-preview.component';
import { ImageServiceService } from '../services/image-service.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css'],
})
export class ImageGalleryComponent implements OnInit {
  images: Observable<any> = of([]);
  selectedFiles: FileList | null = null;
  selectedImage: string | null = null;
  baseUrl: string = 'http://localhost/AppDevSoloProj/photoGallery/server/modules/uploads/';
  userID!: number;
  constructor(private imageService: ImageServiceService, private snackBar: MatSnackBar, public dialog: MatDialog, private userService: UserService, private router: Router) { 
    this.userID = this.userService.getUserId()!;
  }

  ngOnInit(): void {
    this.getImages();
    console.log(this.images);
    this.images.subscribe({
      next: (value) => console.log(value),
      error: (error) => console.error('Error:', error),
      complete: () => console.log('Complete')
    });
  }

  getImages(): void {
    this.images = this.imageService.getImages();
  }

  handleFileInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && target.files) {
      this.selectedFiles = target.files;
      this.uploadImages();
    }
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files) {
      this.selectedFiles = files;
      this.uploadImages();
    }
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  uploadImages(): void {
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles.item(i);
        if (file) {
          if (file.size > 50000000) { // 50 MB limit
            this.snackBar.open('File size exceeds the 50 MB limit.', 'Close', {
              duration: 4000,
              panelClass: ['custom-snackbar']
            });
            continue;
          }
          this.imageService.uploadImage(file, this.userID).subscribe((response: any) => {
            console.log('Upload response:', response);
            this.snackBar.open('Image uploaded successfully!', 'Close', {
              duration: 4000,
              panelClass: ['custom-snackbar']
            });
            this.getImages();
          }, error => {
            console.error('Upload error:', error);
            this.snackBar.open('Image upload failed.', 'Close', {
              duration: 4000,
              panelClass: ['custom-snackbar']
            });
          });
        }
      }
    }
  }

  deleteImage(id: number): void {
    this.imageService.deleteImage(id).subscribe((response: any) => {
      console.log('Delete response:', response);
      this.snackBar.open('Image deleted successfully!', 'Close', {
        duration: 4000,
      });
      this.getImages();
    }, error => {
      console.error('Delete error:', error);
      this.snackBar.open('Failed to delete image.', 'Close', {
        duration: 4000,
      });
    });
  }

  getImageUrl(filePath: string): string {
    console.log(this.baseUrl + filePath);
    return this.baseUrl + filePath;
  }

  openPreview(img: any): void {
    //this.selectedImage = imgUrl;
    this.dialog.open(ImagePreviewComponent, {width: '50 rem', height: '50 rem', data: {img}})
  }

  closePreview(): void {
    this.selectedImage = null;
  }
  logout(): void{
    this.userService.logout();
    this.router.navigate(['/login/']);
  }
}
