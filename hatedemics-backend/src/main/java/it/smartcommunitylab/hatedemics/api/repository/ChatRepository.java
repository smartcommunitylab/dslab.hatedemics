package it.smartcommunitylab.hatedemics.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import it.smartcommunitylab.hatedemics.api.domain.Chat;

public interface ChatRepository extends JpaRepository<Chat, String> {

}
