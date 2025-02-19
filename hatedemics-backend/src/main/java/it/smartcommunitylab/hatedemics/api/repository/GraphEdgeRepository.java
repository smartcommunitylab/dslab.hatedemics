package it.smartcommunitylab.hatedemics.api.repository;

import it.smartcommunitylab.hatedemics.api.domain.GraphEdge;
import it.smartcommunitylab.hatedemics.api.domain.GraphEdgeId;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GraphEdgeRepository extends JpaRepository<GraphEdge, GraphEdgeId> {

    Page<GraphEdge> findByLanguage(String language, Pageable pageable);

    List<GraphEdge> findByLanguage(String language);
}

