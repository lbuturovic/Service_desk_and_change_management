package com.etf.ppis.Controller;

import com.etf.ppis.Model.Request.Response;
import com.etf.ppis.Model.Request.ResponseStatus;
import com.etf.ppis.Model.Users.Article;
import com.etf.ppis.Service.ArticleService;
import com.etf.ppis.Service.ResponseService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@EnableSwagger2
@RequestMapping("/api")
public class ArticleController {
    @Autowired
    ArticleService articleService;

    ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/article")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER') or hasRole('CLIENT')")
    public ResponseEntity<List<Article>> getAllArticles() {
        List<Article> articles = (List<Article>) articleService.getAll();
        if (articles.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(articles, HttpStatus.OK);
    }

    @GetMapping("/article/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER') or hasRole('CLIENT')")
    public ResponseEntity<Article> getArticleById(@PathVariable("id") Long id) throws Exception {
        Article newArticle = articleService.findById(id);
        return ResponseEntity.ok().body(newArticle);
    }

    @PostMapping("/user/{userId}/article")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER') or hasRole('CLIENT')")
    public ResponseEntity<Article> addNewArticle(@PathVariable(value = "userId") Long userId, @Valid @RequestBody Article article) throws Exception {
        Article newArticle;
        if(article.getTaggs() == null)
            newArticle = new Article(article.getTitle(), article.getDescription());
        else
            newArticle = new Article(article.getTitle(), article.getDescription(), article.getTaggs());
        return new ResponseEntity<>(articleService.addArticle(newArticle, userId), HttpStatus.CREATED);
    }

    @PostMapping("/article")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER') or hasRole('CLIENT')")
    public ResponseEntity<Article> addNewArticle(@Valid @RequestBody Article article) throws Exception {
        Article newArticle;
        if(article.getTaggs() == null)
            newArticle = new Article(article.getTitle(), article.getDescription());
        else
            newArticle = new Article(article.getTitle(), article.getDescription(), article.getTaggs());
        return new ResponseEntity<>(articleService.addArticle(newArticle), HttpStatus.CREATED);
    }

    private Article applyPatchToArticle(
            JsonPatch patch, Article targetArticle) throws JsonPatchException, JsonProcessingException {
        JsonNode patched = patch.apply(objectMapper.convertValue(targetArticle, JsonNode.class));
        return objectMapper.treeToValue(patched, Article.class);
    }

    @PatchMapping(path = "/article/{id}", consumes = "application/json-patch+json")
    public ResponseEntity updateArticle(@PathVariable Long id, @RequestBody JsonPatch patch) {
        try {
            Article article = articleService.findById(id);
            Article articlePatched = applyPatchToArticle(patch, article);
            articleService.save(articlePatched);
            return new ResponseEntity<>("Article with id = " + id + " successfully updated!", HttpStatus.OK);
        } catch (JsonPatchException | JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/article/{id}")
    public ResponseEntity<String> deleteArticle(@PathVariable long id){
        articleService.remove(id);
        return new ResponseEntity<>("Article successfully deleted!", HttpStatus.OK);
    }
}
