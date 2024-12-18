package com.example.SWP391.entity;

import com.example.SWP391.model.Enum.Role;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
//implement UserDetails để Spring security hiểu mốt để dùng phân quyền
public class Account implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Enumerated(EnumType.STRING)
    Role role;

    @NotBlank(message = "Name can not be blank")
    @Size(min = 1, max = 30, message = "Name must less than 30 letter")
    String name;

    @NotBlank(message = "not blank")
    @Column(unique = true)
    String username;

    @Email(message = "Email not valid or have been used")
    String email;

    String avatar;

    Boolean status;

    @Pattern(regexp = "^$|\\d{10}", message = "Invalid phone number!")
    String phoneNumber;

    String address;

    @NotBlank(message = "Password can not be blank")
    @Size(min = 6, message = "Password must more than 6 letter")
    String password;

    @OneToMany(mappedBy = "account",cascade = CascadeType.ALL)
    @JsonIgnore
    List<Orders> orders = new ArrayList<>();

    @ManyToMany
    @JsonIgnore
    @JsonBackReference
    @JoinTable(
            name = "room_user",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "room_id"))
    private Set<Room> rooms = new HashSet<>();



    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Message> messages = new HashSet<>();


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // định nghĩa những quyền hạn mà account có thể làm được
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        if(this.role!=null)
            authorities.add(new SimpleGrantedAuthority(this.role.toString()));
        return authorities;
    }

    @Override
    public String getUsername() {
        return this.username;  //dang nhap bang email, this.phone -> dang nhap bang phone
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
