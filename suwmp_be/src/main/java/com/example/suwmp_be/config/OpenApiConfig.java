package com.example.suwmp_be.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        Info info = new Info();
        info.setTitle("SUWMP API");
        info.setVersion("1.0.0");
        info.setDescription("Smart Urban Waste Management Platform API - " +
                "A platform connecting citizens, recycling enterprises, and waste collection services by area.");
        
        Contact contact = new Contact();
        contact.setName("SUWMP Team");
        contact.setEmail("support@suwmp.com");
        info.setContact(contact);
        
        License license = new License();
        license.setName("Apache 2.0");
        license.setUrl("https://www.apache.org/licenses/LICENSE-2.0.html");
        info.setLicense(license);
        
        return new OpenAPI().info(info);
    }
}

