package it.smartcommunitylab.hatedemics.api.controller;

import it.smartcommunitylab.hatedemics.api.domain.TelegramChannel;
import it.smartcommunitylab.hatedemics.api.service.TelegramChannelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/channels")
public class TelegramChannelController {

    @Autowired
    private TelegramChannelService telegramChannelService;

    @GetMapping
    public Page<TelegramChannel> getAllChannels(@RequestParam String language, Pageable pageable) {
        return telegramChannelService.findAll(language, pageable);
    }

    @GetMapping("/{id}")
    public Optional<TelegramChannel> getChannelById(@PathVariable String id) {
        return telegramChannelService.findById(id);
    }
}
