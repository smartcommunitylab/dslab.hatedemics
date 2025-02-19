package it.smartcommunitylab.hatedemics.api.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "graph_nodes")
public class GraphNode {

    @Id
    private String channel_id;
    private String iri;
    private Integer channel_int;
    private Double hs;
    private Integer out_degree;
    private Integer in_degree;
    private String language;
    
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
    public Integer getOut_degree() {
        return out_degree;
    }
    public void setOut_degree(Integer out_degree) {
        this.out_degree = out_degree;
    }
    public Integer getIn_degree() {
        return in_degree;
    }
    public void setIn_degree(Integer in_degree) {
        this.in_degree = in_degree;
    }
    public String getLanguage() {
        return language;
    }
    public void setLanguage(String language) {
        this.language = language;
    }


}
