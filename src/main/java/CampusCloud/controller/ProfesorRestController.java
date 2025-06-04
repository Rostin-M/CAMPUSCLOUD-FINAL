package CampusCloud.controller;

import CampusCloud.model.User;
import CampusCloud.model.AcademicEvent;
import CampusCloud.model.Role;
import CampusCloud.repository.AcademicEventRepository;
import CampusCloud.repository.CourseRepository;
import CampusCloud.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import CampusCloud.model.Attendance;
import CampusCloud.repository.AttendanceRepository;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/profesor")
public class ProfesorRestController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private AcademicEventRepository academicEventRepository;
    @Autowired
    private AttendanceRepository attendanceRepository;

    @GetMapping("/info")
    public Map<String, Object> getProfesorInfo(Principal principal) {
        Map<String, Object> data = new HashMap<>();
        if (principal == null) {
            data.put("nombre", "Desconocido");
            data.put("rol", "Desconocido");
            return data;
        }
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            data.put("nombre", "Desconocido");
            data.put("rol", "Desconocido");
            return data;
        }
        data.put("nombre", user.getFirstName() + " " + user.getLastName());
        String roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.joining(", "));
        data.put("rol", roles);
        return data;
    }

    @GetMapping("/estadisticas")
    public Map<String, Object> getEstadisticasDashboard(@RequestParam Long profesorId) {
        return courseRepository.getDashboardStatsByProfesorId(profesorId);
    }

    @GetMapping("/eventos")
    public List<Map<String, Object>> getEventosDelProfesor(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Long userId = user.getId();
        List<Object[]> rows = userRepository.findEventosByUserId(userId);
        List<Map<String, Object>> eventos = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> evento = new HashMap<>();
            evento.put("event_id", row[0]);
            evento.put("course_id", row[1]);
            evento.put("title", row[2]);
            evento.put("description", row[3]);
            evento.put("event_type", row[4]);
            evento.put("due_date", row[5]);
            evento.put("created_by", row[6]);
            evento.put("created_at", row[7]);
            evento.put("start_event", row[8]);
            evento.put("end_event", row[9]);
            evento.put("location", row[10]);
            eventos.add(evento);
        }
        return eventos;
    }

    @PostMapping("/eventos")
    public ResponseEntity<?> crearEvento(@RequestBody Map<String, Object> evento, Principal principal) {

        User user = userRepository.findByEmail(principal.getName()).orElseThrow();

        AcademicEvent newEvent = new AcademicEvent();
        newEvent.setCourseId(Long.valueOf(evento.get("course_id").toString()));
        newEvent.setTitle(evento.get("title").toString());
        newEvent.setDescription(evento.get("description").toString());
        newEvent.setEventType(evento.get("event_type").toString());
        newEvent.setDueDate(LocalDateTime.parse(evento.get("due_date").toString()));
        newEvent.setCreatedBy(user.getId());
        newEvent.setCreatedAt(LocalDateTime.now());
        newEvent.setStartEvent(evento.get("start_event") != null ? evento.get("start_event").toString() : null);
        newEvent.setEndEvent(evento.get("end_event") != null ? evento.get("end_event").toString() : null);
        newEvent.setLocation(evento.get("location").toString());

        academicEventRepository.save(newEvent);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/calificaciones")
    public List<Map<String, Object>> getCalificaciones(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Long userId = user.getId();
        List<Object[]> rows = userRepository.findCalificacionesByProfesorId(userId);
        List<Map<String, Object>> calificaciones = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> calificacion = new HashMap<>();
            calificacion.put("course_id", row[0]);
            calificacion.put("course_title", row[1]);
            calificacion.put("student_first_name", row[2]);
            calificacion.put("student_last_name", row[3]);
            calificacion.put("event_title", row[4]);
            calificacion.put("submitted_at", row[5]);
            calificacion.put("grade", row[6]);
            calificaciones.add(calificacion);
        }
        return calificaciones;
    }

    @GetMapping("/asistencias")
    public List<Map<String, Object>> getAsistencias(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Long userId = user.getId();
        List<Object[]> rows = userRepository.findAttendanceByProfesorId(userId);
        List<Map<String, Object>> asistencias = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> asistencia = new HashMap<>();
            asistencia.put("attendance_id", row[0]);
            asistencia.put("course_id", row[1]);
            asistencia.put("course_title", row[2]);
            asistencia.put("student_first_name", row[3]);
            asistencia.put("student_last_name", row[4]);
            asistencia.put("date", row[5]);
            asistencia.put("status", row[6]);
            asistencias.add(asistencia);
        }
        return asistencias;
    }

    @GetMapping("/estudiantes-por-curso")
    public List<Map<String, Object>> getEstudiantesPorCurso() {
        List<Object[]> rows = userRepository.findEstudiantesPorCurso();
        List<Map<String, Object>> estudiantes = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> estudiante = new HashMap<>();
            estudiante.put("user_id", row[0]);
            estudiante.put("first_name", row[1]);
            estudiante.put("last_name", row[2]);
            estudiante.put("course_id", row[3]);
            estudiante.put("course_title", row[4]);
            estudiantes.add(estudiante);
        }
        return estudiantes;
    }

    @PostMapping("/asistencias")
    public ResponseEntity<?> guardarAsistencia(@RequestBody List<Map<String, Object>> asistencias) {
        for (Map<String, Object> asistencia : asistencias) {
            Long courseId = Long.valueOf(asistencia.get("course_id").toString());
            Long userId = Long.valueOf(asistencia.get("user_id").toString());
            String dateStr = asistencia.get("date").toString();
            String status = asistencia.get("status").toString();

            Attendance att = new Attendance();
            att.setCourseId(courseId);
            att.setUserId(userId);
            att.setDate(LocalDate.parse(dateStr));
            att.setStatus(status);

            attendanceRepository.save(att);
        }
        return ResponseEntity.ok().build();
    }

}