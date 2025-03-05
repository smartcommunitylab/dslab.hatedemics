package it.smartcommunitylab.hatedemics.api.controller;

import it.smartcommunitylab.hatedemics.api.domain.User;
import it.smartcommunitylab.hatedemics.api.repository.UserRepository;
import it.smartcommunitylab.hatedemics.api.service.JwtService;
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

    @PostMapping("/token")
    public Map<String, String> login(@RequestBody Map<String, String> body) {
        User user = userRepository.findByUsername(body.get("username"));
        if (user != null && passwordEncoder.matches(body.get("password"), user.getPassword())) {
            String token = jwtService.generateToken(user);
            Map<String, String> response = new HashMap<>();
            response.put("access_token", token);
            return response;
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
}
