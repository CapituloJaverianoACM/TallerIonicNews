import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // Ejecuta métodos HTTP
import { NewsResponse } from '../shared/news-response';
import { Article } from '../shared/article';

const API_URL = 'https://newsapi.org/v2/top-headlines/'; // Estas constantes deberian ir en un archivo aparte por buenas prácticas y seguridad
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
    return this.http.get<NewsResponse>(API_URL, { params }); // Retorna Observable
  }

}
