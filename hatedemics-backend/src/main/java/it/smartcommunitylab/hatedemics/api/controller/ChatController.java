package it.smartcommunitylab.hatedemics.api.controller;

import it.smartcommunitylab.hatedemics.api.service.ChatService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping()
    public List<String> getChats(@RequestParam String language) {
        return chatService.getChats(language);
    }   

    @GetMapping("/{chatId}")
    public Map<String, Object> getChat(@PathVariable String chatId) {
        return chatService.getChat(chatId);
    }
}
