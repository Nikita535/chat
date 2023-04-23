package com.example.monicio.Controllers;

import com.example.monicio.Models.ActivationToken;
import com.example.monicio.Repositories.ActivationTokenRepository;
import com.example.monicio.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class ActivateController {

    private final ActivationTokenRepository activationTokenRepository;
    private final UserService userService;

    @GetMapping("/activate/{code}")
    public ResponseEntity<?> activate(@PathVariable String code) {
        ActivationToken activationToken = activationTokenRepository.findByToken(code);
        if (activationToken != null && activationToken.compareDate()) {
            userService.activateUser(code);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Location", "localhost:3000/login");
            return new ResponseEntity(headers, HttpStatus.FOUND);
        } else
            return ResponseEntity.ok("Токен не действителен");
    }
}
