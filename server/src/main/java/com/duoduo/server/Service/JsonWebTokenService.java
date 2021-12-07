package com.duoduo.server.Service;

import com.duoduo.server.Entity.UserEntity;
import com.duoduo.server.Repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class JsonWebTokenService {

    @Autowired
    UserRepository userRepository;

    public String decodeEmail(String jwt) {
        Map<String, Object> claimMap = null;
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey("secret")
                    .parseClaimsJws(jwt.substring(7))
                    .getBody();
            claimMap = claims;
            String decodeEmail = (String) claimMap.get("email");
            return decodeEmail;
        } catch (Exception e) {
            return null;
        }
    }
    public UserEntity verifyEmail(String email) {
        try {
            UserEntity user = userRepository.findByEmail(email);
            return user;
        } catch (Exception e) {
            return null;
        }
    }
}
