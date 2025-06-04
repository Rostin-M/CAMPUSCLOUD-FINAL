package CampusCloud.service;

import CampusCloud.model.Course;
import CampusCloud.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public List<Course> findByProfesorId(Long profesorId) {
        return courseRepository.findByProfesorId(profesorId);
    }

    public List<Course> findAll() {
        return courseRepository.findAll();
    }
}