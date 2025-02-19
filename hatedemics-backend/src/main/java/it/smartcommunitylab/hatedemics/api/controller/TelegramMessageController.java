package it.smartcommunitylab.hatedemics.api.controller;

import it.smartcommunitylab.hatedemics.api.domain.TelegramMessage;
import it.smartcommunitylab.hatedemics.api.service.TelegramMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController("MessageController")
@RequestMapping("/api/messages")
public class TelegramMessageController {

    @Autowired
    private TelegramMessageService telegramMessageService;

    @GetMapping("/chat/{chatId}")
    public Page<TelegramMessage> getAllMessages(@PathVariable String chatId, Pageable pageable) {
        return telegramMessageService.findByChatId(chatId, pageable);
    }

}
