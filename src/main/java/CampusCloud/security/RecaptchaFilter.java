package CampusCloud.security;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@Component
public class RecaptchaFilter extends OncePerRequestFilter {

    @Value("${recaptcha.secret}")
    private String recaptchaSecret;

    private final RestTemplate restTemplate;

    public RecaptchaFilter(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {
        if ("/login".equals(request.getServletPath()) && "POST".equalsIgnoreCase(request.getMethod())) {
            String recaptchaResponse = request.getParameter("g-recaptcha-response");

            if (recaptchaResponse == null || !verifyRecaptchaToken(recaptchaResponse)) {
                response.sendRedirect("/login?captchaError=1");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean verifyRecaptchaToken(String token) {
        String url = "https://www.google.com/recaptcha/api/siteverify";
        org.springframework.util.MultiValueMap<String, String> params = new org.springframework.util.LinkedMultiValueMap<>();
        params.add("secret", recaptchaSecret);
        params.add("response", token);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<org.springframework.util.MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params,
                headers);

        try {
            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                    url,
                    org.springframework.http.HttpMethod.POST,
                    requestEntity,
                    new ParameterizedTypeReference<Map<String, Object>>() {
                    });
            Map<String, Object> response = responseEntity.getBody();
            return response != null && Boolean.TRUE.equals(response.get("success"));
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
