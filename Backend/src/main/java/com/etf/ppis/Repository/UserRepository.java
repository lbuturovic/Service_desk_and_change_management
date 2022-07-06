package com.etf.ppis.Repository;

import com.etf.ppis.Model.Users.ERole;
import com.etf.ppis.Model.Users.Role;
import com.etf.ppis.Model.Users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    @Query(
            value = "SELECT * FROM users u, roles r, user_roles ur" +
                    "  WHERE u.id = ur.user_id and ur.role_id=r.id and r.name!='ROLE_CLIENT'" +
                    "  GROUP BY u.id",
            nativeQuery = true)
    List<User> getAllEmployees();
    @Query(
            value = "SELECT r.name FROM users u, roles r, user_roles ur" +
                    "  WHERE u.id = ?1 and ur.user_id=?1 and r.id = ur.role_id",
            nativeQuery = true)
    List<String> getRolesofUser(Long id);
    List<User> findByUsernameOrEmail(String username, String email);
    List<User> findAllByActive(Boolean b);
}
