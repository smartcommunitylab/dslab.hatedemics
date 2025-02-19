package it.smartcommunitylab.hatedemics.api.domain;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "channels")
public class TelegramChannel {
    
    @Id
    private String id;
    private Date date;
    private Date last_queried_at;
    private String about;
    private Integer pts;
    private Boolean broadcast;
    private Integer participants_count;
    private String linked_chats_ids;
    private Integer distance_from_seed;
    private String language;
    private Integer n_in_recommendation;
    private Integer n_out_recommended;
    private Double participation_score;
    private Integer message_count;
    private Integer unknown_domains, known_domains;
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
    public Date getLast_queried_at() {
        return last_queried_at;
    }
    public void setLast_queried_at(Date last_queried_at) {
        this.last_queried_at = last_queried_at;
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
    public Integer getParticipants_count() {
        return participants_count;
    }
    public void setParticipants_count(Integer participants_count) {
        this.participants_count = participants_count;
    }
    public String getLinked_chats_ids() {
        return linked_chats_ids;
    }
    public void setLinked_chats_ids(String linked_chats_ids) {
        this.linked_chats_ids = linked_chats_ids;
    }
    public Integer getDistance_from_seed() {
        return distance_from_seed;
    }
    public void setDistance_from_seed(Integer distance_from_seed) {
        this.distance_from_seed = distance_from_seed;
    }
    public String getLanguage() {
        return language;
    }
    public void setLanguage(String language) {
        this.language = language;
    }
    public Integer getN_in_recommendation() {
        return n_in_recommendation;
    }
    public void setN_in_recommendation(Integer n_in_recommendation) {
        this.n_in_recommendation = n_in_recommendation;
    }
    public Integer getN_out_recommended() {
        return n_out_recommended;
    }
    public void setN_out_recommended(Integer n_out_recommended) {
        this.n_out_recommended = n_out_recommended;
    }
    public Double getParticipation_score() {
        return participation_score;
    }
    public void setParticipation_score(Double participation_score) {
        this.participation_score = participation_score;
    }
    public Integer getMessage_count() {
        return message_count;
    }
    public void setMessage_count(Integer message_count) {
        this.message_count = message_count;
    }
    public Integer getUnknown_domains() {
        return unknown_domains;
    }
    public void setUnknown_domains(Integer unknown_domains) {
        this.unknown_domains = unknown_domains;
    }
    public Integer getKnown_domains() {
        return known_domains;
    }
    public void setKnown_domains(Integer known_domains) {
        this.known_domains = known_domains;
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
