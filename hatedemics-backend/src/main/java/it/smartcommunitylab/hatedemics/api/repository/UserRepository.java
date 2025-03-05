package it.smartcommunitylab.hatedemics.api.repository;

import it.smartcommunitylab.hatedemics.api.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
    User findByUsername(String username);
}
