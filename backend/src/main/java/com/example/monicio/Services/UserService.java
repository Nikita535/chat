package com.example.monicio.Services;


import com.example.monicio.Config.JWT.JWTUtil;
import com.example.monicio.Controllers.AuthController;
import com.example.monicio.DTO.UserDTO;
import com.example.monicio.DTO.ValidateDTO.RegisterRequestDTO;
import com.example.monicio.Models.*;
import com.example.monicio.Repositories.ActivationTokenRepository;
import com.example.monicio.Repositories.MessageRepository;
import com.example.monicio.Repositories.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.beanvalidation.SpringValidatorAdapter;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import javax.validation.Validator;
import java.io.IOException;
import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepo;

    @Autowired
    MessageRepository messageRepository;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    @Autowired
    Validator validator;

    @Autowired
    private ActivationTokenRepository activationTokenRepository;

    public void save(User user) {
        userRepo.save(user);
//        try {
//            createActivationCode(user.getEmail());
//        } catch (MessagingException e) {
//            throw new RuntimeException(e);
//        }
    }

    public boolean existsByUserEmail(String email) {
        return userRepo.findUserByEmail(email).isPresent();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("No user with username = " + username));
    }

    public void registerUser(RegisterRequestDTO registerRequestDTO) {
        save(User.builder()
                .email(registerRequestDTO.getEmail())
                .username(registerRequestDTO.getUsername())
                .password(passwordEncoder.encode(registerRequestDTO.getPassword()))
                .authorities(Set.of(Role.ROLE_ADMIN))
                .active(false).build()
        );
    }

    public ResponseEntity<?> loginUser(UserDTO userDto) {
        final Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userDto.getUsername(), userDto.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = (User) authentication.getPrincipal();
        user.setEmail(userDto.getEmail());
        String jwt = jwtUtil.generateToken(user.getUsername());

        List<String> authorities = user.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
        return ResponseEntity.ok(new AuthController.JwtResponse(jwt, user.getId(), user.getEmail(), user.getUsername(), authorities,user.getAvatar()));
    }

    public ResponseEntity<?> collectUserData(Principal user) {
        User userObj = (User) loadUserByUsername(user.getName());

        return ResponseEntity.ok(
                UserDTO.builder()
                        .username(userObj.getUsername())
                        .email(userObj.getEmail())
                        .authorities(userObj.getAuthorities().toArray())
                        .avatar(userObj.getAvatar())
                        .build()
        );
    }


    public void activateUser(String code) {
        User user = activationTokenRepository.findByToken(code).getUser();
        if (user == null) {
            return;
        }
        user.setActive(true);
        activationTokenRepository.deleteByToken(code);
        save(user);
    }

    public User findUserByEmail(String email) {
        return userRepo.findUserByEmail(email).get();
    }

    public void createActivationCode(String userEmail) throws MessagingException {
        User user = findUserByEmail(userEmail);
        String token = UUID.randomUUID().toString();
        ActivationToken myToken = new ActivationToken(token, user, new Date());
        activationTokenRepository.save(myToken);

        if (!ObjectUtils.isEmpty(user.getEmail())) {
            String message = "Привет, " + user.getUsername() + "!" +
                    " для активации аккаунта перейдите <a href='http://localhost:8080/activate/" + token + "'>по ссылке для подтверждения почты</a>"
                    + "а затем продолжите логин <a href='http://localhost:3000/login/'>по ссылке</a>";
            emailService.sendSimpleMessage(user.getEmail(), message);
        }
    }


    public User getUserAuth(Principal principal) {
        return (User) loadUserByUsername(principal.getName());
    }

    public ResponseEntity<?> userEdit(String JsonUserDTO, Authentication authentication, MultipartFile multipartFile) throws JsonProcessingException {
        User user = getUserAuth(authentication);

        UserDTO userDTO= new ObjectMapper().readValue(JsonUserDTO,UserDTO.class);
        SpringValidatorAdapter springValidator = new SpringValidatorAdapter(validator);
        BindingResult bindingResult = new BeanPropertyBindingResult(userDTO, "UserDtoResult");
        springValidator.validate(userDTO, bindingResult);

        if (bindingResult.hasErrors()) {
            return new ResponseEntity<>(bindingResult.getFieldErrors(), HttpStatus.CONFLICT);
        }

        try {
            user.setUsername(userDTO.getUsername());
            user.setEmail(userDTO.getEmail());
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            if (multipartFile != null) {
                Media media = Media.builder()
                        .originalFileName(multipartFile.getOriginalFilename())
                        .mediaType(multipartFile.getContentType())
                        .size(multipartFile.getSize())
                        .bytes(multipartFile.getBytes()).build();
                user.setAvatar(media);
            }
            save(user);
            authentication = new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtil.generateToken(user.getUsername());

            List<String> authorities = user.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
            return ResponseEntity.ok(new AuthController.JwtResponse(jwt, user.getId(), user.getEmail(), user.getUsername(), authorities,user.getAvatar()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Пользователь с такой почтой уже существует");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public ResponseEntity<?> getAllUsers(Integer pageNumber){
        Pageable paging = PageRequest.of(pageNumber, 10, Sort.by("id"));
        Page<User> pagedResult = userRepo.findAll(paging);

        if(pagedResult.hasContent()) {
            return ResponseEntity.ok(pagedResult.getContent());
        } else {
            return ResponseEntity.badRequest().body("Что-то пошло не так");
        }
    }

    public ResponseEntity<?> deleteUser(Long id){
        return ResponseEntity.ok(userRepo.deleteUsersById(id));
    }


    public ResponseEntity<?> getPublicMessages(){
        return ResponseEntity.ok(messageRepository.findAll().stream().filter(message -> message.getReceiverName()==null).collect(Collectors.toList()));
    }

    public ResponseEntity<?> getPrivateMessages(){
        return ResponseEntity.ok(messageRepository.findAll().stream().filter(message -> message.getReceiverName()!=null).collect(Collectors.toList()));
    }

    public ResponseEntity<?> deleteMessage(String messageIndex){
        List<Message> publicMessage = messageRepository.findAll().stream().filter(message -> message.getReceiverName() == null).toList();
        Message deletedMessage = publicMessage.get(Integer.parseInt(messageIndex));
        messageRepository.delete(deletedMessage);
        return ResponseEntity.ok("Сообщение удалено");
    }
}