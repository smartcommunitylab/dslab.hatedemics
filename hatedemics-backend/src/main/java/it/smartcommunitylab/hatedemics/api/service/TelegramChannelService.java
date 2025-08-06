package it.smartcommunitylab.hatedemics.api.service;

import it.smartcommunitylab.hatedemics.api.domain.TelegramChannel;
import it.smartcommunitylab.hatedemics.api.domain.TelegramChannelId;
import it.smartcommunitylab.hatedemics.api.repository.TelegramChannelRepository;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Service
public class TelegramChannelService {

    @Autowired
    private TelegramChannelRepository telegramChannelRepository;

    public Page<TelegramChannel> findAll(String language, String id, String label, Pageable pageable) {
        if (StringUtils.isNotBlank(id)) {
            return telegramChannelRepository.findByLanguageAndIdContainingIgnoreCase(language, id, pageable);
        } else if (StringUtils.isNotBlank(label)) {
            return telegramChannelRepository.findByLanguageAndLabelContainingIgnoreCase(language, label, pageable);
        } else {
            return telegramChannelRepository.findByLanguage(language, pageable);
        }
    }
    

public Optional<TelegramChannel> findById(String id, String language) {
    TelegramChannelId key = new TelegramChannelId(id, language);
    return telegramChannelRepository.findById(key);
}
}
