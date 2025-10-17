/*
package com.example.image_slider_api;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;

@Service            //This annotation tells Spring Boot, "This is an important service component. Create it and manage it for me when the application starts."
public class FirebaseService {

    @PostConstruct          //This annotation tells Spring Boot, "Immediately after you have created this @Service component, run the method marked with this annotation one time."
    public void initialize() {
        try {
            // This looks for the key file you placed in the 'resources' folder.
            FileInputStream serviceAccount =
                    new FileInputStream("src/main/resources/serviceAccountKey.json");

            // These options configure the connection.
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    // IMPORTANT: Make sure this URL matches your Firebase Database URL exactly.
                    .setDatabaseUrl("https://my-image-slider-e1a96-default-rtdb.firebaseio.com")
                    .build();

            // This ensures the Firebase app is initialized only once.
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase has been initialized successfully!");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}*/

package com.example.image_slider_api;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;

@Service
public class FirebaseService {

    @PostConstruct
    public void initialize() {
        try {
            // This looks for the key file you placed in the 'resources' folder.
            FileInputStream serviceAccount =
                    new FileInputStream("src/main/resources/serviceAccountKey.json");

            // These options configure the connection.
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    // **THE FIX IS HERE**: We are now explicitly telling Spring Boot to use the database that contains your 'images' data.
                    .setDatabaseUrl("https://my-image-slider-e1a96-default-rtdb.firebaseio.com/")
                    .build();

            // This ensures the Firebase app is initialized only once.
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase has been initialized successfully!");
            }
        } catch (IOException e) {
            // This will print an error if the serviceAccountKey.json file is not found.
            e.fillInStackTrace();
        }
    }
}