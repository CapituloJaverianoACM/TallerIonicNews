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
