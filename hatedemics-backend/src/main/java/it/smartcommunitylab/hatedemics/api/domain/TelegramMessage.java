package it.smartcommunitylab.hatedemics.api.domain;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "messages")
public class TelegramMessage {

    @Id
    private String id;

    private String channel_id;
    private Date date, fwd_from_date;
    
    private String from_id, fwd_from_id, fwd_from_msg_id, replies_to_msg_id, via_bot_id;
    private String message, preprocessed_message, reactions, replies_to_msg_text, text_mentions, text_urls;

    private Integer nr_forwards, nr_reactions, nr_replies, nr_views;


    private String media_type;  
    
    private String language;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Date getFwd_from_date() {
        return fwd_from_date;
    }

    public void setFwd_from_date(Date fwd_from_date) {
        this.fwd_from_date = fwd_from_date;
    }

    public String getFrom_id() {
        return from_id;
    }

    public void setFrom_id(String from_id) {
        this.from_id = from_id;
    }

    public String getFwd_from_id() {
        return fwd_from_id;
    }

    public void setFwd_from_id(String fwd_from_id) {
        this.fwd_from_id = fwd_from_id;
    }

    public String getFwd_from_msg_id() {
        return fwd_from_msg_id;
    }

    public void setFwd_from_msg_id(String fwd_from_msg_id) {
        this.fwd_from_msg_id = fwd_from_msg_id;
    }

    public String getReplies_to_msg_id() {
        return replies_to_msg_id;
    }

    public void setReplies_to_msg_id(String replies_to_msg_id) {
        this.replies_to_msg_id = replies_to_msg_id;
    }

    public String getVia_bot_id() {
        return via_bot_id;
    }

    public void setVia_bot_id(String via_bot_id) {
        this.via_bot_id = via_bot_id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPreprocessed_message() {
        return preprocessed_message;
    }

    public void setPreprocessed_message(String preprocessed_message) {
        this.preprocessed_message = preprocessed_message;
    }

    public String getReactions() {
        return reactions;
    }

    public void setReactions(String reactions) {
        this.reactions = reactions;
    }

    public String getReplies_to_msg_text() {
        return replies_to_msg_text;
    }

    public void setReplies_to_msg_text(String replies_to_msg_text) {
        this.replies_to_msg_text = replies_to_msg_text;
    }

    public String getText_mentions() {
        return text_mentions;
    }

    public void setText_mentions(String text_mentions) {
        this.text_mentions = text_mentions;
    }

    public String getText_urls() {
        return text_urls;
    }

    public void setText_urls(String text_urls) {
        this.text_urls = text_urls;
    }

    public Integer getNr_forwards() {
        return nr_forwards;
    }

    public void setNr_forwards(Integer nr_forwards) {
        this.nr_forwards = nr_forwards;
    }

    public Integer getNr_reactions() {
        return nr_reactions;
    }

    public void setNr_reactions(Integer nr_reactions) {
        this.nr_reactions = nr_reactions;
    }

    public Integer getNr_replies() {
        return nr_replies;
    }

    public void setNr_replies(Integer nr_replies) {
        this.nr_replies = nr_replies;
    }

    public Integer getNr_views() {
        return nr_views;
    }

    public void setNr_views(Integer nr_views) {
        this.nr_views = nr_views;
    }

    public String getMedia_type() {
        return media_type;
    }

    public void setMedia_type(String media_type) {
        this.media_type = media_type;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getChannel_id() {
        return channel_id;
    }

    public void setChannel_id(String channel_id) {
        this.channel_id = channel_id;
    }

}