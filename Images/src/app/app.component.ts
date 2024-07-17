import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageGalleryComponent } from './image-gallery/image-gallery.component';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ImageGalleryComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Images';
}
