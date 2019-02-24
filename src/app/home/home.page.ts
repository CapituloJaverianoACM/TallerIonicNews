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

  ngOnInit(): void {
    this.newsService.getNews().subscribe(res => this.listaArticulos = res.articles);
  }

  goToNewsDetail(articleToShow: Article) {
    this.newsService.articleToShow = articleToShow;
    this.router.navigate(['news-detail']);
  }
}
