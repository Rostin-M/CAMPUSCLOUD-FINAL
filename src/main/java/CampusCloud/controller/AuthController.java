package CampusCloud.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class AuthController {

    @GetMapping("/login")
    public String loginPage(Model model, HttpServletRequest request) {
        Object captchaError = request.getAttribute("captchaError");
        if (captchaError != null) {
            model.addAttribute("captchaError", captchaError.toString());
        }
        return "login";
    }

}