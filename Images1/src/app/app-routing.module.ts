import { Routes, RouterModule } from '@angular/router';
import { ImageGalleryComponent } from './image-gallery/image-gallery.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [{ 
    path: 'image-gallery', component: ImageGalleryComponent }, 
    {path: 'login', component: LoginComponent},
    {path: '', redirectTo: "login", pathMatch: "full"}
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }