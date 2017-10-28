FROM maven:3.5-jdk-8-alpine

ADD SpringWebSocket /app

RUN mvn clean package -f /app/pom.xml && \
  chown 1000300:1000300 /app/target/SpringWebSocket-0.0.1.jar

EXPOSE 8080

USER 1000300

CMD ["/usr/bin/java", "-jar", "/app/target/SpringWebSocket-0.0.1.jar", "-Xmx512m", "-Djava.security.egd=file:/dev/./urandom"]