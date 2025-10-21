package com.example.image_slider_api;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Arrays;
import java.util.List;

@RestController
public class NotificationController {

    @CrossOrigin(origins = "https://lbo4nw.netlify.app/")
    @GetMapping("/api/notifications")
    public List<Notification> getNotifications() {
        return Arrays.asList(
                new Notification("New Profile Added", "A new profile for 'Kriti Sanon' was added.", 1672531199000L, false),
                new Notification("System Update", "Maintenance will occur tonight at 2 AM.", 1672444799000L, true),
                new Notification("Welcome!", "Welcome to the new profiles directory!", 1672358399000L, true),
                new Notification("Reminder: Team Meeting", "Don't forget the weekly sync tomorrow at 10 AM.", 1672621199000L, false)
        );
    }
}