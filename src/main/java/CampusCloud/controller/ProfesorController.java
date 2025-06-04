package CampusCloud.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.security.Principal;
import java.util.stream.Collectors;
import CampusCloud.model.User;
import CampusCloud.repository.UserRepository;

@Controller
public class ProfesorController {

    private final UserRepository userRepository;

    public ProfesorController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/profesor/cursos")
    public String mostrarCursos(Model model, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user != null) {
            model.addAttribute("userId", user.getId());
            model.addAttribute("nombreCompleto", user.getFirstName() + " " + user.getLastName());
            String roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.joining(", "));
            model.addAttribute("rolUsuario", roles);
        }
        model.addAttribute("contenido", "Profesor/cursos");
        return "Profesor/dashboard_layout";
    }

    @GetMapping("/profesor/eventos")
    public String mostrarEventos(Model model, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user != null) {
            model.addAttribute("userId", user.getId());
            model.addAttribute("nombreCompleto", user.getFirstName() + " " + user.getLastName());
            String roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.joining(", "));
            model.addAttribute("rolUsuario", roles);
        }
        model.addAttribute("contenido", "Profesor/eventos");
        return "Profesor/dashboard_layout";
    }

    @GetMapping("/profesor/perfil")
    public String mostrarPerfil(Model model, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user != null) {
            model.addAttribute("userId", user.getId());
            model.addAttribute("nombreCompleto", user.getFirstName() + " " + user.getLastName());
            String roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.joining(", "));
            model.addAttribute("rolUsuario", roles);
        }
        model.addAttribute("contenido", "Profesor/perfil");
        return "Profesor/dashboard_layout";
    }

    @GetMapping("/profesor/dashboard")
    public String dashboard(Model model, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user != null) {
            model.addAttribute("userId", user.getId());
            model.addAttribute("nombreCompleto", user.getFirstName() + " " + user.getLastName());
            String roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.joining(", "));
            model.addAttribute("rolUsuario", roles);
        }
        model.addAttribute("contenido", "Profesor/dashboard_inicio");
        return "Profesor/dashboard_layout";
    }

    @GetMapping("/profesor/calificaciones")
    public String mostrarCalificaciones(Model model, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user != null) {
            model.addAttribute("userId", user.getId());
            model.addAttribute("nombreCompleto", user.getFirstName() + " " + user.getLastName());
            String roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.joining(", "));
            model.addAttribute("rolUsuario", roles);
        }
        model.addAttribute("contenido", "Profesor/calificaciones");
        return "Profesor/dashboard_layout";
    }

    @GetMapping("/profesor/asistencia")
    public String mostrarAsistencia(Model model, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user != null) {
            model.addAttribute("userId", user.getId());
            model.addAttribute("nombreCompleto", user.getFirstName() + " " + user.getLastName());
            String roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.joining(", "));
            model.addAttribute("rolUsuario", roles);
        }
        model.addAttribute("contenido", "Profesor/asistencia");
        return "Profesor/dashboard_layout";
    }

}
