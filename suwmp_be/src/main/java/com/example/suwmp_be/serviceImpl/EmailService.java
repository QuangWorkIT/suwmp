package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.dto.email.SendLinkResetDto;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    private static final String EMAIL_FROM = "suwmp.hcm@gmail.com";
    private static final String NAME_FROM = "Smart Urban Waste Platform";

    private static final String SEND_LINK_RESET_SUBJECT = "Send Link Reset Password";

    private static final String ROUTE = "/reset-password?resetToken=";

    @Value("${allowed.origin}")
    private String FE_URLS;

    @Async
    public void sendLinkReset(SendLinkResetDto sendLinkResetDto) {
        MimeMessage message = mailSender.createMimeMessage();

        try {
            message.setFrom(new InternetAddress(EMAIL_FROM, NAME_FROM));
            message.setRecipients(MimeMessage.RecipientType.TO, sendLinkResetDto.to());
            message.setSubject(EmailService.SEND_LINK_RESET_SUBJECT);

            String feUrl = FE_URLS.split(",")[0];
            String url = feUrl + ROUTE + sendLinkResetDto.resetToken();

            // build content
            String html = readFile("html/send-reset-password.html");
            String content = html.replace("${CustomerName}", sendLinkResetDto.fullName());
            content = content.replace("${LINK_RESET}", url);
            message.setContent(content, "text/html; charset=utf-8");

            mailSender.send(message);
        } catch (MessagingException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    // Read file from resources
    private String readFile(String filePath) throws IOException {
        Resource resource = new ClassPathResource(filePath);

        try (InputStream in = resource.getInputStream()) {
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        }
    }
}
