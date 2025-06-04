package CampusCloud.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;

@Controller
public class AdminController {

    @GetMapping("/dashboard_admin")
    public String adminDashboard(Model model) {
        model.addAttribute("rol", "Administrador");
        return "dashboard_admin";
    }
}