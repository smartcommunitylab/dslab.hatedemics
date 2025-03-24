package it.smartcommunitylab.hatedemics.api.controller;

import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.net.URI;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@RestController
@RequestMapping("/api/proxy")
public class ProxyController {

    private static final Logger log = LoggerFactory.getLogger(ProxyController.class);

    @Value("${generation.url}")
    private String generationUrl;

    @Value("${dialog.url}")
    private String dialogUrl;

    @Value("${dialogservice.username}")
    private String username;
    @Value("${dialogservice.password}")
    private String password;

    private static String token;
    private static Long tokenUpdate = 0L;

    @RequestMapping("/gen/**")
    public ResponseEntity<?> generationProxy(HttpServletRequest request) throws IOException {
        return proxy(request, "/api/proxy/gen", generationUrl, null);
    }

    @RequestMapping("/dialog/**")
    public ResponseEntity<?> dialogProxy(HttpServletRequest request) throws IOException {
        log.debug("Proxying request to dialog service");
        Map<String, String> customHeaders = Map.of("Authorization", createToken());
        try {
            return proxy(request, "/api/proxy/dialog", dialogUrl, customHeaders);
        } catch (Exception e) {
            // repeat login
            customHeaders = Map.of("Authorization", createToken());
            return proxy(request, "/api/proxy/dialog", dialogUrl, customHeaders);
        }
    }

    public ResponseEntity<?> proxy(HttpServletRequest request, String prefix, String endpoint,
            Map<String, String> customHeaders) throws IOException {
        String requestUrl = request.getRequestURI().replace(prefix, "");
        log.debug("requestUrl",requestUrl);
        String targetUrl = endpoint + requestUrl + (request.getQueryString() == null ? "" : ("?" + request.getQueryString())); // Change this to the desired target
        log.debug("targetUrl",targetUrl);
        HttpMethod method = HttpMethod.valueOf(request.getMethod());

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        URI uri = URI.create(targetUrl);
        if (HttpMethod.GET.equals(method)) {
            if (customHeaders != null) {
                customHeaders.forEach((k, v) -> {
                    headers.remove(k);
                    headers.add(k, v);
                });
            }
            return restTemplate.exchange(uri, method, new HttpEntity<>(headers), String.class);
        }
        log.debug("headers",headers);
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headers.add(headerName, request.getHeader(headerName));
        }
        if (customHeaders != null) {
            customHeaders.forEach((k, v) -> {
                headers.remove(k);
                headers.add(k, v);
            });
        }
        headers.remove("content-length");
        headers.remove("host");


        if (request instanceof MultipartHttpServletRequest) {
            MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
            Map<String, Object> body = new HashMap<>();
            for (Map.Entry<String, MultipartFile> entry : multipartRequest.getFileMap().entrySet()) {
                body.put(entry.getKey(), entry.getValue().getResource());
            }
            org.springframework.http.HttpEntity<Map<String, Object>> entity = new org.springframework.http.HttpEntity<>(
                    body, headers);
                    log.debug("entity",entity);
            return restTemplate.exchange(uri, method, entity, String.class);
        } else {
            String body = request.getReader().lines().reduce("", (accumulator, actual) -> accumulator + actual);
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(body,
                    headers);
            try {
                return restTemplate.exchange(uri, method, entity, String.class);
            } catch (Exception e) {
                log.warn("Token scaduto, rigenero...");
                login(username, password);
            
                // Creiamo una nuova mappa mutabile se necessario
                Map<String, String> mutableHeaders = new HashMap<>(customHeaders);
                mutableHeaders.put("Authorization", createToken());
            
                HttpEntity<String> retryEntity = new HttpEntity<>(body, headers);
                return restTemplate.exchange(uri, method, retryEntity, String.class);
            }
        }
    }

    private String createToken() {
        if (token == null || tokenUpdate + 1000 * 60 * 60 < System.currentTimeMillis()) {
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

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> map = new LinkedMultiValueMap<String, String>();
        map.add("username", username);
        map.add("password", password);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<MultiValueMap<String, String>>(map, headers);

        @SuppressWarnings({ "unchecked" })
        Map<String, ?> response = restTemplate.postForEntity(url, request, Map.class).getBody();
        token = response.get("access_token").toString();
        tokenUpdate = System.currentTimeMillis();
    }
}
