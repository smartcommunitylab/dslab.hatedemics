package it.smartcommunitylab.hatedemics.api.repository;

import it.smartcommunitylab.hatedemics.api.domain.GraphNode;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GraphNodeRepository extends JpaRepository<GraphNode, String> {

    Page<GraphNode> findByLanguage(String language, Pageable pageable);

    List<GraphNode> findByLanguage(String language);
}
