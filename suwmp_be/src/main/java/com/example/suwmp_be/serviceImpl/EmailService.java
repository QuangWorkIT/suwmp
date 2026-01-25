package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.dto.forgot_password.SendLinkResetDto;
import com.example.suwmp_be.service.IEmailService;
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
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class EmailService implements IEmailService {
    private final JavaMailSender mailSender;
    private final OtpService otpService;

    private static final String EMAIL_FROM = "suwmp.hcm@gmail.com";
    private static final String NAME_FROM = "Smart Urban Waste Platform";
    private static final String SEND_OTP_SUBJECT = "Send OTP Verification";

    private static final String ROUTE = "/reset-password?resetToken=";

    @Value("${app.fe-url}")
    private String FE_URL;

    @Async
    @Override
    public void sendLinkReset(SendLinkResetDto sendLinkResetDto) {
        MimeMessage message = mailSender.createMimeMessage();

        try {
            message.setFrom(new InternetAddress(EMAIL_FROM, NAME_FROM));
            message.setRecipients(MimeMessage.RecipientType.TO, sendLinkResetDto.to());
            message.setSubject(EmailService.SEND_OTP_SUBJECT);

            String resetToken = otpService.generateResetToken(sendLinkResetDto.to());
            String url = FE_URL + ROUTE + resetToken;

            // build content
            String html = readFile("html/send-otp.html");
            String content = html.replace("${CustomerName}", sendLinkResetDto.fullName());
            content = content.replace("${LINK_RESET}", url);
            message.setContent(content, "text/html; charset=utf-8");

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    // Read file from resources
    private String readFile(String filePath) throws IOException {
        Resource resource = new ClassPathResource(filePath);

        return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    }
}
