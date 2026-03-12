package com.example.suwmp_be.dto.complaint;

import com.example.suwmp_be.constants.ComplaintStatus;

public record ComplaintUpdateStatusWithReportIdRequest(
        ComplaintStatus status
) { }
