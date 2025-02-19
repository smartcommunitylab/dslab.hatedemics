package it.smartcommunitylab.hatedemics.api.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.ObjectMapper;

import it.smartcommunitylab.hatedemics.api.domain.Chat;
import it.smartcommunitylab.hatedemics.api.repository.ChatRepository;

@Service
public class ChatService {

    @Value("${data.path}")
    private String dataPath;

    @Autowired
    private ChatRepository chatRepository;

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    private static final ObjectMapper mapper = new ObjectMapper();

    @SuppressWarnings("unchecked")
    public Map<String, Object> getChat(String chatId) {
        Chat chat = chatRepository.findById(chatId).orElse(null);
        if (chat != null) {
            Map<String, Object> data = new HashMap<>();
            try {
                data.putAll(mapper.readValue(new File(dataPath + "/" + chat.getLang() + "/chat_topics/" + chatId + ".json"), Map.class));
            } catch (Exception e) {
                logger.error("Error reading topics", e);
            }
            try {
                data.putAll(mapper.readValue(new File(dataPath + "/" + chat.getLang() + "/chat_infodemics/" + chatId + ".json"), Map.class));
            } catch (Exception e) {
                logger.error("Error reading infodemics", e);
            }
            return data;
        }
        return null;
    }

    public List<String> getChats(String language) {
        return chatRepository.findByLang(language);
    }
}
