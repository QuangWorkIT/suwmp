package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.forgot_password.SendLinkResetDto;

public interface IEmailService {
    void sendLinkReset(SendLinkResetDto sendLinkResetDto);
}
