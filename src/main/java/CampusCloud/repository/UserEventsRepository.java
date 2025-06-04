package CampusCloud.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.Repository;
import CampusCloud.model.UserEvent;
import java.util.List;
import java.util.Map;

public interface UserEventsRepository extends Repository<UserEvent, Long> {
    @Query(value = "SELECT ae.event_id, ae.title, ae.description, ae.event_type, ae.due_date, c.course_id, c.code AS course_code, c.title AS course_title "
            +
            "FROM academic_events ae " +
            "JOIN courses c ON ae.course_id = c.course_id " +
            "JOIN enrollments e ON c.course_id = e.course_id " +
            "WHERE e.user_id = :userId " +
            "ORDER BY ae.due_date", nativeQuery = true)
    List<Map<String, Object>> findEventosByUserId(@Param("userId") Long userId);
}