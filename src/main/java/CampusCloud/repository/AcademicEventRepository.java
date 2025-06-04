package CampusCloud.repository;

import CampusCloud.model.AcademicEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AcademicEventRepository extends JpaRepository<AcademicEvent, Long> {
}