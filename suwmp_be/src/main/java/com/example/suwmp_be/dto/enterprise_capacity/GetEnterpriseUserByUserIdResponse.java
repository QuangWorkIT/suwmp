package com.example.suwmp_be.dto.enterprise_capacity;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GetEnterpriseUserByUserIdResponse {
    long id;

    long enterpriseId;

    UUID userId;
}
