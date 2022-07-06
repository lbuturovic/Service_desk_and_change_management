package com.etf.ppis.Repository;
import java.util.Optional;

import com.etf.ppis.Model.Users.ERole;
import com.etf.ppis.Model.Users.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}
