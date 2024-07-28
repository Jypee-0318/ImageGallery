import { Component, Inject, ViewChild, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageEditorComponent } from '@syncfusion/ej2-angular-image-editor';
import { ImageServiceService } from '../services/image-service.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.css']
})
export class ImageEditComponent {
  @ViewChild('imageEditor') public editorObject!: ImageEditorComponent;
  @Output() imageUpdated = new EventEmitter<void>();

  imagePath: string = "";
  objectImages: any[] = [];
  images: Observable<any> = of([]);

  constructor(
    public dialogRef: MatDialogRef<ImageEditComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { file_path: string }, 
    private imageService: ImageServiceService
  ) {
    this.imagePath = this.data.file_path;
  }

  public openImage(): void {
    this.editorObject.open(this.imagePath);
    console.log(this.imagePath);
  }

  // public saveImage(): void {
  //   const canvas = this.editorObject.getImageData().canvas;
  //   canvas.toBlob((blob) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const base64Image = reader.result as string;
  //       this.imageService.uploadEditedImage(base64Image, this.data.file_path).subscribe(response => {
  //         console.log('Image saved successfully:', response);
  //         this.imageUpdated.emit(); // Emit event after successful save
  //         this.dialogRef.close();
  //       }, error => {
  //         console.error('Error saving image:', error);
  //       });
  //     };
  //     reader.readAsDataURL(blob as Blob);
  //   });
  // }
}
