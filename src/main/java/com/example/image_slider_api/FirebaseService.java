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
}


package com.example.image_slider_api;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger; // Import Logger
import org.slf4j.LoggerFactory; // Import LoggerFactory
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
public class FirebaseService {

    // Add a logger instance
    private static final Logger logger = LoggerFactory.getLogger(FirebaseService.class);

    @PostConstruct // This ensures this method runs after the service is created
    public void initialize() {
        logger.info("Attempting to initialize Firebase..."); // Log: Starting initialization

        // Use try-with-resources for automatic file closing
        try (InputStream serviceAccount = new FileInputStream("src/main/resources/serviceAccountKey.json")) {

            logger.info("Service account key file found."); // Log: File found

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setDatabaseUrl("https://my-image-slider-e1a96-default-rtdb.firebaseio.com") // Ensure this URL is correct
                    .build();

            // Check if the default app already exists before initializing
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                logger.info("Firebase application has been initialized successfully!"); // Log: Success
            } else {
                logger.warn("Firebase application already initialized."); // Log: Already initialized (shouldn't happen on first start)
            }
        } catch (IOException e) {
            // Log the error if the file isn't found or credentials fail
            logger.error("!!! CRITICAL: Firebase initialization failed !!!", e);
            // Optionally re-throw or handle more gracefully depending on requirements
            // throw new RuntimeException("Failed to initialize Firebase", e);
        } catch (Exception e) {
            // Catch any other unexpected errors during initialization
            logger.error("!!! CRITICAL: An unexpected error occurred during Firebase initialization !!!", e);
        }
    }
}



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
*/

package com.example.image_slider_api;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileInputStream; // Use FileInputStream again
import java.io.IOException;
import java.io.InputStream;

@Service
public class FirebaseService {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseService.class);
    private FirebaseApp firebaseApp;

    @PostConstruct
    public void initialize() {
        logger.info("Attempting to initialize Firebase...");

        // ** THE FIX IS HERE **
        // Define the path where Render mounts the secret file.
        String keyFilePath = "/etc/secrets/serviceAccountKey.json";

        // Use FileInputStream with the correct path for Render's environment.
        try (InputStream serviceAccount = new FileInputStream(keyFilePath)) {

            logger.info("Service account key file found at: {}", keyFilePath); // Log: File found confirmation

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setDatabaseUrl("https://my-image-slider-e1a96-default-rtdb.firebaseio.com") // Ensure this URL is correct
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                this.firebaseApp = FirebaseApp.initializeApp(options);
                logger.info("Firebase application has been initialized successfully!");
            } else {
                this.firebaseApp = FirebaseApp.getInstance();
                logger.warn("Firebase application already initialized. Using existing instance.");
            }

            if (FirebaseApp.getApps().isEmpty()) {
                logger.error("!!! CRITICAL: Firebase initialization completed BUT no default app found. Check configuration. !!!");
            } else {
                logger.info("Confirmed Firebase default app instance exists.");
            }

        } catch (IOException e) {
            // Log the error if the file isn't found at the specified path or credentials fail
            logger.error("!!! CRITICAL: Firebase initialization failed - IO issue finding key at '{}'. Check Render secret file configuration and path. !!!", keyFilePath, e);
        } catch (Exception e) {
            // Catch any other unexpected errors during initialization
            logger.error("!!! CRITICAL: An unexpected error occurred during Firebase initialization !!!", e);
        }
    }

    public FirebaseApp getFirebaseApp() {
        // You might need error handling here if firebaseApp is null
        return firebaseApp;
    }
}