package it.smartcommunitylab.hatedemics.api.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import it.smartcommunitylab.hatedemics.api.domain.TelegramMessage;

public interface TelegramMessageRepository extends JpaRepository<TelegramMessage, String> {

    Page<TelegramMessage> findByLanguage(String language, Pageable pageable);

    @Query("SELECT m FROM TelegramMessage m WHERE m.channel_id = ?1")
    Page<TelegramMessage> findByChatId(String chatId, Pageable pageable);

}
