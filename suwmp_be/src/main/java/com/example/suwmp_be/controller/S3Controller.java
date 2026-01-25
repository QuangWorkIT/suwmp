package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/s3")
public class S3Controller {

    private final S3Service s3Service;

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
}
