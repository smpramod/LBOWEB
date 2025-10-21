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