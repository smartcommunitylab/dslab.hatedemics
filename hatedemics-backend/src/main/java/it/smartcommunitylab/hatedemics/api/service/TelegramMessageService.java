package it.smartcommunitylab.hatedemics.api.service;

import it.smartcommunitylab.hatedemics.api.domain.TelegramMessage;
import it.smartcommunitylab.hatedemics.api.repository.TelegramMessageRepository;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Service
public class TelegramMessageService {

    @Autowired
    private TelegramMessageRepository telegramMessageRepository;

    public Page<TelegramMessage> findByChatId(String chatId, String target, Double checkworthy, Double hate, String topic, Pageable pageable) {
        TelegramMessage msg = new TelegramMessage();
        msg.setChannelId(chatId);
        ExampleMatcher matcher = ExampleMatcher.matching()
        .withMatcher("channelId", match -> match.exact());
        if (StringUtils.isNotBlank(target)) {
            msg.setTarget(target);
            matcher = matcher.withMatcher("target", match -> match.contains().ignoreCase());
        } 
        if (checkworthy != null) { // Rimosso "else if"
            msg.setCheckworthyLabel(checkworthy);
            matcher = matcher.withMatcher("checkworthyLabel", match -> match.exact());
        } 
        if (hate != null) { // Rimosso "else if"
            msg.setHateLabel(hate);
            matcher = matcher.withMatcher("hateLabel", match -> match.exact());
        } 
        if (StringUtils.isNotBlank(topic)) { // Rimosso "else if"
            msg.setTopicLabel(topic);
            matcher = matcher.withMatcher("topicLabel", match -> match.contains().ignoreCase());
        }
        Example<TelegramMessage> example = Example.of(msg, matcher);
        return telegramMessageRepository.findAll(example, pageable);
    }

    public Optional<TelegramMessage> findById(String id) {
        return telegramMessageRepository.findById(id);
    }
}
