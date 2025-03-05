package it.smartcommunitylab.hatedemics.api.controller;

import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.net.URI;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@RestController
@RequestMapping("/api/proxy")
public class ProxyController {

    @Value("${generation.url}")
    private String generationUrl;

    @Value("${dialog.url}")
    private String dialogUrl;

    @Value("${dialogservice.username}")
    private String username;
    @Value("${dialogservice.password}")
    private String password;

    private static String token;

    @RequestMapping("/gen/**")
    public ResponseEntity<?> generationProxy(HttpServletRequest request) throws IOException {
        return proxy(request, "/api/proxy/gen", generationUrl, null);
    }

    @RequestMapping("/dialog/**")
    public ResponseEntity<?> dialogProxy(HttpServletRequest request) throws IOException {
        Map<String, String> customHeaders = Map.of("Authorization", createToken());
        return proxy(request, "/api/proxy/dialog", dialogUrl, customHeaders);
    }

    public ResponseEntity<?> proxy(HttpServletRequest request, String prefix, String endpoint, Map<String, String> customHeaders) throws IOException {
        String requestUrl = request.getRequestURI().replace(prefix, "");
        String targetUrl = endpoint + requestUrl + "?" + request.getQueryString(); // Change this to the desired target URL

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headers.add(headerName, request.getHeader(headerName));
        }
        if (customHeaders != null) {
            customHeaders.forEach(headers::add);
        }
        headers.remove("content-length");
        headers.remove("host");

        HttpMethod method = HttpMethod.valueOf(request.getMethod());
        URI uri = URI.create(targetUrl);

        if (request instanceof MultipartHttpServletRequest) {
            MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
            Map<String, Object> body = new HashMap<>();
            for (Map.Entry<String, MultipartFile> entry : multipartRequest.getFileMap().entrySet()) {
                body.put(entry.getKey(), entry.getValue().getResource());
            }
            org.springframework.http.HttpEntity<Map<String, Object>> entity = new org.springframework.http.HttpEntity<>(body, headers);
            return restTemplate.exchange(uri, method, entity, String.class);
        } else {
            String body = request.getReader().lines().reduce("", (accumulator, actual) -> accumulator + actual);
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(body, headers);
            return restTemplate.exchange(uri, method, entity, String.class);
        }
    }

    private String createToken() {
        if (token == null) {
            login(username, password);
        }
        return "Bearer " + token;
    }

    private void login(String username, String password) {
        RestTemplate restTemplate = new RestTemplate();
        String url = dialogUrl + "/token";
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("username", username);
        requestBody.put("password", password);
        @SuppressWarnings({ "unchecked" })
        Map<String,?> response = restTemplate.postForEntity(url, requestBody, Map.class).getBody();
        token = response.get("access_token").toString();
    }
}
