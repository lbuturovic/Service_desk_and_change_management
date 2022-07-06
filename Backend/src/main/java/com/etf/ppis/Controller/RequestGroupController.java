package com.etf.ppis.Controller;

import com.etf.ppis.Model.Change.RequestGroup;
import com.etf.ppis.Model.Users.User;
import com.etf.ppis.Service.RequestGroupService;
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
@RequestMapping(path = "/api")
public class RequestGroupController {

    @Autowired
    RequestGroupService groupService;

    @GetMapping("/groups/{id}")
    public ResponseEntity<RequestGroup> getGroupById(@PathVariable(value = "id") Long id) {
        return new ResponseEntity<>(groupService.getGroupById(id), HttpStatus.OK);
    }

    @GetMapping("/groups")
    @PreAuthorize("hasRole('ADMIN') or hasRole('APPROVER') or hasRole('SERVICE') or hasRole('DEV')")
    public ResponseEntity<List<RequestGroup>> getAllGroups() {
        List<RequestGroup> groups = groupService.getAllGroups();
        if (groups.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(groups, HttpStatus.OK);
    }

    @DeleteMapping("/groups/{id}")
    public ResponseEntity<HttpStatus> deleteGroup(@PathVariable("id") Long id) {
        groupService.deleteGroup(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/groups")
    public ResponseEntity<RequestGroup> createGroup(@Valid @RequestBody RequestGroup groupRequest) {
        return new ResponseEntity<>(groupService.createGroup(groupRequest), HttpStatus.CREATED);
    }
}
