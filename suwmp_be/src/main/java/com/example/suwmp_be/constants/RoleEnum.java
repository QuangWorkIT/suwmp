package com.example.suwmp_be.constants;

import java.util.Arrays;

public enum RoleEnum {

    CITIZEN(1),
    ENTERPRISE(2),
    COLLECTOR(3),
    ADMIN(4),
    GUEST(5);

    private final int id;

    RoleEnum(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public static RoleEnum fromId(int id) {
        return Arrays.stream(values())
                .filter(r -> r.id == id)
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException("Unknown role id: " + id)
                );
    }
}
