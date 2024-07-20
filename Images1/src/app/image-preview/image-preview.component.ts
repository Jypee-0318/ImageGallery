import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImageServiceService } from '../services/image-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { UserService } from '../services/user.service';
import { ImageEditComponent } from '../image-edit/image-edit.component';


@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.css'
})
export class ImagePreviewComponent implements OnInit {
  imageId!: number;
  imagePath!: string;
  imageName!: string;
  baseUrl: string;
  commentForm!: FormGroup;
  userID!: number;
  comments: Observable<any> = of([]);
  commentsArray: any[] = [];
  constructor(public dialogRef: MatDialogRef<ImagePreviewComponent>, @Inject(MAT_DIALOG_DATA) public data: { img: any }, private ImageService: ImageServiceService, private _snackBar: MatSnackBar, private userService: UserService, public dialog: MatDialog) {
    this.imageId = data.img.id;
    this.imageName = data.img.file_name;
    this.imagePath = data.img.file_path;
    console.log(this.imageId);
    console.log(this.imageName);
    console.log(this.imagePath);
    //console.log(this.data.img.id);
    this.baseUrl = `http://localhost/AppDevSoloProj/photoGallery/server/modules/uploads/${this.imagePath}`;
    this.userID = this.userService.getUserId()!;
    console.log(this.imageId);
    this.loadComments(this.imageId);
  }
  cls() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.commentForm.valid) {
      // console.log(this.commentForm.value);
      // console.log(this.imageId);
      const comment = this.commentForm.value.comment;
      const imageId = this.imageId;
      this.ImageService.addComment(comment, imageId, this.userID, "addComment").pipe(
        tap((event: HttpResponse<any>) => {
          if (event.type === HttpEventType.Response) {
            if (event.body.status.remarks === 'success') {
              this.loadComments(this.imageId);
              this._snackBar.open('Successfully commented', 'Close', {
                duration: 5000,
              });
            }
          }
        })
      ).subscribe();
    }
    // this.loadComments(this.imageId);
  }

  ngOnInit() {
    this.commentForm = new FormGroup({
      comment: new FormControl('', Validators.required)
    });
    this.loadComments(this.imageId);
  }

  loadComments(image_id: number) {
    this.ImageService.getComments(image_id).subscribe((response: any[]) => {
      console.log(response);
      this.commentsArray = response;
      console.log(this.commentsArray);
    });
  }

  getComments(): void {
    this.comments = this.ImageService.getComments(this.imageId);

  }
  btnEdit(file_path:string){
    this.dialog.open(ImageEditComponent, { width: '70rem', height: '50rem', data: { file_path } });
  }
}