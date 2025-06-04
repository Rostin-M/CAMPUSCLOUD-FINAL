package CampusCloud.controller;

import CampusCloud.model.Course;
import CampusCloud.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cursos")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/profesor/{profesorId}")
    public List<Course> getCursosByProfesor(@PathVariable Long profesorId) {
        return courseService.findByProfesorId(profesorId);
    }

    @GetMapping
    public List<Course> getAllCursos() {
        return courseService.findAll();
    }
}