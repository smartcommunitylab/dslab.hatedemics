package it.smartcommunitylab.hatedemics.api.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_audit")
public class LoginAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
     private String username;
     private String ipAddress;
     private LocalDateTime timestamp;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    private boolean success;

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }


    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }


    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public LoginAudit() {
    }

    public LoginAudit(String username, boolean success, String ipAddress) {
        this.username = username;
        this.success = success;
        this.ipAddress = ipAddress;
        this.timestamp = LocalDateTime.now();
    }

}
