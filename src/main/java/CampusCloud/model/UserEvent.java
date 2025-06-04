package CampusCloud.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "academic_events")
public class UserEvent {
    @Id
    private Long event_id;
}