package com.example.image_slider_api;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Arrays;
import java.util.List;

@RestController
public class BannerController {

    @CrossOrigin(origins = "https://lbo4nw.netlify.app/")
    @GetMapping("/api/banners")
    public List<Banner> getBanners() {
        return Arrays.asList(
                new Banner("https://firebasestorage.googleapis.com/v0/b/my-image-slider-e1a96.firebasestorage.app/o/slider-images%2FScreenshot_2024-12-04-11-06-30-90_40deb401b9ffe8e1df2f1cc5ba480b12.jpg?alt=media&token=ccccc4f5-3225-4d16-85fc-b71f32505c9d"),
                new Banner("https://firebasestorage.googleapis.com/v0/b/my-image-slider-e1a96.firebasestorage.app/o/slider-images%2FScreenshot_2024-12-13-11-58-39-39_f9ee0578fe1cc94de7482bd41accb329.jpg?alt=media&token=6878b445-cc01-49ec-a4bb-b772fa32b334"),
                new Banner("https://firebasestorage.googleapis.com/v0/b/my-image-slider-e1a96.firebasestorage.app/o/slider-images%2FScreenshot_2024-12-13-18-08-23-69_f9ee0578fe1cc94de7482bd41accb329.jpg?alt=media&token=84d5516a-9f26-416a-8671-a640617a73e6"),
                new Banner("https://firebasestorage.googleapis.com/v0/b/my-image-slider-e1a96.firebasestorage.app/o/slider-images%2FScreenshot_2024-12-13-19-00-44-72_1c337646f29875672b5a61192b9010f9.jpg?alt=media&token=897ba4de-7a90-4b38-95b7-daead23627e2")
        );
    }
}