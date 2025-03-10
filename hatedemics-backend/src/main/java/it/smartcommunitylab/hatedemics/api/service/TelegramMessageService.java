package it.smartcommunitylab.hatedemics.api.service;

import it.smartcommunitylab.hatedemics.api.domain.TelegramMessage;
import it.smartcommunitylab.hatedemics.api.repository.TelegramMessageRepository;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Service
public class TelegramMessageService {

    @Autowired
    private TelegramMessageRepository telegramMessageRepository;

    public Page<TelegramMessage> findByChatId(String chatId, String target, String checkworthy, String hate, String topic, Pageable pageable) {
        if(StringUtils.isNotBlank(target)) {
            return telegramMessageRepository.findByChannelIdAndTargetContainingIgnoreCase(chatId, target, pageable);
        } else if(StringUtils.isNotBlank(checkworthy)) {
            return telegramMessageRepository.findByChannelIdAndCheckworthyLabelContainingIgnoreCase(chatId, checkworthy, pageable);
        } else if(StringUtils.isNotBlank(hate)) {
            return telegramMessageRepository.findByChannelIdAndHateLabelContainingIgnoreCase(chatId, hate, pageable);
        } else if(StringUtils.isNotBlank(topic)) {
            return telegramMessageRepository.findByChannelIdAndTopicLabelContainingIgnoreCase(chatId, topic, pageable);
        }
        return telegramMessageRepository.findByChatId(chatId, pageable);
    }

    public Optional<TelegramMessage> findById(String id) {
        return telegramMessageRepository.findById(id);
    }
}
