package com.example.monicio.Repositories;


import com.example.monicio.Models.ActivationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivationTokenRepository extends JpaRepository<ActivationToken,Integer> {

    ActivationToken findByToken(String token);

    void deleteByToken(String token);
}