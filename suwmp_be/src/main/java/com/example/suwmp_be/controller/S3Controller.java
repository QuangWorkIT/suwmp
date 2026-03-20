package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.service.IS3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.io.IOException;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/s3")
public class S3Controller {

    private final IS3Service s3Service;

    @PostMapping("/upload")
    public ResponseEntity<BaseResponse<String>> uploadImg(
            @RequestParam("image") MultipartFile img
    ) throws IOException {

        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "upload img success",
                s3Service.uploadImg(img))
        );
    }

    @GetMapping("/download")
    public ResponseEntity<BaseResponse<String>> downloadImg(
            @RequestParam("key") String key
    ) {
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "downloaded file successfully",
                s3Service.generatePresignedUrl(key))
        );
    }

    @GetMapping("/files/{folder}/{filename}")
    public ResponseEntity<byte[]> getFile(@PathVariable String folder, @PathVariable String filename) throws IOException {
        Path path = Paths.get("uploads", folder, filename);
        if (!Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }
        byte[] image = Files.readAllBytes(path);
        String contentType = Files.probeContentType(path);
        return ResponseEntity.ok()
                .contentType(contentType != null ? MediaType.parseMediaType(contentType) : MediaType.IMAGE_JPEG)
                .body(image);
    }
}
