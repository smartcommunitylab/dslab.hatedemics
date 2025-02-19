package it.smartcommunitylab.hatedemics.api.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import it.smartcommunitylab.hatedemics.api.domain.Chat;

public interface ChatRepository extends JpaRepository<Chat, String> {

    @Query("SELECT c.id FROM Chat c WHERE c.lang = ?1")
    List<String> findByLang(String language);

}
