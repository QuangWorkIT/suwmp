package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {
    private final S3Client s3Client;
    private final S3Presigner presigner;

    @Value("${aws.bucket.name}")
    private String bucket;

    @Override
    public String uploadImg(MultipartFile file) throws IOException {
        String key = "waste_imgs/" + UUID.randomUUID();

        PutObjectRequest putRequest =PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putRequest,
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        return key;
    }

    // generate img download url
    @Override
    public String generatePresignedUrl(String key) {
        GetObjectRequest getRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        GetObjectPresignRequest getPresignRequest = GetObjectPresignRequest.builder()
                .getObjectRequest(getRequest)
                .signatureDuration(Duration.ofMinutes(15))
                .build();
        return presigner.presignGetObject(getPresignRequest)
                .url()
                .toString();
    }
}
