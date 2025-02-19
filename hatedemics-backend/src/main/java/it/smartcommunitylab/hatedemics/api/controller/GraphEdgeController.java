package it.smartcommunitylab.hatedemics.api.controller;

import it.smartcommunitylab.hatedemics.api.domain.GraphEdge;
import it.smartcommunitylab.hatedemics.api.domain.GraphEdgeId;
import it.smartcommunitylab.hatedemics.api.service.GraphEdgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/network/edges")
public class GraphEdgeController {

    @Autowired
    private GraphEdgeService graphEdgeService;

    @GetMapping
    public Page<GraphEdge> getAllEdges(@RequestParam String language, Pageable pageable) {
        return graphEdgeService.findAll(language, pageable);
    }

    @GetMapping("/all")
    public List<GraphEdge> getAllEdges(@RequestParam String language) {
        return graphEdgeService.findAll(language);
    }

    @GetMapping("/{id}")
    public Optional<GraphEdge> getEdgeById(@PathVariable GraphEdgeId id) {
        return graphEdgeService.findById(id);
    }
}
