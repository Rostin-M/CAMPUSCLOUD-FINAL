package CampusCloud.controller;

import CampusCloud.repository.UserEventsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/eventos")
public class UserEventsRestController {

    @Autowired
    private UserEventsRepository userEventsRepository;

    @GetMapping("/usuario/{userId}")
    public List<Map<String, Object>> getEventosPorUsuario(@PathVariable Long userId) {
        return userEventsRepository.findEventosByUserId(userId);
    }
}