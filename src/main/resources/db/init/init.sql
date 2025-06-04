-- Pendiente de Verificacion, se añadieron nuevos campos a la base de datos

-- Creacion de las tablas para CampusCloud

-- 1. Crear esquema y extensiones
CREATE SCHEMA IF NOT EXISTS campus_cloud;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla base: Usuarios (requerida por casi todas las demás)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    institutional_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de roles del sistema
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- 4. Cursos académicos (depende de users)
CREATE TABLE IF NOT EXISTS courses (
    course_id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    created_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Inscripciones (depende de users y courses)
CREATE TABLE IF NOT EXISTS enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    course_role VARCHAR(20) NOT NULL CHECK (course_role IN ('teacher', 'student')),
    enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, course_id)
);

-- 6. Eventos académicos (depende de courses)
CREATE TABLE IF NOT EXISTS academic_events (
    event_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('tarea', 'examen', 'clase')),
    due_date TIMESTAMP NOT NULL,
    created_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Contenido de cursos (depende de courses)
CREATE TABLE IF NOT EXISTS course_content (
    content_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    resource_url TEXT,
    uploaded_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Entregas de estudiantes (depende de academic_events y users)
CREATE TABLE IF NOT EXISTS submissions (
    submission_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id INT NOT NULL REFERENCES academic_events(event_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    submission_url TEXT,
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    grade DECIMAL(2,1) CHECK (grade BETWEEN 0 AND 5)
);

-- 9. Historial de versiones de entregas (depende de submissions)
CREATE TABLE IF NOT EXISTS submission_versions (
    version_id SERIAL PRIMARY KEY,
    submission_id INT NOT NULL REFERENCES submissions(submission_id) ON DELETE CASCADE,
    submission_url TEXT NOT NULL,
    version_number INT NOT NULL,
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. Asistencia (depende de courses y users)
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(10) NOT NULL CHECK (status IN ('present', 'absent')),
    UNIQUE (course_id, user_id, date)
);

-- 11. Notificaciones (depende de users y academic_events)
CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    event_id INT NOT NULL REFERENCES academic_events(event_id) ON DELETE CASCADE,
    message VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP,
    read_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. Recordatorios automáticos (depende de academic_events y users)
CREATE TABLE IF NOT EXISTS reminders (
    reminder_id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES academic_events(event_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP NOT NULL,
    sent BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (event_id, user_id, scheduled_time)
);

-- 13. Archivos adjuntos (depende de submissions y course_content)
CREATE TABLE IF NOT EXISTS files (
    file_id SERIAL PRIMARY KEY,
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('submission', 'content')),
    entity_id INT NOT NULL,
    url TEXT NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 14. Auditoría (depende de users)
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 15. Recuperación de contraseña (depende de users)
CREATE TABLE IF NOT EXISTS password_resets (
    token VARCHAR(64) PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL
);

-- 16. Sincronización con calendarios externos (depende de academic_events)
CREATE TABLE IF NOT EXISTS calendar_sync (
    sync_id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES academic_events(event_id) ON DELETE CASCADE,
    external_id VARCHAR(100) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    UNIQUE (event_id, platform)
);

-- 17. Roles de usuario (relación muchos a muchos)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Índices para optimización
CREATE INDEX idx_courses_created_by ON courses(created_by);
CREATE INDEX idx_events_due_date ON academic_events(due_date);
CREATE INDEX idx_submissions_grade ON submissions(grade);
CREATE INDEX idx_attendance_date ON attendance(date);

-- Poblando la base de datos

-- Limpiar todas las tablas y reiniciar los autoincrementales
TRUNCATE TABLE 
    user_roles,
    calendar_sync,
    password_resets,
    audit_logs,
    files,
    reminders,
    notifications,
    attendance,
    submission_versions,
    submissions,
    course_content,
    academic_events,
    enrollments,
    courses,
    roles,
    users
RESTART IDENTITY CASCADE;

-- Insertar roles del sistema
INSERT INTO roles (role_name) VALUES 
('Admin'),
('Profesor'),
('Estudiante');

-- Insertar usuarios de prueba
INSERT INTO users (institutional_id, email, password, first_name, last_name) VALUES
('ADM001', 'admin@admin.edu', 'securepass123', 'Carlos', 'Martínez'),

('PROF202', 'martha.gomez@udemedellin.edu.co', 'profepass', 'Martha', 'Gómez'),
('PROF145', 'jairo.velez@udemedellin.edu.co', 'profepass2', 'Jairo', 'Vélez'),

('EST1234', 'ana.toro@soyudemedellin.edu.co', 'studentpass', 'Ana', 'Toro'),
('EST5678', 'camilo.giraldo@soyudemedellin.edu.co', 'studentpass', 'Camilo', 'Giraldo'),
('EST9012', 'diana.morales@soyudemedellin.edu.co', 'studentpass', 'Diana', 'Morales');

-- Asignar roles a usuarios
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),  
(2, 2),  
(3, 2),  
(4, 3),  
(5, 3),  
(6, 3);  

-- Crear cursos académicos
INSERT INTO courses (code, title, description, created_by) VALUES
('MAT101', 'Cálculo Diferencial', 'Curso introductorio de cálculo diferencial', 2),
('PROG202', 'Programación Avanzada', 'Programación en Python y algoritmos', 3);

-- Inscripciones a cursos
INSERT INTO enrollments (user_id, course_id, course_role) VALUES
(2, 1, 'teacher'),
(3, 2, 'teacher'),

(4, 1, 'student'),
(5, 1, 'student'),
(6, 1, 'student'),
(4, 2, 'student'),
(5, 2, 'student');

-- Eventos académicos
INSERT INTO academic_events (course_id, title, description, event_type, due_date, created_by) VALUES
(1, 'Examen Parcial 1', 'Examen de límites y derivadas', 'examen', '2025-03-15 14:00:00', 2),
(1, 'Tarea 1 - Derivadas', 'Ejercicios prácticos de derivadas', 'tarea', '2025-07-10 23:59:00', 2),
(2, 'Proyecto 1 - Algoritmos', 'Implementación de algoritmos de ordenamiento', 'tarea', '2025-06-20 23:59:00', 3);

-- Entregas de estudiantes
INSERT INTO submissions (event_id, user_id, submission_url, grade) VALUES
(2, 4, 'https://drive.google.com/tarea1-ana', 4.5),
(2, 5, 'https://drive.google.com/tarea1-camilo', 3.8),
(2, 6, 'https://drive.google.com/tarea1-diana', 4.2),
(3, 4, 'https://github.com/ana/proyecto1', 4.8),
(3, 5, 'https://github.com/camilo/proyecto1', 4.1);

-- Historial de versiones de entregas
INSERT INTO submission_versions (submission_id, submission_url, version_number) VALUES
(1, 'https://drive.google.com/tarea1-ana-v1', 1),
(1, 'https://drive.google.com/tarea1-ana-v2', 2),
(4, 'https://github.com/ana/proyecto1-inicial', 1);

-- Asistencia
INSERT INTO attendance (course_id, user_id, date, status) VALUES
(1, 4, '2025-05-01', 'present'),
(1, 5, '2025-05-03', 'present'),
(1, 6, '2025-05-05', 'absent'),
(2, 4, '2025-05-07', 'present'),
(2, 5, '2025-05-09', 'present');

-- Notificaciones
INSERT INTO notifications (user_id, event_id, message, sent_at) VALUES
(4, 2, 'Tarea 1 entregada con éxito', NOW()),
(5, 2, 'Tarea 1 entregada con éxito', NOW()),
(4, 3, 'Proyecto calificado: 4.8', NOW());

-- Archivos adjuntos
INSERT INTO files (entity_type, entity_id, url) VALUES
('content', 1, 'https://drive.google.com/guia-calculod'),
('submission', 1, 'https://drive.google.com/ana-tarea1.pdf');

-- Auditoría
INSERT INTO audit_logs (user_id, action, table_name, record_id) VALUES
(1, 'CREATE', 'users', 2),
(2, 'UPDATE', 'courses', 1);

-- Recuperación de contraseña
INSERT INTO password_resets (token, user_id, expires_at) VALUES
('abc123def456', 4, NOW() + INTERVAL '1 hour');

-- Calendario
INSERT INTO calendar_sync (event_id, external_id, platform) VALUES
(1, 'google-cal-123', 'Google Calendar'),
(2, 'outlook-456', 'Microsoft Outlook');