# Use an official OpenJDK runtime as a parent image
# Using Eclipse Temurin which is a widely supported OpenJDK build
FROM eclipse-temurin:17-jdk-jammy AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper files first (efficient caching)
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download dependencies (this layer is cached if pom.xml doesn't change)
RUN ./mvnw dependency:resolve

# Copy the source code
COPY src ./src

# Build the application JAR file
RUN ./mvnw package -DskipTests


# --- Second Stage: Create the final lightweight image ---
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy only the built JAR file from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# ** THE FIX IS HERE **
# Copy the service account key from the build context root (where Render placed it)
# into the current working directory (/app) inside the final image.
COPY serviceAccountKey.json ./

# Expose the port the application runs on
EXPOSE 8080

# Command to run the application when the container starts
ENTRYPOINT ["java","-jar","/app/app.jar"]