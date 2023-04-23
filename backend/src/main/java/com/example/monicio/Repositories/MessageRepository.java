package com.example.monicio.Repositories;

import com.example.monicio.Models.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {}
