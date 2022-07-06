package com.etf.ppis.Security.services;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public interface UserDetails {
    Collection<? extends GrantedAuthority> getAuthorities();

    String getPassword();

    String getUsername();

    boolean isAccountNonExpired();

    boolean isAccountNonLocked();

    boolean isCredentialsNonExpired();

    boolean isEnabled();
}
