package it.smartcommunitylab.hatedemics.api.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "graph_nodes")
public class GraphNode {

    @Id
    private String channel_id;
    private String label;

    private String message_count;

    private String participants_count;

    private String iri;
    private Integer channel_int;
    private Double hs;
    private Double cw;
    private Integer n_out_recommended;
    private Integer n_in_recommendation;
    private String language;
    private Integer louvain_community;
    public Integer getLouvain_community() {
        return louvain_community;
    }
    public void setLouvain_community(Integer louvain_community) {
        this.louvain_community = louvain_community;
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
    public String getIri() {
        return iri;
    }
    public void setIri(String iri) {
        this.iri = iri;
    }
    public String getChannel_id() {
        return channel_id;
    }
    public void setChannel_id(String channel_id) {
        this.channel_id = channel_id;
    }
    public Integer getChannel_int() {
        return channel_int;
    }
    public void setChannel_int(Integer channel_int) {
        this.channel_int = channel_int;
    }
    public Double getHs() {
        return hs;
    }
    public void setHs(Double hs) {
        this.hs = hs;
    }
    public Double getCw() {
        return cw;
    }
    public void setCw(Double cw) {
        this.cw = cw;
    }
    
    public String getLanguage() {
        return language;
    }
    public void setLanguage(String language) {
        this.language = language;
    }

    public String getLabel() {
        return label;
    }
    public void setLabel(String label) {
        this.label = label;
    }
    public String getMessage_count() {
        return message_count;
    }
    public void setMessage_count(String message_count) {
        this.message_count = message_count;
    }
    public String getParticipants_count() {
        return participants_count;
    }
    public void setParticipants_count(String participants_count) {
        this.participants_count = participants_count;
    }
}
