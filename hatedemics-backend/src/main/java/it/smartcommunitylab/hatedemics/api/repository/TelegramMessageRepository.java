package it.smartcommunitylab.hatedemics.api.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import it.smartcommunitylab.hatedemics.api.domain.TelegramMessage;

public interface TelegramMessageRepository extends JpaRepository<TelegramMessage, String> {

    Page<TelegramMessage> findByLanguage(String language, Pageable pageable);

    @Query("SELECT m FROM TelegramMessage m WHERE m.channelId = ?1")
    Page<TelegramMessage> findByChatId(String chatId, Pageable pageable);

    Page<TelegramMessage> findByChannelIdAndTargetContainingIgnoreCase(String channelId, String target, Pageable pageable);
    Page<TelegramMessage> findByChannelIdAndCheckworthyLabelContainingIgnoreCase(String channelId, String checkworthyLabel, Pageable pageable);
    Page<TelegramMessage> findByChannelIdAndHateLabelContainingIgnoreCase(String channelId, String hateLabel, Pageable pageable);
    Page<TelegramMessage> findByChannelIdAndTopicLabelContainingIgnoreCase(String channelId, String topicLabel, Pageable pageable);

}
