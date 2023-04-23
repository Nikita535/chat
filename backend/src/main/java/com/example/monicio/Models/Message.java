package com.example.monicio.Models;


import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table
@Entity
public class Message {
    @Id
    @Column( nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;


    private String senderName;


    private String receiverName;

    private String message;

    private LocalDateTime date;
    private Status status;
}
