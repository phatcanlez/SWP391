# Use Eclipse Temurin JDK 17 on Alpine as the base image
FROM eclipse-temurin:17-jdk-alpine

# Create a volume for temporary files
VOLUME /tmp

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file from the target directory to the container
COPY target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Set the entrypoint to run the Java application
ENTRYPOINT ["java", "-jar", "app.jar"]
