import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-image-preview',
  standalone: true,
  imports: [],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.css'
})
export class ImagePreviewComponent {
  imageId!:number; 
  imagePath!:string;
  imageName!:string;
  baseUrl!:String;
  constructor(public dialogRef: MatDialogRef<ImagePreviewComponent>,@Inject(MAT_DIALOG_DATA) public data: {img: any}){
    this.imageId = data.img.id;
    this.imageName = data.img.file_name;
    this.imagePath = data.img.file_path;
    console.log(this.imageId);
    console.log(this.imageName);
    console.log(this.imagePath);
    //console.log(this.data.img.id);
    this.baseUrl = `http://localhost/uploads/${this.imagePath}`; 
  }
  cls(){
    this.dialogRef.close();
  }
}
