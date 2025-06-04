package CampusCloud.repository;

import CampusCloud.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Map;

public interface CourseRepository extends JpaRepository<Course, Long> {

    @Query(value = "SELECT c.* FROM courses c JOIN enrollments e ON c.course_id = e.course_id WHERE e.user_id = :profesorId AND e.course_role = 'teacher'", nativeQuery = true)
    List<Course> findByProfesorId(Long profesorId);

    @Query(value = """
            SELECT
                u.user_id as userId,
                COUNT(DISTINCT e.course_id) AS activeCourses,
                COUNT(DISTINCT s.user_id) AS totalStudents,
                COALESCE(AVG(CASE WHEN a.status = 'present' THEN 100.0 ELSE 0.0 END),0) AS attendancePercentage
            FROM
                users u
                JOIN enrollments e ON u.user_id = e.user_id AND e.course_role = 'teacher'
                JOIN courses c ON e.course_id = c.course_id
                LEFT JOIN enrollments s ON c.course_id = s.course_id AND s.course_role = 'student'
                LEFT JOIN attendance a ON c.course_id = a.course_id
            WHERE
                u.user_id = :profesorId
            GROUP BY
                u.user_id
            """, nativeQuery = true)
    Map<String, Object> getDashboardStatsByProfesorId(@Param("profesorId") Long profesorId);

}