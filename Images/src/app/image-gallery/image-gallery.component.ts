import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ImageService } from '../services/image_gallery.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css'],
  standalone: true,
  imports: [CommonModule, MatSnackBarModule]
})
export class ImageGalleryComponent implements OnInit {
  images: Observable<any> = of([]);
  selectedFiles: FileList | null = null;
  selectedImage: string | null = null;
  baseUrl: string = 'http://localhost/uploads/';

  constructor(private imageService: ImageService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getImages();
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
          this.imageService.uploadImage(file).subscribe((response: any) => {
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
        panelClass: ['custom-snackbar']
      });
      this.getImages();
    }, error => {
      console.error('Delete error:', error);
      this.snackBar.open('Failed to delete image.', 'Close', {
        duration: 4000,
        panelClass: ['custom-snackbar']
      });
    });
  }

  getImageUrl(filePath: string): string {
    return this.baseUrl + filePath;
  }

  openPreview(imgUrl: string): void {
    this.selectedImage = imgUrl;
  }

  closePreview(): void {
    this.selectedImage = null;
  }
}
