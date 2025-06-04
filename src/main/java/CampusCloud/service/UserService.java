package CampusCloud.service;

import CampusCloud.model.User;
import CampusCloud.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByInstitutionalId(String institutionalId) {
        return userRepository.findByInstitutionalId(institutionalId);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
}