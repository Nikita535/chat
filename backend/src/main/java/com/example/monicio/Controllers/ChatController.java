package com.example.monicio.Controllers;

import com.example.monicio.Models.Message;
import com.example.monicio.Repositories.MessageRepository;
import com.example.monicio.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    @Autowired
    MessageRepository messageRepository;

    @Autowired
    UserService userService;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receiveMessage(@Payload Message message){
        if(message.getMessage() != null) {
            message.setDate(LocalDateTime.now());
            messageRepository.save(message);
        }
        return message;
    }

    @MessageMapping("/private-message")
    public Message recMessage(@Payload Message message){
        if(message.getMessage() != null) {
            message.setDate(LocalDateTime.now());
            messageRepository.save(message);
        }
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(),"/private",message);
        return message;
    }

    @GetMapping("/api/chat/messages/public")
    private ResponseEntity<?> publicMessages(){
        return userService.getPublicMessages();
    }

    @GetMapping("/api/chat/messages/private")
    private ResponseEntity<?> privateMessages(){
        return userService.getPrivateMessages();
    }

    @PostMapping("/api/chat/delete/message")
    private ResponseEntity<?> deletePublicMessage(@RequestParam String messageIndex){
       return  userService.deleteMessage(messageIndex);
    }
}
