package com.example.suwmp_be.dto.complaint;

import com.example.suwmp_be.constants.ComplaintStatus;
import lombok.Data;

@Data
public class ComplaintDTO {
    private String description;
    private String status;
    private String citizenName;
    private String photoUrl;
}
