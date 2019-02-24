import { Article } from './article';

export interface NewsResponse {
    status: string;
    totalResults: number;
    articles: Article[];
}