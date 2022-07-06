package com.etf.ppis.Service;

import com.etf.ppis.Exceptions.ApiError;
import com.etf.ppis.Exceptions.NotFoundException;
import com.etf.ppis.Model.Change.Change;
import com.etf.ppis.Model.Change.ChangeStatus;
import com.etf.ppis.Model.Users.ERole;
import com.etf.ppis.Model.Users.Role;
import com.etf.ppis.Model.Users.User;
import com.etf.ppis.Payload.request.SignupRequest;
import com.etf.ppis.Repository.RoleRepository;
import com.etf.ppis.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class UserServiceImplementation implements UserService{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public User getUsersById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User with id = " + id + " does not exist!"));
    }

    @Autowired
    PasswordEncoder encoder;

    @Override
    public List<User> getAllUsers() {
        List<User> users = new ArrayList<User>();
        userRepository.findAllByActive(true).forEach(users::add);
        return users;
    }

    @Override
    public List<User> getAllEmployees() {
        List<User> users = userRepository.getAllEmployees().stream()
                .filter(u -> u.getActive().equals(true))
                .collect(Collectors.toList());

        return users;
    }


    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User with id = " + id + " does not exist!"));
        user.setActive(false);
        userRepository.save(user);
        return;
    }

    @Override
    public List<User> getUserByUsernameOrEmail(String username, String email) {
        return userRepository.findByUsernameOrEmail(username,email);
    }

    @Override
    public List<String> getRolesOfUser(Long id) {
        return userRepository.getRolesofUser(id);
    }

    @Override
    public User updateUser(Long id, SignupRequest signUpRequest) {
        User u = userRepository.findById(id).orElseThrow(() -> new NotFoundException("User with id = " + id + " does not exist!"));
        u.setUsername(signUpRequest.getUsername());
        if(!signUpRequest.getPassword().equals("") && !(signUpRequest.getPassword()==null))
        u.setPassword(encoder.encode(signUpRequest.getPassword()));
        u.setFirstName(signUpRequest.getFirstName());
        u.setLastName(signUpRequest.getLastName());
        u.setEmail(signUpRequest.getEmail());
        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();
        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_CLIENT)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "dev":
                        Role modRole = roleRepository.findByName(ERole.ROLE_DEV)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);
                        break;
                    case "sd":
                        Role sdRole = roleRepository.findByName(ERole.ROLE_SERVICE)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(sdRole);
                        break;
                    case "app":
                        Role appRole = roleRepository.findByName(ERole.ROLE_APPROVER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(appRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_CLIENT)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }
        u.setRoles(roles);
        return userRepository.save(u);
    }
}
