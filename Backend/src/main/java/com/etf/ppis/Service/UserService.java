package com.etf.ppis.Service;
import com.etf.ppis.Model.Users.Role;
import com.etf.ppis.Model.Users.User;
import com.etf.ppis.Payload.request.SignupRequest;


import java.util.List;

public interface UserService {
    User getUsersById(Long id);
    List<User> getAllUsers();
    void deleteUser(Long id);
    List<User> getAllEmployees();
    List<User> getUserByUsernameOrEmail(String username, String email);
    List<String> getRolesOfUser(Long id);
    User updateUser(Long id, SignupRequest user);
}
