package com.example.monicio.Controllers;

import com.example.monicio.Models.Media;
import com.example.monicio.Services.MediaService;
import com.example.monicio.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/media")
public class MediaController {

    @Autowired
    private MediaService mediaService;

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    private ResponseEntity<?> getImageById(@PathVariable Long id) {
        Media image = mediaService.findMediaById(id).orElse(null);
        return ResponseEntity.ok()
                .header("fileName", image.getOriginalFileName())
                .contentType(MediaType.valueOf(image.getMediaType()))
                .contentLength(image.getSize())
                .body(new InputStreamResource(new ByteArrayInputStream(image.getBytes())));
    }


}
