import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
// import { ImageEditorModule } from '@syncfusion/ej2-angular-image-editor';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImageGalleryComponent } from './image-gallery/image-gallery.component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageGalleryComponent,
    ImagePreviewComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    HttpClientModule,
    MatIconModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    // ImageEditorModule ,
    DragDropModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
