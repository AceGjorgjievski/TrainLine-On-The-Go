package mk.ukim.finki.trainbackend.service.impl;

import mk.ukim.finki.trainbackend.repository.UserRepository;
import mk.ukim.finki.trainbackend.service.inter.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return this.userRepository.findUserByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));
    }
}
