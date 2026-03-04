package com.example.suwmp_be.dto.complaint;

import com.example.suwmp_be.constants.ComplaintStatus;
import lombok.Data;

@Data
public class UpdateComplaintStatus {
    private ComplaintStatus status;
}
