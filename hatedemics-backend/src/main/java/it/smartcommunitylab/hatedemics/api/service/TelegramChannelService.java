package it.smartcommunitylab.hatedemics.api.service;

import it.smartcommunitylab.hatedemics.api.domain.TelegramChannel;
import it.smartcommunitylab.hatedemics.api.repository.TelegramChannelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Service
public class TelegramChannelService {

    @Autowired
    private TelegramChannelRepository telegramChannelRepository;

    public Page<TelegramChannel> findAll(String language, Pageable pageable) {
        return telegramChannelRepository.findByLanguage(language, pageable);
    }

    public Optional<TelegramChannel> findById(String id) {
        return telegramChannelRepository.findById(id);
    }
}
