/*
package com.example.image_slider_api;

public class Rating {
    private double average;
    private int count;

    public Rating(double average, int count) {
        this.average = average;
        this.count = count;
    }

    // Getters and Setters
    public double getAverage() { return average; }
    public void setAverage(double average) { this.average = average; }
    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }
}*/

package com.example.image_slider_api;

public class Rating {
    private double average;
    private int count;

    // **THE FIX IS HERE**: This is the required "no-argument" constructor.
    // The Firebase library needs this to create the object before filling it with data.
    public Rating() {}

    // This is your existing constructor, which is also fine to keep.
    public Rating(double average, int count) {
        this.average = average;
        this.count = count;
    }

    // Getters and Setters
    public double getAverage() {
        return average;
    }
    public void setAverage(double average) {
        this.average = average;
    }
    public int getCount() {
        return count;
    }
    public void setCount(int count) {
        this.count = count;
    }
}
