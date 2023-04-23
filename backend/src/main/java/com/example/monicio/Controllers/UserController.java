package com.example.monicio.Controllers;

import com.example.monicio.DTO.UserDTO;
import com.example.monicio.Services.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.validation.Valid;

@RestController
//@PreAuthorize("{hasAuthority('ROLE_USER'),hasAuthority('ROLE_ADMIN')}")
@Secured({"ROLE_ADMIN","ROLE_USER"})
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/user/")
public class UserController {

    @Autowired
    UserService userService;


    @PostMapping("/edit")
    public ResponseEntity<?> editController(@RequestParam(value = "user", required = false) String userDTO,
                                            Authentication authentication,@RequestParam(value = "file", required = false) MultipartFile multipartFile) throws JsonProcessingException {
        return userService.userEdit(userDTO,authentication,multipartFile);
    }
}
