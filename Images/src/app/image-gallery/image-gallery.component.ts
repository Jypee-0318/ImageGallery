import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ImageService } from '../services/image_gallery.service';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ImageGalleryComponent implements OnInit {
  images: Observable<any> = of([]);
  selectedFiles: FileList | null = null;
  baseUrl: string = 'http://localhost/uploads/';

  constructor(private imageService: ImageService) { }

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
    }
  }

  uploadImages(): void {
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles.item(i);
        if (file) {
          this.imageService.uploadImage(file).subscribe((response: any) => {
            console.log('Upload response:', response);
            this.getImages();
          });
        }
      }
    }
  }

  deleteImage(id: number): void {
    this.imageService.deleteImage(id).subscribe((response: any) => {
      console.log('Delete response:', response);
      this.getImages();
    });
  }

  getImageUrl(filePath: string): string {
    return this.baseUrl + filePath;
  }

  viewImageFullSize(id: number): void {
    this.imageService.getImageById(id).subscribe((data: any) => {
        console.log(data);
        if (data && data.file_path) {
        const modal = document.getElementById("imageModal") as HTMLElement;
        const modalImg = document.getElementById("modalImage") as HTMLImageElement;
        modal.style.display = "block";
        modalImg.src = this.getImageUrl(data.file_path);
        modalImg.style.maxWidth = "100%";
        modalImg.style.maxHeight = "100%";
        modalImg.style.objectFit = "contain";
        modalImg.style.width = "auto";
        modalImg.style.height = "auto";
      } else {
        console.error("Image not found.");
        // You may want to display an error message to the user here
      }
    }, error => {
        console.error('Error fetching image:', error);
      });
  }
  
  closeModal(): void {
    const modal = document.getElementById("imageModal") as HTMLElement;
    modal.style.display = "none";
  }
}