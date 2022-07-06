package com.etf.ppis.Service;

import com.etf.ppis.Model.Request.Request;
import com.etf.ppis.Model.Request.Response;
import com.etf.ppis.Model.Users.Article;
import com.etf.ppis.Model.Users.User;
import com.etf.ppis.Repository.ArticleRepository;
import com.etf.ppis.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArticleServiceImplementation implements ArticleService{
    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Iterable<Article> getAll() {
        return articleRepository.findAll();
    }

    @Override
    public Article findById(Long id) throws Exception {
        return articleRepository.findById(id).orElseThrow(()-> new Exception("Response with provided id not found!"));
    }

    @Override
    public void remove(Long id) {
        articleRepository.deleteById(id);
    }

    @Override
    public Article save(Article article) {

        return articleRepository.save(article);
    }

    /*@Override
    public List<Article> findByArticleId(Long id) {
        return articleRepository.findByArticleId(id);
    }*/

    @Override
    public Article addArticle(Article article, Long userId) throws Exception {
        User user = userRepository.findById(userId).orElseThrow(() -> new Exception("User with id="+userId+" not found!"));
        article.setCreated(user);
        return articleRepository.save(article);
    }

    @Override
    public Article addArticle(Article article) throws Exception {
        return articleRepository.save(article);
    }
}
