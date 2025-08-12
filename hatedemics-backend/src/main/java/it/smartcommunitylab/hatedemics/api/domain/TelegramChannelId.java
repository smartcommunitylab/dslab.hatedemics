package it.smartcommunitylab.hatedemics.api.domain;

import java.io.Serializable;
import java.util.Objects;

public class TelegramChannelId implements Serializable {
    private String id;
    private String language;

    public TelegramChannelId() {}

    public TelegramChannelId(String id, String language) {
        this.id = id;
        this.language = language;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TelegramChannelId that = (TelegramChannelId) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(language, that.language);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, language);
    }
}

