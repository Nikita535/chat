package com.example.monicio.Controllers;

import com.example.monicio.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@Secured({"ROLE_ADMIN"})
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/admin/")
public class AdminController {
    @Autowired
    UserService userService;


    @GetMapping("/users")
    public ResponseEntity<?> allUsers( @RequestParam(defaultValue = "0") Integer pageNumber) {
        return userService.getAllUsers(pageNumber);
    }

    @DeleteMapping ("/delete")
    public ResponseEntity<?> deleteUser(@RequestParam Long id) {
        return userService.deleteUser(id);
    }
}
