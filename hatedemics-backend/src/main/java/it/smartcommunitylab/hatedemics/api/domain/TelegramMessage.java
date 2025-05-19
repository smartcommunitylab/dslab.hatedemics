package it.smartcommunitylab.hatedemics.api.domain;

import java.util.Date;


import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
@Table(name = "messages",indexes = {
    @Index(name = "idx_channel_id", columnList = "channel_id")
})
public class TelegramMessage {

    @Id
    private String id;

    @JsonProperty("channel_id")
    @Column(name = "channel_id")
    private String channelId;

    private Date date;

    @JsonProperty("fwd_from_date")
    @Column(name = "fwd_from_date")
    private Date fwdFromDate;
    
    @JsonProperty("from_id")
    @Column(name = "from_id")
    private String fromId;

    @JsonProperty("fwd_from_id")
    @Column(name = "fwd_from_id")
    private String fwdFromId;

    @JsonProperty("fwd_from_msg_id")
    @Column(name = "fwd_from_msg_id")
    private String fwdFromMsgId;

    @JsonProperty("replies_to_msg_id")
    @Column(name = "replies_to_msg_id")
    private String repliesToMsgId;

    @JsonProperty("via_bot_id")
    @Column(name = "via_bot_id")
    private String viaBotId;

    @JsonProperty("preprocessed_about")
    @Column(name = "preprocessed_about")
    private String preprocessedAbout;

    @JsonProperty("from_user")
    @Column(name = "from_user")
    private String fromUser;

    @JsonProperty("preprocessed_message")
    @Column(name = "preprocessed_message")
    private String preprocessedMessage;

    private String reactions;

    @JsonProperty("replies_to_msg_text")
    @Column(name = "replies_to_msg_text")
    private String repliesToMsgText;


    @JsonProperty("nr_forwards")
    @Column(name = "nr_forwards")
    private Integer nrForwards;

    @JsonProperty("nr_reactions")
    @Column(name = "nr_reactions")
    private Integer nrReactions;

    @JsonProperty("nr_replies")
    @Column(name = "nr_replies")
    private Integer nrReplies;

    @JsonProperty("nr_views")
    @Column(name = "nr_views")
    private Integer nrViews;

    @JsonProperty("topic_label")
    @Column(name = "topic_label")
    private String topicLabel;

    private Double topic;

    @JsonProperty("hate_label")
    @Column(name = "hate_label")
    private Double hateLabel;

    @JsonProperty("checkworthy_label")
    @Column(name = "checkworthy_label")
    private Double checkworthyLabel;

    @JsonProperty("target")
    @Column(name = "target")
    private String target;

    @JsonProperty("keywords_match")
    @Column(name = "keywords_match")
    private String keywordsMatch;

    @JsonProperty("preprocessed_message_number_media")
    @Column(name = "preprocessed_message_number_media")
    private String preprocessedMessageNumberMedia;

    @JsonProperty("media_type")
    @Column(name = "media_type")
    private String mediaType;  
    
    private String language;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getChannelId() {
        return channelId;
    }

    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Date getFwdFromDate() {
        return fwdFromDate;
    }

    public void setFwdFromDate(Date fwdFromDate) {
        this.fwdFromDate = fwdFromDate;
    }

    public String getFromId() {
        return fromId;
    }

    public void setFromId(String fromId) {
        this.fromId = fromId;
    }

    public String getFwdFromId() {
        return fwdFromId;
    }

    public void setFwdFromId(String fwdFromId) {
        this.fwdFromId = fwdFromId;
    }

    public String getFwdFromMsgId() {
        return fwdFromMsgId;
    }

    public void setFwdFromMsgId(String fwdFromMsgId) {
        this.fwdFromMsgId = fwdFromMsgId;
    }

    public String getRepliesToMsgId() {
        return repliesToMsgId;
    }

    public void setRepliesToMsgId(String repliesToMsgId) {
        this.repliesToMsgId = repliesToMsgId;
    }

    public String getViaBotId() {
        return viaBotId;
    }

    public void setViaBotId(String viaBotId) {
        this.viaBotId = viaBotId;
    }


    public String getPreprocessedMessage() {
        return preprocessedMessage;
    }

    public void setPreprocessedMessage(String preprocessedMessage) {
        this.preprocessedMessage = preprocessedMessage;
    }

    public String getReactions() {
        return reactions;
    }

    public void setReactions(String reactions) {
        this.reactions = reactions;
    }

    public String getRepliesToMsgText() {
        return repliesToMsgText;
    }

    public void setRepliesToMsgText(String repliesToMsgText) {
        this.repliesToMsgText = repliesToMsgText;
    }

    

    public Integer getNrForwards() {
        return nrForwards;
    }

    public void setNrForwards(Integer nrForwards) {
        this.nrForwards = nrForwards;
    }

    public Integer getNrReactions() {
        return nrReactions;
    }

    public void setNrReactions(Integer nrReactions) {
        this.nrReactions = nrReactions;
    }

    public Integer getNrReplies() {
        return nrReplies;
    }

    public void setNrReplies(Integer nrReplies) {
        this.nrReplies = nrReplies;
    }

    public Integer getNrViews() {
        return nrViews;
    }

    public void setNrViews(Integer nrViews) {
        this.nrViews = nrViews;
    }

    public String getTopicLabel() {
        return topicLabel;
    }

    public void setTopicLabel(String topicLabel) {
        this.topicLabel = topicLabel;
    }

    public Double getTopic() {
        return topic;
    }

    public void setTopic(Double topic) {
        this.topic = topic;
    }

    public Double getHateLabel() {
        return hateLabel;
    }

    public void setHateLabel(Double hateLabel) {
        this.hateLabel = hateLabel;
    }

    public Double getCheckworthyLabel() {
        return checkworthyLabel;
    }

    public void setCheckworthyLabel(Double checkworthyLabel) {
        this.checkworthyLabel = checkworthyLabel;
    }

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }
    public String getPreprocessedMessageNumberMedia() {
        return preprocessedMessageNumberMedia;
    }

    public void setPreprocessedMessageNumberMedia(String preprocessedMessageNumberMedia) {
        this.preprocessedMessageNumberMedia = preprocessedMessageNumberMedia;
    }


    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    
}