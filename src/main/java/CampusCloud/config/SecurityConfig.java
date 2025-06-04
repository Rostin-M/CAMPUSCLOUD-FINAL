package CampusCloud.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import CampusCloud.security.CustomUserDetails;
import CampusCloud.security.RecaptchaFilter;
import CampusCloud.repository.UserRepository;

import java.util.Collection;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserRepository userRepository;

    public SecurityConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public org.springframework.web.client.RestTemplate restTemplate() {
        return new org.springframework.web.client.RestTemplate();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, RecaptchaFilter recaptchaFilter)
            throws Exception {
        http
                .addFilterBefore(recaptchaFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/profesor/**").hasRole("Profesor")
                        .requestMatchers("/estudiante/**").hasRole("Estudiante")
                        .requestMatchers("/admin/**").hasRole("Admin")
                        .requestMatchers("/login", "/css/**", "/js/**", "/images/**", "/prueba/**").permitAll()
                        .requestMatchers("/api/cursos/**").permitAll()
                        .requestMatchers("/api/eventos/**").permitAll()
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**", "/v3/api-docs.yaml")
                        .permitAll()
                        .requestMatchers("/api/profesor/**").hasRole("Profesor")
                        .anyRequest().authenticated())
                .sessionManagement(
                        session -> session.sessionFixation(sessionFixation -> sessionFixation.migrateSession())
                                .enableSessionUrlRewriting(false))
                .formLogin(form -> form
                        .loginPage("/login")
                        .failureUrl("/login?error=true")
                        .successHandler(authenticationSuccessHandler())
                        .permitAll())
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout")
                        .permitAll())
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.sameOrigin()));

        return http.build();
    }

    private AuthenticationSuccessHandler authenticationSuccessHandler() {
        return (request, response, authentication) -> {
            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

            if (authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_Admin"))) {
                response.sendRedirect("/dashboard_admin");
            } else if (authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_Profesor"))) {
                response.sendRedirect("/profesor/dashboard");
            } else if (authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_Estudiante"))) {
                response.sendRedirect("/dashboard_estudiante");
            } else {
                response.sendRedirect("/dashboard");
            }
        };
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return email -> userRepository.findByEmailWithRoles(email)
                .map(CustomUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}