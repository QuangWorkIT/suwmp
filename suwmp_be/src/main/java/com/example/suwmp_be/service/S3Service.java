package com.example.suwmp_be.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface S3Service {
    String uploadImg(MultipartFile file) throws IOException;
    String generatePresignedUrl(String key);
}
