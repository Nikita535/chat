package com.example.monicio.Services;


import com.example.monicio.Models.Media;
import com.example.monicio.Repositories.MediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MediaService {

    @Autowired
    private MediaRepository mediaRepository;

    public Optional<Media> findMediaById(Long id) {
        return mediaRepository.findMediaById(id);
    }
}