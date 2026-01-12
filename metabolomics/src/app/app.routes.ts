import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { FileManagerComponent } from '../pages/file-manager/file-manager.component';
import { PdfContainerComponent } from '../pages/pdf-container/pdf-container.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'filemanager/:tenant',
    component: FileManagerComponent,
  },
  {
    path: 'pdf-container',
    component: PdfContainerComponent,
  },
];
