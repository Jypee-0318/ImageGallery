import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageEditorComponent } from '@syncfusion/ej2-angular-image-editor';

@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.css']
})
export class ImageEditComponent {
  imagePath: string = "";
  objectImages: any[] = [];

  constructor(public dialogRef: MatDialogRef<ImageEditComponent>, @Inject(MAT_DIALOG_DATA) public data: { file_path: string }) {
    this.imagePath = this.data.file_path;
  }

  @ViewChild('imageEditor') public editorObject!: ImageEditorComponent;

  public openImage(): void {
    this.editorObject.open(this.imagePath);
    console.log(this.imagePath);
  }
}
