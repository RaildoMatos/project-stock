import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { BrowserModule } from '@angular/platform-browser';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsComponent } from './components/products/products.component';
import { TypesComponent } from './components/types/types.component';
import { AuthService } from './shared/services/auth.service';
<<<<<<< HEAD
import { HeaderComponent } from './views/header/header.component';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { TabMenuModule } from 'primeng/tabmenu';

=======
>>>>>>> 0d3c04e7894662094b39abe0e2b40e09f0e76297

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderComponent,
    ProductsComponent,
    TypesComponent,
    DashboardComponent,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
<<<<<<< HEAD
    DividerModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    MessagesModule,
    TabMenuModule,
=======
>>>>>>> 0d3c04e7894662094b39abe0e2b40e09f0e76297
  ],
  providers: [importProvidersFrom(HttpClientModule), AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
