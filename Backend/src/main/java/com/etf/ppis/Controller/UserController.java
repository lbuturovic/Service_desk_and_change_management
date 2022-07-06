package com.etf.ppis.Controller;

import com.etf.ppis.Model.Users.Role;
import com.etf.ppis.Model.Users.User;
import com.etf.ppis.Payload.request.SignupRequest;
import com.etf.ppis.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@EnableSwagger2
@RestController
@RequestMapping(path = "/api")
public class UserController {

    @Autowired
    private UserService userService;


    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER')")
    public ResponseEntity<User> getUsersById(@PathVariable(value = "id") Long id) {
        return new ResponseEntity<>(userService.getUsersById(id), HttpStatus.OK);
    }

    @GetMapping("/user/{id}/roles")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER')")
    public ResponseEntity<List<String>> getRolesOfUser(@PathVariable(value = "id") Long id) {
        return new ResponseEntity<>(userService.getRolesOfUser(id), HttpStatus.OK);
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER')")
    public ResponseEntity<List<User>> getAllUsers() {

        List<User> users = userService.getAllUsers();
        if (users.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/employees")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE') or hasRole('DEV') or hasRole('APPROVER')")
    public ResponseEntity<List<User>> getAllEmployees() {
        List<User> users = userService.getAllEmployees();
        if (users.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping(path = "/user/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody SignupRequest user){
        return new ResponseEntity<>(userService.updateUser(id, user), HttpStatus.OK);
    }
}
