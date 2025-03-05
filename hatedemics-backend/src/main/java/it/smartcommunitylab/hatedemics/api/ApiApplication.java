package it.smartcommunitylab.hatedemics.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import it.smartcommunitylab.hatedemics.api.domain.User;
import it.smartcommunitylab.hatedemics.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.util.List;


@SpringBootApplication
public class ApiApplication {

    @Autowired
    private UserRepository userRepository;

	@Autowired
    private BCryptPasswordEncoder passwordEncoder;

	@Value("${users.file}")	
	private String usersFile;

    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("*").allowedMethods("*");
            }
        };
    }

    @Bean
    CommandLineRunner runner() {
        return args -> {
            ObjectMapper mapper = new ObjectMapper();

            List<User> users = mapper.readValue(new File(usersFile), new TypeReference<List<User>>() {});
			users.forEach(u -> {
				if (userRepository.findByUsername(u.getUsername()) != null) {
					return;
				}
				u.setPassword(passwordEncoder.encode(u.getPassword()));
				userRepository.save(u);
			});
        };
    }
}
