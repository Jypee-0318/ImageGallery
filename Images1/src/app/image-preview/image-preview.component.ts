import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageServiceService } from '../services/image-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.css'
})
export class ImagePreviewComponent implements OnInit {
  imageId!:number; 
  imagePath!:string;
  imageName!:string;
  baseUrl!:String;
  commentForm!: FormGroup;
  userID!: number;
  comments: any []=[];
  constructor(public dialogRef: MatDialogRef<ImagePreviewComponent>,@Inject(MAT_DIALOG_DATA) public data: {img: any}, private ImageService: ImageServiceService, private _snackBar: MatSnackBar, private userService: UserService){
    this.imageId = data.img.id;
    this.imageName = data.img.file_name;
    this.imagePath = data.img.file_path;
    console.log(this.imageId);
    console.log(this.imageName);
    console.log(this.imagePath);
    //console.log(this.data.img.id);
    this.baseUrl = `http://localhost/uploads/${this.imagePath}`; 
    this.userID = this.userService.getUserId()!;
  }
  cls(){
    this.dialogRef.close();
  }

  onSubmit(){
    if(this.commentForm.valid){
      // console.log(this.commentForm.value);
      // console.log(this.imageId);
      const comment = this.commentForm.value.comment;
      const imageId = this.imageId;
      this.ImageService.addComment(comment, imageId, this.userID, "addComment").pipe(
        tap((event: HttpResponse<any>) => {
          if (event.type === HttpEventType.Response) {
            if (event.body.status.remarks === 'success') {
              this.getComments();
              this._snackBar.open('Successfully commented', 'Close', {
                duration: 5000,
              });
            }
          }
        })
      ).subscribe();
    }
  }

  ngOnInit():void{
    this.commentForm = new FormGroup({
      comment: new FormControl('', Validators.required)
    });
    this.ImageService.getComments(this.imageId).subscribe(comments => {
      this.comments = comments;
    });
  }
  
  getComments():void{
    this.ImageService.getComments(this.imageId).subscribe(comments => {
      this.comments = comments;
    });
  }
}
