package it.smartcommunitylab.hatedemics.api.controller;

import it.smartcommunitylab.hatedemics.api.domain.LoginAudit;
import it.smartcommunitylab.hatedemics.api.domain.User;
import it.smartcommunitylab.hatedemics.api.repository.LoginAuditRepository;
import it.smartcommunitylab.hatedemics.api.repository.UserRepository;
import it.smartcommunitylab.hatedemics.api.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private LoginAuditRepository loginAuditRepository;

    @PostMapping("/token")
    public Map<String, String> login(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String username = body.get("username");
        String password = body.get("password");
        String ip = request.getRemoteAddr();

        User user = userRepository.findByUsername(username);

        boolean success = user != null && passwordEncoder.matches(password, user.getPassword());

        // Salvo l'audit
        loginAuditRepository.save(new LoginAudit(username, success, ip));

        if (success) {
            String token = jwtService.generateToken(user);
            Map<String, String> response = new HashMap<>();
            response.put("access_token", token);
            return response;
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
}
