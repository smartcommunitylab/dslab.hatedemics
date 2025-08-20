package it.smartcommunitylab.hatedemics.api.repository;

import it.smartcommunitylab.hatedemics.api.domain.LoginAudit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginAuditRepository extends JpaRepository<LoginAudit, Long> {
}
