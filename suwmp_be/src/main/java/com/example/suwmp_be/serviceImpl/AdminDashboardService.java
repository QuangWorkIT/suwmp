package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ComplaintStatus;
import com.example.suwmp_be.dto.response.*;



import com.example.suwmp_be.repository.ComplaintRepository;
import com.example.suwmp_be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;


    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        
        // "Active Today" proxy: users updated in the last 24 hours
        Instant todayStart = Instant.now().minus(24, ChronoUnit.HOURS);
        long activeToday = userRepository.countByUpdatedAtAfter(todayStart);

        long openComplaints = complaintRepository.countByStatus(ComplaintStatus.OPEN);

        // TODO: Implement real logic for growth metrics and system health once sources are available
        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .userGrowth(null) // unavailable
                .activeToday(activeToday)
                .activeTodayGrowth(null) // unavailable
                .openComplaints(openComplaints)
                .openComplaintsDelta(null) // unavailable
                .systemHealthPercent(null) // unavailable
                .systemHealthStatus("unavailable")
                .build();
    }

    @Transactional(readOnly = true)
    public Page<UserResponse> getPagedUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(user -> UserResponse.builder()
                .id(user.getId().toString())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .status(user.getStatus())
                .createdAt(java.util.Date.from(user.getCreatedAt()))
                .build());
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getRecentOpenComplaints(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return complaintRepository.findAllByStatusOrderByCreatedAtDesc(ComplaintStatus.OPEN, pageable).stream()
                .map(c -> {
                    ComplaintResponse res = new ComplaintResponse();
                    res.setId(c.getId());
                    res.setDescription(c.getDescription());
                    res.setStatus(c.getStatus().name());
                    res.setCitizenName(c.getCitizen().getFullName());
                    res.setCreatedAt(c.getCreatedAt());
                    return res;
                })
                .collect(Collectors.toList());
    }



}
