package it.smartcommunitylab.hatedemics.api.domain;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "channels")
public class TelegramChannel {
    
    @Id
    private String id;
    private Date date;
    @Column(name = "last_queried_at")
    @JsonProperty("last_queried_at")
    private Date lastQueriedAt;
    private String about;
    private Integer pts;
    private Boolean broadcast;
    @Column(name = "participants_count")
    @JsonProperty("participants_count")
    private Integer participantsCount;
    @JsonProperty("linked_chats_ids")
    @Column(name = "linked_chats_ids")
    private String linkedChatsIds;
    @JsonProperty("distance_from_seed")
    @Column(name = "distance_from_seed")
    private Integer distanceFromSeed;
    private String language;
    @JsonProperty("n_in_recommendation")
    @Column(name = "n_in_recommendation")
    private Integer nInRecommendation;
    @JsonProperty("n_out_recommended")
    @Column(name = "n_out_recommended")
    private Integer nOutRecommended;
    @JsonProperty("participation_score")
    @Column(name = "participation_score")
    private Double participationScore;
    @JsonProperty("message_count")
    @Column(name = "message_count")
    private Integer messageCount;
    @JsonProperty("unknown_domains")
    @Column(name = "unknown_domains")
    private Integer unknownDomains;
    @JsonProperty("known_domains")
    @Column(name = "known_domains")
    private Integer knownDomains;
    private Double IRI, sdIRI, dIRI, unrel;
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
    public Date getLastQueriedAt() {
        return lastQueriedAt;
    }
    public void setLastQueriedAt(Date lastQueriedAt) {
        this.lastQueriedAt = lastQueriedAt;
    }
    public String getAbout() {
        return about;
    }
    public void setAbout(String about) {
        this.about = about;
    }
    public Integer getPts() {
        return pts;
    }
    public void setPts(Integer pts) {
        this.pts = pts;
    }
    public Boolean getBroadcast() {
        return broadcast;
    }
    public void setBroadcast(Boolean broadcast) {
        this.broadcast = broadcast;
    }
    public Integer getParticipantsCount() {
        return participantsCount;
    }
    public void setParticipantsCount(Integer participantsCount) {
        this.participantsCount = participantsCount;
    }
    public String getLinkedChatsIds() {
        return linkedChatsIds;
    }
    public void setLinkedChatsIds(String linkedChatsIds) {
        this.linkedChatsIds = linkedChatsIds;
    }
    public Integer getDistanceFromSeed() {
        return distanceFromSeed;
    }
    public void setDistanceFromSeed(Integer distanceFromSeed) {
        this.distanceFromSeed = distanceFromSeed;
    }
    public String getLanguage() {
        return language;
    }
    public void setLanguage(String language) {
        this.language = language;
    }
    public Integer getnInRecommendation() {
        return nInRecommendation;
    }
    public void setnInRecommendation(Integer nInRecommendation) {
        this.nInRecommendation = nInRecommendation;
    }
    public Integer getnOutRecommended() {
        return nOutRecommended;
    }
    public void setnOutRecommended(Integer nOutRecommended) {
        this.nOutRecommended = nOutRecommended;
    }
    public Double getParticipationScore() {
        return participationScore;
    }
    public void setParticipationScore(Double participationScore) {
        this.participationScore = participationScore;
    }
    public Integer getMessageCount() {
        return messageCount;
    }
    public void setMessageCount(Integer messageCount) {
        this.messageCount = messageCount;
    }
    public Integer getUnknownDomains() {
        return unknownDomains;
    }
    public void setUnknownDomains(Integer unknownDomains) {
        this.unknownDomains = unknownDomains;
    }
    public Integer getKnownDomains() {
        return knownDomains;
    }
    public void setKnownDomains(Integer knownDomains) {
        this.knownDomains = knownDomains;
    }
    public Double getIRI() {
        return IRI;
    }
    public void setIRI(Double iRI) {
        IRI = iRI;
    }
    public Double getSdIRI() {
        return sdIRI;
    }
    public void setSdIRI(Double sdIRI) {
        this.sdIRI = sdIRI;
    }
    public Double getdIRI() {
        return dIRI;
    }
    public void setdIRI(Double dIRI) {
        this.dIRI = dIRI;
    }
    public Double getUnrel() {
        return unrel;
    }
    public void setUnrel(Double unrel) {
        this.unrel = unrel;
    }

    

}
