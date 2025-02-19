package it.smartcommunitylab.hatedemics.api.domain;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "graph_edges")
public class GraphEdge {

    @EmbeddedId
    private GraphEdgeId id;

    private String language;
    private String source_iri;
    private String target_iri;
    private Integer source_int;
    private Integer target_int;
    private Double source_hs;
    private Double target_hs;

    public String getLanguage() {
        return language;
    }
    public void setLanguage(String language) {
        this.language = language;
    }
    public String getSource_iri() {
        return source_iri;
    }
    public void setSource_iri(String source_iri) {
        this.source_iri = source_iri;
    }
    public String getTarget_iri() {
        return target_iri;
    }
    public void setTarget_iri(String target_iri) {
        this.target_iri = target_iri;
    }
    public Integer getSource_int() {
        return source_int;
    }
    public void setSource_int(Integer source_int) {
        this.source_int = source_int;
    }
    public Integer getTarget_int() {
        return target_int;
    }
    public void setTarget_int(Integer target_int) {
        this.target_int = target_int;
    }
    public Double getSource_hs() {
        return source_hs;
    }
    public void setSource_hs(Double source_hs) {
        this.source_hs = source_hs;
    }
    public Double getTarget_hs() {
        return target_hs;
    }
    public void setTarget_hs(Double target_hs) {
        this.target_hs = target_hs;
    }

    public GraphEdgeId getId() {
        return id;
    }
    public void setId(GraphEdgeId id) {
        this.id = id;
    }
}
