/*
package com.example.image_slider_api;

<<<<<<< HEAD
import com.google.firebase.database.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
=======
<<<<<<< HEAD
import org.springframework.web.bind.annotation.CrossOrigin;
=======
    
>>>>>>> a938f67f624a80f2fc18f36222cbc866efff386b
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
>>>>>>> 239697c7a4967f2afef79d5355415457be7246aa

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api")
public class ImageController {

    // This method now fetches data LIVE from your Firebase database.
    // It no longer uses a hardcoded list.
    @CrossOrigin
    @GetMapping("/images")
    public List<ImageData> getImageData() throws ExecutionException, InterruptedException {
        DatabaseReference ref = FirebaseDatabase.getInstance().getReference("images");
        CompletableFuture<List<ImageData>> future = new CompletableFuture<>();

        ref.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                List<ImageData> imageList = new ArrayList<>();
                if (dataSnapshot.exists()) {
                    for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                        ImageData imageData = snapshot.getValue(ImageData.class);
                        if (imageData != null) {
                            imageData.setId(snapshot.getKey()); // Set the ID from the Firebase key (e.g., "image1")
                            imageList.add(imageData);
                        }
                    }
                }
                future.complete(imageList);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                future.completeExceptionally(databaseError.toException());
            }
        });

        return future.get();
    }

    // This method correctly updates the rating in your Firebase database.
    @CrossOrigin
    @PostMapping("/api/images/{id}/rate")
    public ResponseEntity<Void> submitRating(@PathVariable String id, @RequestBody Map<String, Integer> payload) {
        Integer newRating = payload.get("rating");
        if (newRating == null || newRating < 1 || newRating > 5) {
            return ResponseEntity.badRequest().build();
        }

        DatabaseReference profileRef = FirebaseDatabase.getInstance().getReference("images/" + id);

        profileRef.runTransaction(new Transaction.Handler() {
            @Override
            public Transaction.Result doTransaction(MutableData mutableData) {
                ImageData profile = mutableData.getValue(ImageData.class);
                if (profile == null) {
                    return Transaction.success(mutableData);
                }

                Rating currentRating = profile.getRating();
                if (currentRating == null) {
                    currentRating = new Rating(0, 0);
                }

                double totalPoints = currentRating.getAverage() * currentRating.getCount();
                int newCount = currentRating.getCount() + 1;
                double newAverage = (totalPoints + newRating) / newCount;

                currentRating.setCount(newCount);
                currentRating.setAverage(Math.round(newAverage * 10.0) / 10.0);
                profile.setRating(currentRating);

                mutableData.setValue(profile);
                return Transaction.success(mutableData);
            }

            @Override
            public void onComplete(DatabaseError databaseError, boolean committed, DataSnapshot dataSnapshot) {
                if (databaseError != null) {
                    System.out.println("Rating transaction failed: " + databaseError.getMessage());
                }
            }
        });

        return ResponseEntity.ok().build();
    }

    // This method correctly updates the visit count in your Firebase database.
    @CrossOrigin
    @PostMapping("/api/images/{id}/visit")
    public ResponseEntity<Void> incrementVisitCount(@PathVariable String id) {
        DatabaseReference profileRef = FirebaseDatabase.getInstance().getReference("images/" + id + "/visits");

        profileRef.runTransaction(new Transaction.Handler() {
            @Override
            public Transaction.Result doTransaction(MutableData mutableData) {
                Integer currentVisits = mutableData.getValue(Integer.class);
                if (currentVisits == null) {
                    mutableData.setValue(1); // First visit
                } else {
                    mutableData.setValue(currentVisits + 1);
                }
                return Transaction.success(mutableData);
            }

            @Override
            public void onComplete(DatabaseError databaseError, boolean committed, DataSnapshot dataSnapshot) {
                if (databaseError != null) {
                    System.out.println("Visit count transaction failed: " + databaseError.getMessage());
                }
            }
        });

        return ResponseEntity.ok().build();
    }
}*//*

*/
/*

package com.example.image_slider_api;

import com.google.firebase.database.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@RestController
// REMOVED: The @RequestMapping("/api") annotation was here and has been removed to fix the error.
public class ImageController {

    // This method now has the full path and fetches data LIVE from your Firebase database.
    @CrossOrigin
    @GetMapping("/api/images") // CORRECTED: The full path is now here.
    public List<ImageData> getImageData() throws ExecutionException, InterruptedException {
        DatabaseReference ref = FirebaseDatabase.getInstance().getReference("images");
        CompletableFuture<List<ImageData>> future = new CompletableFuture<>();

        ref.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                List<ImageData> imageList = new ArrayList<>();
                if (dataSnapshot.exists()) {
                    for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                        ImageData imageData = snapshot.getValue(ImageData.class);
                        if (imageData != null) {
                            imageData.setId(snapshot.getKey());
                            imageList.add(imageData);
                        }
                    }
                }
                future.complete(imageList);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                future.completeExceptionally(databaseError.toException());
            }
        });

        return future.get();
    }

    // This method correctly updates the rating in your Firebase database.
    @CrossOrigin
    @PostMapping("/api/images/{id}/rate") // This path is now correct without the class-level mapping.
    public ResponseEntity<Void> submitRating(@PathVariable String id, @RequestBody Map<String, Integer> payload) {
        Integer newRating = payload.get("rating");
        if (newRating == null || newRating < 1 || newRating > 5) {
            return ResponseEntity.badRequest().build();
        }

        DatabaseReference profileRef = FirebaseDatabase.getInstance().getReference("images/" + id);

        profileRef.runTransaction(new Transaction.Handler() {
            @Override
            public Transaction.Result doTransaction(MutableData mutableData) {
                ImageData profile = mutableData.getValue(ImageData.class);
                if (profile == null) {
                    return Transaction.success(mutableData);
                }
                Rating currentRating = profile.getRating();
                if (currentRating == null) {
                    currentRating = new Rating(0, 0);
                }
                double totalPoints = currentRating.getAverage() * currentRating.getCount();
                int newCount = currentRating.getCount() + 1;
                double newAverage = (totalPoints + newRating) / newCount;
                currentRating.setCount(newCount);
                currentRating.setAverage(Math.round(newAverage * 10.0) / 10.0);
                profile.setRating(currentRating);
                mutableData.setValue(profile);
                return Transaction.success(mutableData);
            }

            @Override
            public void onComplete(DatabaseError databaseError, boolean committed, DataSnapshot dataSnapshot) {
                if (databaseError != null) {
                    System.out.println("Rating transaction failed: " + databaseError.getMessage());
                }
            }
        });

        return ResponseEntity.ok().build();
    }

    // This method correctly updates the visit count in your Firebase database.
    @CrossOrigin
    @PostMapping("/api/images/{id}/visit") // This path is now correct.
    public ResponseEntity<Void> incrementVisitCount(@PathVariable String id) {
        DatabaseReference profileRef = FirebaseDatabase.getInstance().getReference("images/" + id + "/visits");

        profileRef.runTransaction(new Transaction.Handler() {
            @Override
            public Transaction.Result doTransaction(MutableData mutableData) {
                Integer currentVisits = mutableData.getValue(Integer.class);
                if (currentVisits == null) {
                    mutableData.setValue(1);
                } else {
                    mutableData.setValue(currentVisits + 1);
                }
                return Transaction.success(mutableData);
            }

            @Override
            public void onComplete(DatabaseError databaseError, boolean committed, DataSnapshot dataSnapshot) {
                if (databaseError != null) {
                    System.out.println("Visit count transaction failed: " + databaseError.getMessage());
                }
            }
        });

        return ResponseEntity.ok().build();
    }
}
*//*

*/
/*

package com.example.image_slider_api;

import com.google.firebase.FirebaseApp; // Import FirebaseApp
import com.google.firebase.database.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@RestController
public class ImageController {

    @CrossOrigin
    @GetMapping("/api/images")
    public List<ImageData> getImageData() throws ExecutionException, InterruptedException {
        // ** THE FIX IS HERE **: Explicitly get the default FirebaseApp instance first.
        FirebaseApp firebaseApp = FirebaseApp.getInstance();
        // Now get the database reference FROM that specific app instance.
        DatabaseReference ref = FirebaseDatabase.getInstance(firebaseApp).getReference("images");

        CompletableFuture<List<ImageData>> future = new CompletableFuture<>();

        ref.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                List<ImageData> imageList = new ArrayList<>();
                if (dataSnapshot.exists()) {
                    for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                        ImageData imageData = snapshot.getValue(ImageData.class);
                        if (imageData != null) {
                            imageData.setId(snapshot.getKey());
                            imageList.add(imageData);
                        }
                    }
                }
                future.complete(imageList);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                future.completeExceptionally(databaseError.toException());
            }
        });

        return future.get();
    }

    @CrossOrigin
    @PostMapping("/api/images/{id}/rate")
    public ResponseEntity<Void> submitRating(@PathVariable String id, @RequestBody Map<String, Integer> payload) {
        Integer newRating = payload.get("rating");
        if (newRating == null || newRating < 1 || newRating > 5) {
            return ResponseEntity.badRequest().build();
        }

        // ** APPLY THE FIX HERE TOO **
        FirebaseApp firebaseApp = FirebaseApp.getInstance();
        DatabaseReference profileRef = FirebaseDatabase.getInstance(firebaseApp).getReference("images/" + id);

        profileRef.runTransaction(new Transaction.Handler() {
            // ... (rest of the transaction logic remains exactly the same)
            @Override
            public Transaction.Result doTransaction(MutableData mutableData) {
                ImageData profile = mutableData.getValue(ImageData.class);
                if (profile == null) { return Transaction.success(mutableData); }
                Rating currentRating = profile.getRating();
                if (currentRating == null) { currentRating = new Rating(0, 0); }
                double totalPoints = currentRating.getAverage() * currentRating.getCount();
                int newCount = currentRating.getCount() + 1;
                double newAverage = (totalPoints + newRating) / newCount;
                currentRating.setCount(newCount);
                currentRating.setAverage(Math.round(newAverage * 10.0) / 10.0);
                profile.setRating(currentRating);
                mutableData.setValue(profile);
                return Transaction.success(mutableData);
            }
            @Override
            public void onComplete(DatabaseError databaseError, boolean committed, DataSnapshot dataSnapshot) {
                if (databaseError != null) { System.out.println("Rating transaction failed: " + databaseError.getMessage()); }
            }
        });

        return ResponseEntity.ok().build();
    }

    @CrossOrigin
    @PostMapping("/api/images/{id}/visit")
    public ResponseEntity<Void> incrementVisitCount(@PathVariable String id) {
        // ** APPLY THE FIX HERE TOO **
        FirebaseApp firebaseApp = FirebaseApp.getInstance();
        DatabaseReference profileRef = FirebaseDatabase.getInstance(firebaseApp).getReference("images/" + id + "/visits");

        profileRef.runTransaction(new Transaction.Handler() {
            // ... (rest of the transaction logic remains exactly the same)
            @Override
            public Transaction.Result doTransaction(MutableData mutableData) {
                Integer currentVisits = mutableData.getValue(Integer.class);
                if (currentVisits == null) { mutableData.setValue(1); }
                else { mutableData.setValue(currentVisits + 1); }
                return Transaction.success(mutableData);
            }
            @Override
            public void onComplete(DatabaseError databaseError, boolean committed, DataSnapshot dataSnapshot) {
                if (databaseError != null) { System.out.println("Visit count transaction failed: " + databaseError.getMessage()); }
            }
        });

        return ResponseEntity.ok().build();
    }
}*//*


package com.example.image_slider_api;

// Firebase Imports (ensure these are present)
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.MutableData;
import com.google.firebase.database.Transaction;
import com.google.firebase.database.ValueEventListener;

// Spring Boot Imports
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Java Util Imports
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@RestController
public class ImageController {

    // **THE FIX IS HERE**: We are injecting FirebaseService.
    // This tells Spring Boot: "Before you create ImageController, you MUST fully create FirebaseService first."
    // This guarantees that the initialize() method in FirebaseService has run.
    private final FirebaseService firebaseService;

    @Autowired // Marks this constructor for dependency injection
    public ImageController(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }

    // This method now fetches data LIVE from your Firebase database.
    @CrossOrigin
    @GetMapping("/api/images")
    public List<ImageData> getImageData() throws ExecutionException, InterruptedException {
        // Now that initialization is guaranteed, this call should work reliably.
        DatabaseReference ref = FirebaseDatabase.getInstance().getReference("images");
        CompletableFuture<List<ImageData>> future = new CompletableFuture<>();

        ref.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                List<ImageData> imageList = new ArrayList<>();
                if (dataSnapshot.exists()) {
                    for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                        ImageData imageData = snapshot.getValue(ImageData.class);
                        if (imageData != null) {
                            imageData.setId(snapshot.getKey());
                            imageList.add(imageData);
                        }
                    }
                }
                future.complete(imageList);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                future.completeExceptionally(databaseError.toException());
            }
        });

        return future.get();
    }

    // This method correctly updates the rating in your Firebase database.
    @CrossOrigin
    @PostMapping("/api/images/{id}/rate")
    public ResponseEntity<Void> submitRating(@PathVariable String id, @RequestBody Map<String, Integer> payload) {
        // ... (rest of the submitRating method remains exactly the same) ...
        Integer newRating = payload.get("rating");
        if (newRating == null || newRating < 1 || newRating > 5) {
            return ResponseEntity.badRequest().build();
        }
        DatabaseReference profileRef = FirebaseDatabase.getInstance().getReference("images/" + id);
        profileRef.runTransaction(*/
/* ... Transaction.Handler ... *//*
);
        return ResponseEntity.ok().build();
    }

    // This method correctly updates the visit count in your Firebase database.
    @CrossOrigin
    @PostMapping("/api/images/{id}/visit")
    public ResponseEntity<Void> incrementVisitCount(@PathVariable String id) {
        // ... (rest of the incrementVisitCount method remains exactly the same) ...
        DatabaseReference profileRef = FirebaseDatabase.getInstance().getReference("images/" + id + "/visits");
        profileRef.runTransaction(*/
/* ... Transaction.Handler ... *//*
);
        return ResponseEntity.ok().build();
    }
}*/

/*
package com.example.image_slider_api;

import com.google.firebase.database.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@RestController
// REMOVED: The @RequestMapping("/api") annotation was here and has been removed to fix the error.
public class ImageController {

    // This method now has the full path and fetches data LIVE from your Firebase database.
    @CrossOrigin(origins = "https://lbo4nw.netlify.app/")
    @GetMapping("/api/images") // CORRECTED: The full path is now here.
    public List<ImageData> getImageData() throws ExecutionException, InterruptedException {
        DatabaseReference ref = FirebaseDatabase.getInstance().getReference("images");
        CompletableFuture<List<ImageData>> future = new CompletableFuture<>();

        ref.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                List<ImageData> imageList = new ArrayList<>();
                if (dataSnapshot.exists()) {
                    for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                        ImageData imageData = snapshot.getValue(ImageData.class);
                        if (imageData != null) {
                            imageData.setId(snapshot.getKey());
                            imageList.add(imageData);
                        }
                    }
                }
                future.complete(imageList);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                future.completeExceptionally(databaseError.toException());
            }
        });

        return future.get();
    }

    // This method correctly updates the rating in your Firebase database.
    @CrossOrigin(origins = "https://lbo4nw.netlify.app/")
    @PostMapping("/api/images/{id}/rate") // This path is now correct without the class-level mapping.
    public ResponseEntity<Void> submitRating(@PathVariable String id, @RequestBody Map<String, Integer> payload) {
        Integer newRating = payload.get("rating");
        if (newRating == null || newRating < 1 || newRating > 5) {
            return ResponseEntity.badRequest().build();
        }

        DatabaseReference profileRef = FirebaseDatabase.getInstance().getReference("images/" + id);

        profileRef.runTransaction(new Transaction.Handler() {
            @Override
            public Transaction.Result doTransaction(MutableData mutableData) {
                ImageData profile = mutableData.getValue(ImageData.class);
                if (profile == null) {
                    return Transaction.success(mutableData);
                }
                Rating currentRating = profile.getRating();
                if (currentRating == null) {
                    currentRating = new Rating(0, 0);
                }
                double totalPoints = currentRating.getAverage() * currentRating.getCount();
                int newCount = currentRating.getCount() + 1;
                double newAverage = (totalPoints + newRating) / newCount;
                currentRating.setCount(newCount);
                currentRating.setAverage(Math.round(newAverage * 10.0) / 10.0);
                profile.setRating(currentRating);
                mutableData.setValue(profile);
                return Transaction.success(mutableData);
            }

            @Override
            public void onComplete(DatabaseError databaseError, boolean committed, DataSnapshot dataSnapshot) {
                if (databaseError != null) {
                    System.out.println("Rating transaction failed: " + databaseError.getMessage());
                }
            }
        });

        return ResponseEntity.ok().build();
    }

    // This method correctly updates the visit count in your Firebase database.
    @CrossOrigin(origins = "https://lbo4nw.netlify.app/")
    @PostMapping("/api/images/{id}/visit") // This path is now correct.
    public ResponseEntity<Void> incrementVisitCount(@PathVariable String id) {
        DatabaseReference profileRef = FirebaseDatabase.getInstance().getReference("images/" + id + "/visits");

        profileRef.runTransaction(new Transaction.Handler() {
            @Override
            public Transaction.Result doTransaction(MutableData mutableData) {
                Integer currentVisits = mutableData.getValue(Integer.class);
                if (currentVisits == null) {
                    mutableData.setValue(1);
                } else {
                    mutableData.setValue(currentVisits + 1);
                }
                return Transaction.success(mutableData);
            }

            @Override
            public void onComplete(DatabaseError databaseError, boolean committed, DataSnapshot dataSnapshot) {
                if (databaseError != null) {
                    System.out.println("Visit count transaction failed: " + databaseError.getMessage());
                }
            }
        });

        return ResponseEntity.ok().build();
    }
}*/

/*
package com.example.image_slider_api;

// ** ADDED IMPORTS **
import com.google.firebase.FirebaseApp; // Needed for the check
import com.google.firebase.database.*;
import org.slf4j.Logger; // For logging
import org.slf4j.LoggerFactory; // For logging
import org.springframework.beans.factory.annotation.Autowired; // For dependency injection
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@RestController
public class ImageController {

    // ** ADDED LOGGER **
    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);

    // ** ADDED DEPENDENCY INJECTION **
    private final FirebaseService firebaseService; // Ensures FirebaseService is initialized first

    @Autowired // Marks this constructor for Spring Boot to use for injection
    public ImageController(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }

    // This method now has the full path and fetches data LIVE from your Firebase database.
    @CrossOrigin(origins = "https://lbo4nw.netlify.app/") // Correct origin
    @GetMapping("/api/images")
    public List<ImageData> getImageData() throws ExecutionException, InterruptedException {

        // ** ADDED LOGGING AND CHECK **
        logger.info("Attempting to access Firebase in getImageData. Default app exists: {}", !FirebaseApp.getApps().isEmpty());
        if (FirebaseApp.getApps().isEmpty()) {
            logger.error("!!! FirebaseApp [DEFAULT] still doesn't exist when trying to get images. Initialization failed earlier. !!!");
            return new ArrayList<>(); // Return empty list to prevent 500
        }

        DatabaseReference ref = FirebaseDatabase.getInstance().getReference("images");
        CompletableFuture<List<ImageData>> future = new CompletableFuture<>();

        ref.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                List<ImageData> imageList = new ArrayList<>();
                if (dataSnapshot.exists()) {
                    logger.info("Firebase data snapshot received for /images."); // Log success
                    for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                        // ** ADDED TRY-CATCH FOR ROBUSTNESS **
                        try {
                            ImageData imageData = snapshot.getValue(ImageData.class);
                            if (imageData != null) {
                                imageData.setId(snapshot.getKey());
                                imageList.add(imageData);
                            } else {
                                logger.warn("Null ImageData received for key: {}", snapshot.getKey());
                            }
                        } catch (DatabaseException e) {
                            logger.error("Failed to convert Firebase data for key: {}. Check data structure. Error: {}", snapshot.getKey(), e.getMessage());
                        }
                    }
                } else {
                    logger.warn("Firebase data snapshot for /images does not exist or is empty.");
                }
                future.complete(imageList);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                logger.error("Firebase data fetch cancelled for /images.", databaseError.toException());
                future.completeExceptionally(databaseError.toException());
            }
        });

        return future.get();
    }

    // This method correctly updates the rating in your Firebase database.
    @CrossOrigin(origins = "https://lbo4nw.netlify.app/") // Correct origin
    @PostMapping("/api/images/{id}/rate")
    public ResponseEntity<Void> submitRating(@PathVariable String id, @RequestBody Map<String, Integer> payload) {
        Integer newRating = payload.get("rating");
        if (newRating == null || newRating < 1 || newRating > 5) {
            return ResponseEntity.badRequest().build();
        }

        DatabaseReference profileRef = FirebaseDatabase.getInstance().getReference("images/" + id);

        profileRef.runTransaction(new Transaction.Handler() {
            @Override
            public Transaction.Result doTransaction(MutableData mutableData) {
                ImageData profile = mutableData.getValue(ImageData.class);
                if (profile == null) { return Transaction.success(mutableData); }
                Rating currentRating = profile.getRating();
                if (currentRating == null) { currentRating = new Rating(0, 0); }
                double totalPoints = currentRating.getAverage() * currentRating.getCount();
                int newCount = currentRating.getCount() + 1;
                double newAverage = (totalPoints + newRating) / newCount;
                currentRating.setCount(newCount);
                currentRating.setAverage(Math.round(newAverage * 10.0) / 10.0);
                profile.setRating(currentRating);
                mutableData.setValue(profile);
                return Transaction.success(mutableData);
            }

            @Override
            public void onComplete(DatabaseError databaseError, boolean committed, DataSnapshot dataSnapshot) {
                if (databaseError != null) { System.err.println("Rating transaction failed: " + databaseError.getMessage()); }
                else if (committed) { System.out.println("Rating transaction committed successfully for ID: " + id); }
                else { System.out.println("Rating transaction aborted for ID: " + id); }
            }
        });

        return ResponseEntity.ok().build();
    }

    // This method correctly updates the visit count in your Firebase database.
    @CrossOrigin(origins = "https://lbo4nw.netlify.app/") // Correct origin
    @PostMapping("/api/images/{id}/visit")
    public ResponseEntity<Void> incrementVisitCount(@PathVariable String id) {
        DatabaseReference profileRef = FirebaseDatabase.getInstance().getReference("images/" + id + "/visits");

        profileRef.runTransaction(new Transaction.Handler() {
            @Override
            public Transaction.Result doTransaction(MutableData mutableData) {
                Integer currentVisits = mutableData.getValue(Integer.class);
                if (currentVisits == null) { mutableData.setValue(1); }
                else { mutableData.setValue(currentVisits + 1); }
                return Transaction.success(mutableData);
            }

            @Override
            public void onComplete(DatabaseError databaseError, boolean committed, DataSnapshot dataSnapshot) {
                if (databaseError != null) { System.err.println("Visit count transaction failed: " + databaseError.getMessage()); }
                else if (committed) { System.out.println("Visit count updated successfully for ID: " + id); }
                else { System.out.println("Visit count transaction aborted for ID: " + id); }
            }
        });

        return ResponseEntity.ok().build();
    }
}
Working with attempting but not displaying profiles
*/
package com.example.image_slider_api;

import com.google.firebase.FirebaseApp;
import com.google.firebase.database.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
// ** ADDED IMPORTS FOR TIMEOUT **
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

@RestController
public class ImageController {

    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);
    private final FirebaseService firebaseService;

    @Autowired
    public ImageController(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }

    @CrossOrigin(origins = "https://lbo4nw.netlify.app/") // Use your Netlify URL
    @GetMapping("/api/images")
    public List<ImageData> getImageData() throws ExecutionException, InterruptedException {

        logger.info("GET /api/images requested. Checking Firebase app...");
        if (FirebaseApp.getApps().isEmpty()) {
            logger.error("!!! FirebaseApp [DEFAULT] still doesn't exist when trying to get images. Initialization failed earlier. !!!");
            return new ArrayList<>();
        }
        logger.info("Firebase app confirmed. Fetching data from '/images'...");

        DatabaseReference ref = FirebaseDatabase.getInstance().getReference("images");
        CompletableFuture<List<ImageData>> future = new CompletableFuture<>();

        ref.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                // ** ADDED LOGGING INSIDE CALLBACK **
                logger.info("Firebase onDataChange received for /images.");
                List<ImageData> imageList = new ArrayList<>();
                if (dataSnapshot.exists()) {
                    logger.info("Data snapshot for /images exists. Processing children...");
                    for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                        try {
                            ImageData imageData = snapshot.getValue(ImageData.class);
                            if (imageData != null) {
                                imageData.setId(snapshot.getKey());
                                imageList.add(imageData);
                            } else {
                                logger.warn("Null ImageData received for key: {}", snapshot.getKey());
                            }
                        } catch (DatabaseException e) {
                            logger.error("Failed to convert Firebase data for key: {}. Error: {}", snapshot.getKey(), e.getMessage());
                        }
                    }
                    logger.info("Finished processing {} children for /images.", imageList.size());
                } else {
                    logger.warn("Firebase data snapshot for /images does not exist or is empty.");
                }
                // Complete the future, signaling the main thread
                future.complete(imageList);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                // ** ADDED LOGGING INSIDE CALLBACK **
                logger.error("Firebase data fetch cancelled for /images.", databaseError.toException());
                future.completeExceptionally(databaseError.toException());
            }
        });

        try {
            // ** ADDED TIMEOUT **
            // Wait for a maximum of 30 seconds for the future to complete.
            logger.info("Waiting for Firebase data fetch to complete (max 30s)...");
            return future.get(30, TimeUnit.SECONDS);
        } catch (TimeoutException e) {
            // If it times out, log an error and return an empty list.
            logger.error("!!! Firebase request for /images timed out after 30 seconds! Callback likely never triggered. Check Rules/Path/Data Size. !!!", e);
            return new ArrayList<>(); // Return empty list instead of hanging
        } catch (ExecutionException | InterruptedException e) {
            logger.error("!!! Error waiting for Firebase data for /images !!!", e);
            // Let Spring handle these exceptions for a 500 error, but log them first.
            throw e;
        }
    }

    // --- submitRating and incrementVisitCount methods remain the same ---
    // Make sure they also have the correct @CrossOrigin(origins = "...") annotation
    @CrossOrigin(origins = "https://lbo4nw.netlify.app/")
    @PostMapping("/api/images/{id}/rate")
    public ResponseEntity<Void> submitRating(@PathVariable String id, @RequestBody Map<String, Integer> payload) { Integer newRating = payload.get("rating");
        if (newRating == null || newRating < 1 || newRating > 5) {
            return ResponseEntity.badRequest().build();
        }

        DatabaseReference profileRef = FirebaseDatabase.getInstance().getReference("images/" + id);

        profileRef.runTransaction(new Transaction.Handler() {
            @Override
            public Transaction.Result doTransaction(MutableData mutableData) {
                ImageData profile = mutableData.getValue(ImageData.class);
                if (profile == null) { return Transaction.success(mutableData); }
                Rating currentRating = profile.getRating();
                if (currentRating == null) { currentRating = new Rating(0, 0); }
                double totalPoints = currentRating.getAverage() * currentRating.getCount();
                int newCount = currentRating.getCount() + 1;
                double newAverage = (totalPoints + newRating) / newCount;
                currentRating.setCount(newCount);
                currentRating.setAverage(Math.round(newAverage * 10.0) / 10.0);
                profile.setRating(currentRating);
                mutableData.setValue(profile);
                return Transaction.success(mutableData);
            }

            @Override
            public void onComplete(DatabaseError databaseError, boolean committed, DataSnapshot dataSnapshot) {
                if (databaseError != null) { System.err.println("Rating transaction failed: " + databaseError.getMessage()); }
                else if (committed) { System.out.println("Rating transaction committed successfully for ID: " + id); }
                else { System.out.println("Rating transaction aborted for ID: " + id); }
            }
        });

        return ResponseEntity.ok().build(); }

    @CrossOrigin(origins = "https://lbo4nw.netlify.app/")
    @PostMapping("/api/images/{id}/visit")
    public ResponseEntity<Void> incrementVisitCount(@PathVariable String id) {  DatabaseReference profileRef = FirebaseDatabase.getInstance().getReference("images/" + id + "/visits");

        profileRef.runTransaction(new Transaction.Handler() {
            @Override
            public Transaction.Result doTransaction(MutableData mutableData) {
                Integer currentVisits = mutableData.getValue(Integer.class);
                if (currentVisits == null) { mutableData.setValue(1); }
                else { mutableData.setValue(currentVisits + 1); }
                return Transaction.success(mutableData);
            }

            @Override
            public void onComplete(DatabaseError databaseError, boolean committed, DataSnapshot dataSnapshot) {
                if (databaseError != null) { System.err.println("Visit count transaction failed: " + databaseError.getMessage()); }
                else if (committed) { System.out.println("Visit count updated successfully for ID: " + id); }
                else { System.out.println("Visit count transaction aborted for ID: " + id); }
            }
        });

        return ResponseEntity.ok().build();
    }
}