package CampusCloud.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;

@Controller
public class EstudianteController {

    @GetMapping("/dashboard_estudiante")
    public String estudianteDashboard(Model model) {
        model.addAttribute("rol", "Estudiante");
        return "dashboard_estudiante";
    }
}
