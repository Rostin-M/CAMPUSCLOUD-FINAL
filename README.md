# 🌩️ CampusCloud

**CampusCloud** es una plataforma web para la gestión académica universitaria, desarrollada con **Java 21**, **Spring Boot 3**, **Spring Security** y **PostgreSQL** en un proyecto Maven. Su objetivo es facilitar la administración de cursos, usuarios, tareas, calificaciones y otros procesos críticos en la Universidad de Medellín, con especial foco en mejorar la experiencia del docente.

---

## 📘 Introducción

En la Universidad de Medellín, el sistema basado en Moodle ha cumplido su función, pero presenta fallas que afectan principalmente al rol del docente:

- Dificultad para registrar asistencias de forma rápida y confiable.
- Gestión desorganizada de tareas, eventos y calificaciones.
- Interfaz anticuada poco intuitiva y no adaptada a la dinámica docente.
- Seguridad mínima al iniciar sesión, con CAPTCHAs invasivos que bloquean accesos legítimos.
- Falta de automatización en notificaciones y recordatorios académicos.

**CampusCloud** propone una solución moderna y segura que:

1. Integra un **login con reCAPTCHA menos invasivo** y control de roles (Admin, Profesor, Estudiante).
2. Ofrece un **dashboard docente** donde se visualiza en un solo lugar el resumen de cursos, tareas, eventos, calificaciones y asistencias.
3. Automatiza la **toma de asistencia** y la **gestión de calificaciones** (con exportación a Excel).
4. Incluye un **calendario académico** con eventos personalizables y notificaciones por correo.
5. Permite a los desarrolladores y administradores extraer reportes de manera centralizada y confiable.

---

## 📁 Estructura del Proyecto

```plaintext
CampusCloud/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── CampusCloud/
│   │   │       ├── config/        # Configuración y beans de Spring (SecurityConfig, AppConfig, etc.)
│   │   │       ├── controller/    # Controladores REST y MVC (AdminController, AuthController, CourseController, EstudianteController, ProfesorController, ProfesorRestController, RoleController, UserEventsRestController, DashboardController)
│   │   │       ├── model/         # Entidades JPA (User, Role, Course, AcademicEvent, Attendance)
│   │   │       ├── repository/    # Repositorios Spring Data JPA (UserRepository, RoleRepository, CourseRepository, etc.)
│   │   │       ├── security/      # Configuración y utilidades de seguridad (CustomUserDetails, RecaptchaFilter)
│   │   │       └── service/       # Lógica de negocio y servicios (AuthService, UserService, RoleService, CourseService, GmailSender, GmailServiceFactory)
│   │   └── resources/
│   │       ├── db/
│   │       │   └── init/          # Scripts SQL de inicialización (init.sql)
│   │       ├── static/
│   │       │   ├── css/           # Hojas de estilo (sidebar.css, login.css, dashboard.css)
│   │       │   ├── images/        # Recursos gráficos (logo, íconos)
│   │       │   └── js/            # Scripts JavaScript (login.js, calendar.js, sidebar.js)
│   │       └── templates/
│   │           └── Profesor/      # Vistas Thymeleaf del panel docente (dashboard_layout.html, cursos.html, eventos.html, calificaciones.html, asistencia.html, sidebar fragment, etc.)
│   └── test/
│       └── java/
│           └── CampusCloud/      # Pruebas unitarias e integración (AuthServiceTest, CourseServiceTest, SecurityTest, etc.)
├── target/                       # Artifacts compilados
├── .mvn/                         # Maven Wrapper
├── pom.xml                       # Configuración de Maven
├── Dockerfile                    # Imagen Docker para el backend
├── docker-compose.yaml           # Para levantar servicio local con base de datos
├── k8s/                          # Manifiestos de Kubernetes (deployment.yaml, service.yaml, ingress.yaml, configmap.yaml)
├── .gitignore
├── README.md                     # (Este archivo)
└── mvnw, mvnw.cmd                # Maven Wrapper scripts
```

---

## ⚙️ Tecnologías y Dependencias

**Lenguaje y Build:**

- Java 21
- Maven + Maven Wrapper (mvnw, mvnw.cmd)

**Backend:**

- Spring Boot 3
- Spring Security
- Spring Data JPA
- Spring Boot Starters (Web, Thymeleaf, Validation, Quartz, OAuth2 Resource Server, Mail, Actuator, Data JPA, OAuth2 Client, OAuth2 Authorization Server)
- Flyway (migraciones de base de datos)
- Swagger / Springdoc OpenAPI (documentación API)
- BCrypt (hash de contraseñas)
- Jakarta Mail (envío de correos)
- Logback + Logstash Encoder (logging)
- Lombok (solo en desarrollo)
- DevTools (solo en desarrollo)

**Base de Datos:**

- PostgreSQL (Neon.tech, driver JDBC)
- Flyway (migraciones SQL)

**Frontend:**

- HTML5
- CSS3
- JavaScript (ES6+)
- Thymeleaf (motor de plantillas)
- Google reCAPTCHA v2 (protección de formularios)

**Integraciones y APIs:**

- Google API Client
- Google Gmail API
- Google OAuth Client

**Contenedores y Orquestación:**

- Docker (Dockerfile, construcción de imágenes)
- Docker Compose (docker-compose.yaml)
- Kubernetes (manifiestos en k8s/)
- Minikube (entorno local Kubernetes)
- Docker Hub (registro de imágenes)

**Control de Versiones y CI/CD:**

- Git
- GitHub
- Docker Hub

**Testing y Logging:**

- JUnit + Spring Security Test
- Logstash (configuración para logs)

---

## 🚀 Puesta en Marcha

1. **Configura la base de datos** en `src/main/resources/application.properties`:

    ```properties
    spring.datasource.url=jdbc:postgresql://<host>:5432/<db>?sslmode=require
    spring.datasource.username=<user>
    spring.datasource.password=<pass>
    spring.jpa.hibernate.ddl-auto=validate
    spring.flyway.enabled=true
    spring.flyway.locations=classpath:db/init
    ```

2. **Inicializa el esquema automático** con Flyway o asegúrate que `src/main/resources/db/init/init.sql` exista.

3. **Construye e instala** el proyecto:

    ```bash
    ./mvnw clean install
    ```

4. **Ejecuta** la aplicación:

    ```bash
    ./mvnw spring-boot:run
    ```

    O bien, genera el JAR y corre:

    ```bash
    ./mvnw clean package
    java -jar target/CampusCloud-0.0.1-SNAPSHOT.jar
    ```

5. **(Opcional) Levanta con Docker Compose:**

    ```bash
    docker-compose up --build
    ```

6. **(Opcional) Despliega en Minikube:**

    ```bash
    minikube start
    kubectl apply -f k8s/
    ```

---

## 🎯 Funcionalidades Destacadas

### Login y roles

- Autenticación con reCAPTCHA de Google y redirección según rol (Admin, Profesor, Estudiante).
- Gestión de sesiones segura con Spring Security.

### Dashboard de Profesor

- Sidebar dinámico con rutas a:
  - Mis Cursos (vista + filtros)
  - Eventos Académicos (calendario interactivo, creación/edición)
  - Calificaciones (listado, filtros, estadísticas, exportación a Excel)
  - Asistencia (toma de asistencia, filtros, exportación, carga al sistema)
- Vista de resumen: entregas recientes de estudiantes, mensajes, próximos eventos.

### API REST Documentada

- Endpoints en `/api/` para gestión de cursos, roles, usuarios y eventos.
- Documentación automática con Swagger UI en `/swagger-ui.html`.

### UI Moderna y Responsive

- Diseño minimalista con efecto glass en paneles.
- Compatible con dispositivos móviles.
- Carga de datos vía JavaScript y fetch (calendario, tablas, filtros).

### Integración de Correo

- Envío de notificaciones automáticas por Gmail API.
- Plantillas con logo institucional y firma.

---

## 🔗 Conclusiones

1. CampusCloud unifica y mejora la experiencia del docente, centralizando gestión de cursos, eventos, calificaciones y asistencia en un solo lugar.
2. Docker y Minikube facilitaron el despliegue local, simulando entornos de producción y garantizando portabilidad.
3. Git y GitHub me enseñaron la importancia del versionamiento, algo que aunque no era mi parte favorita, ahora sé que es esencial para controlar cambios y colaborar.

---

## 🔒 Licencia y Uso

Queda estrictamente prohibida la copia, distribución, modificación o uso comercial de este proyecto sin autorización previa y por escrito.

2025 © Rostin Santiago Alzate Montoya
