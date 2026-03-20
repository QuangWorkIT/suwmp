package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.service.IS3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.http.ContentStreamProvider;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.Duration;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3ServiceImpl implements IS3Service {
    private final S3Client s3Client;
    private final S3Presigner presigner;

    @Value("${aws.bucket.name}")
    private String bucket;

    @Value("${storage.mode:aws}")
    private String storageMode;

    @Value("${backend.public-origin:http://localhost:8080}")
    private String publicOrigin;

    @Override
    public String uploadImg(MultipartFile file) throws IOException {
        String key = "waste_imgs/" + UUID.randomUUID();

        PutObjectRequest putRequest =PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(file.getContentType())
                .build();

        // Provide a fresh stream for each SDK read/retry attempt.
        ContentStreamProvider streamProvider = () -> {
            try {
                return file.getInputStream();
            } catch (IOException e) {
                throw new UncheckedIOException("Cannot read upload file stream", e);
            }
        };

        if ("local".equalsIgnoreCase(storageMode)) {
            try {
                java.nio.file.Path baseDir = java.nio.file.Paths.get("uploads").toAbsolutePath().normalize();
                java.nio.file.Path destPath = baseDir.resolve(key).normalize();
                
                if (!destPath.startsWith(baseDir)) {
                    throw new IOException("Invalid file path: " + key);
                }

                java.io.File uploadDir = destPath.toFile().getParentFile();
                if (!uploadDir.exists() && !uploadDir.mkdirs()) {
                    System.err.println("Failed to create directories: " + uploadDir.getAbsolutePath());
                }
                
                java.nio.file.Files.copy(file.getInputStream(), destPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                
                System.out.println("Storage mode LOCAL: saved file to: " + destPath.toAbsolutePath());
                return key;
            } catch (Exception e) {
                System.err.println("Error during local upload: " + e.getMessage());
                e.printStackTrace();
                throw new IOException("Failed to save file locally", e);
            }
        }

        s3Client.putObject(putRequest,
                RequestBody.fromContentProvider(streamProvider, file.getSize(), Objects.requireNonNull(file.getContentType())));
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
        if ("local".equalsIgnoreCase(storageMode)) {
            // Return a local URL that our controller can serve
            return publicOrigin + "/api/s3/files/" + key;
        }

        return presigner.presignGetObject(getPresignRequest)
                .url()
                .toString();
    }
}
