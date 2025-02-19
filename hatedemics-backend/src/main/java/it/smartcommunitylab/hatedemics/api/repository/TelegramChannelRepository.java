package it.smartcommunitylab.hatedemics.api.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import it.smartcommunitylab.hatedemics.api.domain.TelegramChannel;

public interface TelegramChannelRepository extends JpaRepository<TelegramChannel, String> {

    Page<TelegramChannel> findByLanguage(String language, Pageable pageable);

}
