package com.example.image_slider_api;

// This is a Plain Old Java Object (POJO) that represents the structure of your data.
// The Firebase library uses this class as a template to convert JSON data into Java objects.
public class ImageData {
    // These fields must exactly match the keys in your Firebase JSON for each profile.
    private String id;
    private String url;
    private String name;
    private String description;
    private String mobile;
    private String longDescription;
    private Rating rating;
    private int visits;

    // **THE FIX IS HERE**: This is a "no-argument constructor".
    // It's an empty constructor that Firebase needs to create an initial instance of the object
    // before it can start filling in the data from your database. This is a common requirement.
    public ImageData() {}

    // This is your existing constructor, used for creating objects manually if needed.
    public ImageData(String id, String url, String name, String description, String mobile, String longDescription, Rating rating) {
        this.id = id;
        this.url = url;
        this.name = name;
        this.description = description;
        this.mobile = mobile;
        this.longDescription = longDescription;
        this.rating = rating;
        // Note: 'visits' is handled by its getter/setter.
    }

    // Getters and Setters allow the Firebase library to read and write the values of the private fields.
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getLongDescription() { return longDescription; }
    public void setLongDescription(String longDescription) { this.longDescription = longDescription; }

    public Rating getRating() { return rating; }
    public void setRating(Rating rating) { this.rating = rating; }

    public int getVisits() { return visits; }
    public void setVisits(int visits) { this.visits = visits; }
}