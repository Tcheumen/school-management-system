package com.school.management.shared.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.http.HttpMethod;

import com.school.management.shared.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            UserDetailsService userDetailsService) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        return http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())

                .sessionManagement(session -> session.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        // =========================
                        // PUBLIC
                        // =========================
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login",
                                "/error")
                        .permitAll()

                        .requestMatchers(
                                "/api/auth/me")
                        .authenticated()

                        // =========================
                        // STUDENT SPECIFIC
                        // IMPORTANT: before /**
                        // =========================

                        .requestMatchers(
                                "/api/attendances/me")
                        .hasRole("STUDENT")

                        .requestMatchers(
                                "/api/grades/me")
                        .hasRole("STUDENT")

                        .requestMatchers(
                                "/api/class-schedules/me")
                        .hasRole("STUDENT")

                        .requestMatchers(
                                "/api/report-cards/me")
                        .hasRole("STUDENT")

                        // =========================
                        // TEACHER SPECIFIC
                        // IMPORTANT: before /**
                        // =========================

                        .requestMatchers(
                                "/api/teacher-assignments/me")
                        .hasRole("TEACHER")
                        .requestMatchers("/api/attendances/teacher/me")
                        .hasRole("TEACHER")

                        .requestMatchers(
                                "/api/class-schedules/teacher/me")
                        .hasRole("TEACHER")
                        
                        .requestMatchers(
                                "/api/enrollments/teacher/me")
                                        .hasRole("TEACHER")
                        .requestMatchers("/api/grades/teacher/me").hasRole("TEACHER")


                        // =========================
                        // ADMIN ONLY
                        // =========================

                        .requestMatchers(
                                "/api/academic-years/**")
                        .hasRole("ADMIN")

                        .requestMatchers(
                                "/api/classrooms/**")
                        .hasRole("ADMIN")

                        .requestMatchers(
                                "/api/students/**")
                        .hasRole("ADMIN")

                        .requestMatchers(
                                "/api/teachers/**")
                        .hasRole("ADMIN")

                        .requestMatchers(
                                "/api/enrollments/**")
                        .hasRole("ADMIN")

                        .requestMatchers(
                                "/api/subjects/**")
                        .hasRole("ADMIN")

                        .requestMatchers(
                                "/api/teacher-assignments/**")
                        .hasRole("ADMIN")

                        .requestMatchers(
                                "/api/class-schedules/**")
                                        .hasRole("ADMIN")
                        
                       .requestMatchers("/api/enrollments/**").hasRole("ADMIN")
                        
                       

                        // =========================
                        // ADMIN + TEACHER
                        // =========================

                        .requestMatchers(
                                "/api/attendances/**")
                        .hasAnyRole(
                                "ADMIN",
                                "TEACHER")

                        .requestMatchers(
                                "/api/grades/**")
                        .hasAnyRole(
                                "ADMIN",
                                "TEACHER")

                        // =========================
                        // REPORT CARDS
                        // =========================

                        .requestMatchers(
                                "/api/report-cards/**")
                        .hasAnyRole(
                                "ADMIN",
                                "TEACHER")
                                

                        // =========================
                        // FALLBACK
                        // =========================

                        .anyRequest()
                        .authenticated())

                .authenticationProvider(
                        authenticationProvider())

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class)

                .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(
                userDetailsService);

        provider.setPasswordEncoder(
                passwordEncoder());

        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(
                List.of(
                        "http://localhost:4200"));

        config.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"));

        config.setAllowedHeaders(
                List.of("*"));

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                config);

        return source;
    }
}