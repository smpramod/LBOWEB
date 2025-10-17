package com.example.image_slider_api;

public class Banner {
    private String imageUrl;

    public Banner(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}