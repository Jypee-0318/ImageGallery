import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ImageService } from '../services/image_gallery.service';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ImageGalleryComponent implements OnInit {
  images: Observable<any> = of([]);
  selectedFile: File | null = null;
  baseUrl: string = 'http://localhost:8080/uploads/'; // Adjust this URL as per your server configuration

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
      this.selectedFile = target.files[0];
    }
  }

  uploadImage(): void {
    if (this.selectedFile) {
      this.imageService.uploadImage(this.selectedFile).subscribe((response: any) => {
        console.log('Upload response:', response);
        this.getImages();
      });
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
      if (data && data.fullImageUrl) {
        const modal = document.getElementById("imageModal") as HTMLElement;
        const modalImg = document.getElementById("modalImage") as HTMLImageElement;
        modal.style.display = "block";
        modalImg.src = data.fullImageUrl;
        modalImg.style.maxWidth = "80%"; // Adjust width as needed
        modalImg.style.maxHeight = "80%"; // Adjust height as needed
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
 
