package com.etf.ppis.Repository;

import com.etf.ppis.Model.Request.Response;
import com.etf.ppis.Model.Users.Article;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    //List<Article> findByUserId(Long userId);
}
