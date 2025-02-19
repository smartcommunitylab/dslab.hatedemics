package it.smartcommunitylab.hatedemics.api.service;

import it.smartcommunitylab.hatedemics.api.domain.TelegramMessage;
import it.smartcommunitylab.hatedemics.api.repository.TelegramMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Service
public class TelegramMessageService {

    @Autowired
    private TelegramMessageRepository telegramMessageRepository;

    public Page<TelegramMessage> findByChatId(String chatId, Pageable pageable) {
        return telegramMessageRepository.findByChatId(chatId, pageable);
    }

    public Optional<TelegramMessage> findById(String id) {
        return telegramMessageRepository.findById(id);
    }
}
