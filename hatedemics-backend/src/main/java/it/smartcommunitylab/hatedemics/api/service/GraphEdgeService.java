package it.smartcommunitylab.hatedemics.api.service;

import it.smartcommunitylab.hatedemics.api.domain.GraphEdge;
import it.smartcommunitylab.hatedemics.api.domain.GraphEdgeId;
import it.smartcommunitylab.hatedemics.api.repository.GraphEdgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Service
public class GraphEdgeService {

    @Autowired
    private GraphEdgeRepository graphEdgeRepository;


    public Page<GraphEdge> findAll( String language, Pageable pageable) {
        return graphEdgeRepository.findByLanguage(language, pageable);
    }

    public List<GraphEdge> findAll( String language) {
        return graphEdgeRepository.findByLanguage(language);
    }

    public Optional<GraphEdge> findById(GraphEdgeId id) {
        return graphEdgeRepository.findById(id);
    }
}
