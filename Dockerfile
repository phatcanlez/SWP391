# Use Eclipse Temurin JDK 17 on Alpine as the base image
FROM eclipse-temurin:17-jdk-alpine

# Install Maven
RUN apk add --no-cache maven

# Set the working directory in the container
WORKDIR /app

# Copy the project files into the container
COPY . .

# Give execute permissions to the Maven wrapper
RUN chmod +x ./mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# Create a volume for temporary files
VOLUME /tmp

# Copy the built JAR file to the root directory and rename it
RUN cp target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Set the entrypoint to run the Java application
ENTRYPOINT ["java","-jar","/app/app.jar"]

