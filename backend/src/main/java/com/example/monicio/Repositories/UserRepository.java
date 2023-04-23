package com.example.monicio.Repositories;


import com.example.monicio.Models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @NonNull Page<User> findAll(@NonNull Pageable pageable);
    Optional<User> findByUsername(String userName);
    Optional<User> findUserByEmail(String email);

    Optional<User> deleteUsersById(Long id);
//    Boolean existsByUsername(String userName);
}

