package CampusCloud.repository;

import CampusCloud.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query(value = """
                SELECT
                    u.user_id,
                    u.institutional_id,
                    u.email,
                    u.password,
                    u.first_name,
                    u.last_name,
                    u.created_at,
                    u.updated_at,
                    r.role_name
                FROM users u
                JOIN user_roles ur ON u.user_id = ur.user_id
                JOIN roles r ON ur.role_id = r.role_id
                WHERE u.user_id = :userId
            """, nativeQuery = true)
    List<Object[]> findUserInfoById(@Param("userId") Long userId);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.email = :email")
    Optional<User> findByEmailWithRoles(@Param("email") String email);

    @Query(value = """
                SELECT ae.event_id, ae.course_id, ae.title, ae.description, ae.event_type, ae.due_date, ae.created_by, ae.created_at, ae.start_event, ae.end_event, ae.location
                FROM academic_events ae
                JOIN enrollments e ON ae.course_id = e.course_id
                WHERE e.user_id = :userId
            """, nativeQuery = true)
    List<Object[]> findEventosByUserId(@Param("userId") Long userId);

    Optional<User> findByEmail(String email);

    Optional<User> findByInstitutionalId(String institutionalId);

    @Query(value = """
                SELECT ae.course_id, c.title AS course_title,
                       u_student.first_name AS student_first_name, u_student.last_name AS student_last_name,
                       ae.title AS event_title, s.submitted_at, s.grade
                FROM academic_events ae
                JOIN submissions s ON ae.event_id = s.event_id
                JOIN courses c ON ae.course_id = c.course_id
                JOIN enrollments e_teacher ON c.course_id = e_teacher.course_id AND e_teacher.course_role = 'teacher'
                JOIN users u_teacher ON e_teacher.user_id = u_teacher.user_id
                JOIN users u_student ON s.user_id = u_student.user_id
                WHERE u_teacher.user_id = :profesorId
                ORDER BY ae.course_id, ae.due_date, u_student.last_name, u_student.first_name
            """, nativeQuery = true)
    List<Object[]> findCalificacionesByProfesorId(@Param("profesorId") Long profesorId);

    @Query(value = """
                SELECT a.attendance_id, a.course_id, c.title AS course_title,
                    u_student.first_name AS student_first_name, u_student.last_name AS student_last_name,
                    a.date, a.status
                FROM attendance a
                JOIN courses c ON a.course_id = c.course_id
                JOIN enrollments e_teacher ON c.course_id = e_teacher.course_id AND e_teacher.course_role = 'teacher'
                JOIN users u_teacher ON e_teacher.user_id = u_teacher.user_id
                JOIN users u_student ON a.user_id = u_student.user_id
                WHERE u_teacher.user_id = :profesorId
                ORDER BY a.course_id, a.date, u_student.last_name, u_student.first_name
            """, nativeQuery = true)
    List<Object[]> findAttendanceByProfesorId(@Param("profesorId") Long profesorId);

    @Query(value = """
                SELECT u.user_id, u.first_name, u.last_name, c.course_id, c.title AS course_title
                FROM users u
                JOIN enrollments e ON u.user_id = e.user_id
                JOIN courses c ON e.course_id = c.course_id
                WHERE e.course_role = 'student'
                ORDER BY c.course_id, u.last_name, u.first_name
            """, nativeQuery = true)
    List<Object[]> findEstudiantesPorCurso();
}