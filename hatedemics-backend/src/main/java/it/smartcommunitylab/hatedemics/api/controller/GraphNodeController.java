package it.smartcommunitylab.hatedemics.api.controller;

import it.smartcommunitylab.hatedemics.api.domain.GraphNode;
import it.smartcommunitylab.hatedemics.api.service.GraphNodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/network/nodes")
public class GraphNodeController {

    @Autowired
    private GraphNodeService graphNodeService;

    @GetMapping
    public Page<GraphNode> getAllNodes(@RequestParam String language, Pageable pageable) {
        return graphNodeService.findAll(language, pageable);
    }

    @GetMapping("/all")
    public List<GraphNode> getAllNodes(@RequestParam String language) {
        return graphNodeService.findAll(language);
    }

    @GetMapping("/{id}")
    public Optional<GraphNode> getNodeById(@PathVariable String id) {
        return graphNodeService.findById(id);
    }
}
