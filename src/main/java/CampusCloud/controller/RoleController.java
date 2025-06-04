package CampusCloud.controller;

import CampusCloud.model.Role;
import CampusCloud.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @GetMapping("/{name}")
    public Optional<Role> getRoleByName(@PathVariable String name) {
        return roleService.findByName(name);
    }

    @PostMapping
    public Role createRole(@RequestBody Role role) {
        return roleService.saveRole(role);
    }

    @GetMapping
    public Iterable<Role> getAllRoles() {
        return roleService.findAllRoles();
    }
}