package it.smartcommunitylab.hatedemics.api.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import it.smartcommunitylab.hatedemics.api.domain.TelegramChannel;
import it.smartcommunitylab.hatedemics.api.domain.TelegramChannelId;

public interface TelegramChannelRepository extends JpaRepository<TelegramChannel, TelegramChannelId> {

    Page<TelegramChannel> findByLanguage(String language, Pageable pageable);

    Page<TelegramChannel> findByLanguageAndIdContainingIgnoreCase(String language, String id, Pageable pageable);

    Page<TelegramChannel> findByLanguageAndLabelContainingIgnoreCase(String language, String label, Pageable pageable); 


}
