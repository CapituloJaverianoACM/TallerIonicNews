# Taller Ionic 4

Por **[Juan Pablo Peñaloza Botero](https://github.com/juanpa097)** 

## Objetivos

- Aprender a intalar y crear un nuevo proyecto en Ionic.
- Aprender la estructura de un proyecto de Ionic.
- Aprender que es una *page* y un *provider*.
- Aprender a ultilizar los Docs de Ionic.

## Assesment

Hacer una aplicación que muestre noticias recientes.

## Desarrollo del Taller

### Configuración del Entorno de Desarrollo 

Verifivar que `node` y `npm` estén instalados.

```shell
node -v # 10.15.0
```

```shell
npm -v  # 6.7.0
```

En caso de que no estén instalados ir a [Nodejs](https://nodejs.org/en/).

Instalar [Visual Estudio Code](https://code.visualstudio.com/)

### Instalar y Crear Proyecto en Ionic Framwork

```shell
sudo npm install -g ionic
```

```shell
ionic start news-app blank --type=angular
```

```shell
cd news-app
```

```shell
ionic serve # Abrir el navegador en modo movil
```

Para mas infromación de las diferentes formas de crear una proyecto ver este [link de documentación](https://ionicframework.com/docs/building/starting)

### Crear nuevas *Pages*

Una *Page* es una nueva vista o actividad de la aplicación y para crearla utilizamos el siguiente comando:

```shell
ionic generate page news-detail # generate puede abreviarse a una 'g'
```





### Crear Front End del Feed de Noticias

Cambiar título de la página `src/app/home/home.page.html`

```html
<ion-header>
  <ion-toolbar>
    <ion-title>
      News Feed <!-- El título va aquí -->
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content padding>
  <div *ngFor="let _ of [1,2,3,4,5,6,7]">
    <ion-card>
      <ion-card-header>
        <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
        <ion-card-title>Card Title</ion-card-title>
      </ion-card-header>
    
      <ion-card-content>
        Keep close to Nature's heart... and break clear away, once in awhile,
        and climb a mountain or spend a week in the woods. Wash your spirit clean.
      </ion-card-content>
    </ion-card>
  </div>
</ion-content>
```



### Navegar de Feed a NewsDetail

En esta parte vemos como navegar de una *Page* a otra.

En el archivo `src/app/home/home.page.ts`

```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private router: Router) { } // Agregar Injectable

  goToNewsDetail() {
    this.router.navigate(['news-detail']); // El link esta en app-routing.module.ts
  }
}
```

### Construir Front End de News Detail

En el archivo `src/app/news-detail/news-detail.page.html`

```html
<ion-header>
  <ion-toolbar>
    <ion-title>New Detail</ion-title>
    <ion-buttons slot="start">
      <ion-buttons slot="start">
        <ion-back-button defaultHref="home"></ion-back-button> <!-- Back Button -->
      </ion-buttons>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content padding>
  <ion-card>
    <ion-img src="https://ionicframework.com/docs/demos/api/card/madison.jpg"></ion-img>
    <ion-card-header>
      <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
      <ion-card-title>Card Title</ion-card-title>
    </ion-card-header>
  
    <ion-card-content>
      Keep close to Nature's heart... and break clear away, once in awhile,
      and climb a mountain or spend a week in the woods. Wash your spirit clean.
    </ion-card-content>
  </ion-card>
</ion-content>
```



### Crear Modelo de Artículo

Crear interfaz para mapear los datos a la app. Estos modelos los sacmos de la [NewsAPI](https://newsapi.org/)

 `src/app/shared/article.ts`  

```typescript
export interface Article {
    source: any;
    author: string;
    title: string;
    description: string;
    url?: string;
    urlToImage?: string;
    publishedAt: string;
    content: string;
}

```

`src/app/shared/news-response.ts`

```typescript
import { Article } from './article';

export interface NewsResponse {
    status: string;
    totalResults: number;
    articles: Article[];
}
```



### Crear Los Servicios

Los servicios de Ionic vienen de Angular y el la capa que se encarga de conectarse con el *back end*. Esta capa se encarga de todos los métodos **HTTP** para bajar y subir datos normalmente en JSON.

```shell
ionic generate service services/news # Para crearlos en una carpeta separada
```

En el archivo ```src/app/services/news.service.ts```

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // Ejecuta métodos HTTP
import { Article } from '../shared/article';

const API_URL = 'https://newsapi.org/v2/top-headlines/'; // Deberian ser archivos separados
const API_KEY = '3e2eae281f6b433ba1916629ed2690c4';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { } // Instaciar http
  articleToShow:Article;

  getNews() {
    const params = new HttpParams()
      .set('country', 'us') // Parámetros para get
      .set('apiKey', API_KEY);
    return this.http.get<Article>(API_URL, { params }); // Retorna Observable
  }

}
```

Agregar el módulo de HTTP a `src/app/app.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http'; // Agregar

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
      BrowserModule, 
      IonicModule.forRoot(), 
      AppRoutingModule, 
      HttpClientModule // Agregar
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Consumir los Servicios y Desplegar en el HTML

En el archivo `src/app/home/home.page.ts` vamos declarar los servicios y obtener los artículos

```typescript
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { NewsService } from '../services/news.service';
import { Article } from '../shared/article';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private router: Router, private newsService: NewsService) { }

  listaArticulos: Article[];

  // Consumir servicios
  ngOnInit(): void {
    this.newsService.getNews().subscribe(res => this.listaArticulos = res.articles);
  }

  // Pasar info del artículo a la próxima page
  goToNewsDetail(articleToShow: Article) { 
    this.newsService.articleToShow = articleToShow;
    this.router.navigate(['news-detail']);
  }
}

```

En el archivo `src/app/home/home.page.html` vamos desplegar los artículos

```html
<ion-header>
  <ion-toolbar>
    <ion-title>
      Ionic Blank
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content *ngIf="listaArticulos" padding>
  <div *ngFor="let articulo of listaArticulos">
    <ion-card (click)="goToNewsDetail()"> 
      <ion-card-header>
        <ion-card-subtitle>{{articulo.source.name}}</ion-card-subtitle> 
        <ion-card-title>{{articulo.title}}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        {{articulo.description}} <!-- Interpolation of data -->
      </ion-card-content>
    </ion-card>
  </div>
</ion-content>

```

## Challenge!

### Desplegar Detalle de Noticia en NewsDetail 

La solución va a estar acontinuación un cosejo: No la veas antes de intentarlo  :)

`src/app/news-detail/news-detail.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { Article } from '../shared/article';
import { NewsService } from '../services/news.service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
})
export class NewsDetailPage implements OnInit {
  articleToShow: Article;

  constructor(private newsService: NewsService) {
  }
  
  
  ngOnInit() {
    this.articleToShow = this.newsService.articleToShow;    
  }

}
```



`src/app/news-detail/news-detail.html`

```html
  <ion-header>
    <ion-toolbar>
      <ion-title>{{articleToShow.title}}</ion-title>
      <ion-buttons slot="start">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="home"></ion-back-button>
        </ion-buttons>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  
  <ion-content padding>
    <ion-card>
      <ion-img [src]="articleToShow.urlToImage"></ion-img>
      <ion-card-header>
        <ion-card-subtitle>{{articleToShow.source.name}}</ion-card-subtitle>
        <ion-card-title>{{articleToShow.title}}</ion-card-title>
      </ion-card-header>
      
      <ion-card-content>
        {{articleToShow.description}}
      </ion-card-content>
    </ion-card>
  </ion-content>

```



# Gracias

