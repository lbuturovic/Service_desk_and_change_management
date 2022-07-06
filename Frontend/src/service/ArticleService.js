import axios from 'axios'

export class ArticleService {
    getArticles() {
        return axios.get('assets/demo/data/articles.json')
            .then(res => res.data.data);
    }    
}