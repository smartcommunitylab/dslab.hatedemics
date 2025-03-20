package it.smartcommunitylab.hatedemics.api.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import it.smartcommunitylab.hatedemics.api.domain.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    public String generateToken(User user) {
        try {
            // Create HMAC signer
            JWSSigner signer = new MACSigner(secret);

            // Prepare JWT with claims set
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(user.getUsername())
                    .claim("role", user.getRole())
                    .expirationTime(new Date(System.currentTimeMillis() + 24*60*60*1000*7)) // 7 days
                    .build();

            SignedJWT signedJWT = new SignedJWT(
                    new JWSHeader(JWSAlgorithm.HS256),
                    claimsSet);

            // Apply the HMAC protection
            signedJWT.sign(signer);

            // Serialize to compact form, produces something like
            // eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
            return signedJWT.serialize();

        } catch (JOSEException e) {
            throw new RuntimeException("Error generating JWT token", e);
        }
    }

    public String getUserNameFromJwtToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            String name = signedJWT.getJWTClaimsSet().getSubject();
            return name;
        } catch (ParseException e) {
            throw new RuntimeException("Error parsing JWT token", e);
        }
    }

    public boolean validateJwtToken(String authToken) {
        SignedJWT signedJWT;
        try {
            signedJWT = SignedJWT.parse(authToken);
            MACVerifier verifier = new MACVerifier(secret);
            if (signedJWT.verify(verifier)) {
                Date exp = signedJWT.getJWTClaimsSet().getExpirationTime();
                return exp.after(new Date());
            }
        } catch (Exception e) {
            return false;
        }
        return false;
    }
}
