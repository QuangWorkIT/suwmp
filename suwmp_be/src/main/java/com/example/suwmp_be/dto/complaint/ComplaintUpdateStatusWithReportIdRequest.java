package com.example.suwmp_be.dto.complaint;

import com.example.suwmp_be.constants.ComplaintStatus;
import jakarta.validation.constraints.NotNull;

public record ComplaintUpdateStatusWithReportIdRequest(
        @NotNull
        ComplaintStatus status
) { }
