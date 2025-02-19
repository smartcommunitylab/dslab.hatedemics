package it.smartcommunitylab.hatedemics.api.service;

import it.smartcommunitylab.hatedemics.api.domain.GraphNode;
import it.smartcommunitylab.hatedemics.api.repository.GraphNodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Service
public class GraphNodeService {

    @Autowired
    private GraphNodeRepository graphNodeRepository;

    public Page<GraphNode> findAll(String language, Pageable pageable) {
        return graphNodeRepository.findByLanguage(language, pageable);
    }
    public List<GraphNode> findAll(String language) {
        return graphNodeRepository.findByLanguage(language);
    }

    public Optional<GraphNode> findById(String id) {
        return graphNodeRepository.findById(id);
    }
}
