package com.etf.ppis.Service;

import com.etf.ppis.Model.Request.Response;
import com.etf.ppis.Model.Users.Article;

import java.util.List;

public interface ArticleService {
    Iterable<Article> getAll();
    Article findById(Long id) throws Exception;
    Article save(Article article);
    void remove(Long id);
    //List<Article> findByArticleId(Long id);
    Article addArticle(Article article,Long userId) throws Exception;
    Article addArticle(Article article) throws Exception;
}
