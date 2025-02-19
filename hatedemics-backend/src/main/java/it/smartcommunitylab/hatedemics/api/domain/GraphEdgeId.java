package it.smartcommunitylab.hatedemics.api.domain;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class GraphEdgeId implements Serializable {

    private String source_id;
    private String target_id;

    // Default constructor
    public GraphEdgeId() {}

    // Parameterized constructor
    public GraphEdgeId(String source_id, String target_id) {
        this.source_id = source_id;
        this.target_id = target_id;
    }

    // Getters and setters
    public String getSource_id() {
        return source_id;
    }
    public void setSource_id(String source_id) {
        this.source_id = source_id;
    }
    public String getTarget_id() {
        return target_id;
    }
    public void setTarget_id(String target_id) {
        this.target_id = target_id;
    }

    // Override equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GraphEdgeId that = (GraphEdgeId) o;
        return Objects.equals(source_id, that.source_id) && Objects.equals(target_id, that.target_id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(source_id, target_id);
    }
}
