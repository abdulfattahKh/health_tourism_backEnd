-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema health_tourism
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema health_tourism
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `health_tourism` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `health_tourism` ;

-- -----------------------------------------------------
-- Table `health_tourism`.`countries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`countries` (
  `country_id` INT(11) NOT NULL,
  `country_name` VARCHAR(45) NOT NULL,
  `country_code` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`country_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`cities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`cities` (
  `city_id` INT(11) NOT NULL,
  `city_name` VARCHAR(255) NOT NULL,
  `city_code` VARCHAR(255) NULL DEFAULT NULL,
  `country_id` INT(11) NOT NULL,
  PRIMARY KEY (`city_id`),
  INDEX `fk_cities_countries1_idx` (`country_id` ASC) VISIBLE,
  CONSTRAINT `fk_cities_countries1`
    FOREIGN KEY (`country_id`)
    REFERENCES `health_tourism`.`countries` (`country_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`states`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`states` (
  `state_id` INT(11) NOT NULL,
  `state_name` VARCHAR(255) NULL DEFAULT NULL,
  `state_code` VARCHAR(255) NULL DEFAULT NULL,
  `statescol` VARCHAR(45) NULL DEFAULT NULL,
  `cities_city_id` INT(11) NOT NULL,
  PRIMARY KEY (`state_id`),
  INDEX `fk_states_cities1_idx` (`cities_city_id` ASC) VISIBLE,
  CONSTRAINT `fk_states_cities1`
    FOREIGN KEY (`cities_city_id`)
    REFERENCES `health_tourism`.`cities` (`city_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`locations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`locations` (
  `location_id` INT(11) NOT NULL AUTO_INCREMENT,
  `longitude` DECIMAL(9,6) NOT NULL,
  `latitude` DECIMAL(9,6) NOT NULL,
  `country_id` INT(11) NOT NULL,
  `city_id` INT(11) NOT NULL,
  `state_id` INT(11) NOT NULL,
  PRIMARY KEY (`location_id`),
  INDEX `fk_locations_countries1_idx` (`country_id` ASC) VISIBLE,
  INDEX `fk_locations_cities1_idx` (`city_id` ASC) VISIBLE,
  INDEX `fk_locations_states1_idx` (`state_id` ASC) VISIBLE,
  CONSTRAINT `fk_locations_cities1`
    FOREIGN KEY (`city_id`)
    REFERENCES `health_tourism`.`cities` (`city_id`),
  CONSTRAINT `fk_locations_countries1`
    FOREIGN KEY (`country_id`)
    REFERENCES `health_tourism`.`countries` (`country_id`),
  CONSTRAINT `fk_locations_states1`
    FOREIGN KEY (`state_id`)
    REFERENCES `health_tourism`.`states` (`state_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 54
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`roles` (
  `role_id` INT(11) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`role_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `gender` TINYINT(2) NOT NULL,
  `birthday` DATETIME NOT NULL,
  `user_name` VARCHAR(255) NULL DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  `role_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_users_roles1_idx` (`role_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_roles1`
    FOREIGN KEY (`role_id`)
    REFERENCES `health_tourism`.`roles` (`role_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`clinics`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`clinics` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `location` VARCHAR(255) NULL DEFAULT NULL,
  `informations` VARCHAR(255) NULL DEFAULT NULL,
  `status` VARCHAR(45) NULL DEFAULT 'pending',
  `descreption` TEXT NOT NULL,
  `user_id` INT(11) NOT NULL,
  `location_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_clinics_users1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_clinic_location_id_idx` (`location_id` ASC) VISIBLE,
  CONSTRAINT `fk_clinic_location_id`
    FOREIGN KEY (`location_id`)
    REFERENCES `health_tourism`.`locations` (`location_id`),
  CONSTRAINT `fk_clinics_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `health_tourism`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`travel_agency`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`travel_agency` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `map` VARCHAR(100) NOT NULL,
  `users_id` INT(11) NOT NULL,
  `status` VARCHAR(45) NOT NULL DEFAULT 'waiting',
  `location_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_travel_agency_users1_idx` (`users_id` ASC) VISIBLE,
  INDEX `fk_location_location_id_idx` (`location_id` ASC) VISIBLE,
  CONSTRAINT `fk_travel_agency_location`
    FOREIGN KEY (`location_id`)
    REFERENCES `health_tourism`.`locations` (`location_id`),
  CONSTRAINT `fk_travel_agency_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `health_tourism`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 132
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`applications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`applications` (
  `content` VARCHAR(255) NOT NULL,
  `info` VARCHAR(255) NOT NULL,
  `users_id` INT(11) NOT NULL,
  `clinic_id` INT(11) NOT NULL,
  `travel_agency_id` INT(11) NOT NULL,
  PRIMARY KEY (`users_id`),
  INDEX `fk_applications_clinics1_idx` (`clinic_id` ASC) VISIBLE,
  INDEX `fk_applications_travel_agency1_idx` (`travel_agency_id` ASC) VISIBLE,
  CONSTRAINT `fk_applications_clinics1`
    FOREIGN KEY (`clinic_id`)
    REFERENCES `health_tourism`.`clinics` (`id`),
  CONSTRAINT `fk_applications_travel_agency1`
    FOREIGN KEY (`travel_agency_id`)
    REFERENCES `health_tourism`.`travel_agency` (`id`),
  CONSTRAINT `fk_applications_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `health_tourism`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`appointements`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`appointements` (
  `id` INT(11) NOT NULL,
  `clinics_id` INT(11) NOT NULL,
  `users_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_appointements_clinics1_idx` (`clinics_id` ASC) VISIBLE,
  INDEX `fk_appointements_users1_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_appointements_clinics1`
    FOREIGN KEY (`clinics_id`)
    REFERENCES `health_tourism`.`clinics` (`id`),
  CONSTRAINT `fk_appointements_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `health_tourism`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`doctors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`doctors` (
  `id` INT(11) NOT NULL,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `gender` VARCHAR(255) NOT NULL,
  `doctorscol` VARCHAR(45) NOT NULL,
  `phone_number` INT(11) NULL DEFAULT NULL,
  `mobile_number` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`clinics_doctors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`clinics_doctors` (
  `clinic_id` INT(11) NOT NULL,
  `doctor_id` INT(11) NOT NULL,
  PRIMARY KEY (`clinic_id`, `doctor_id`),
  INDEX `fk_clinics_has_doctors_doctors1_idx` (`doctor_id` ASC) VISIBLE,
  INDEX `fk_clinics_has_doctors_clinics1_idx` (`clinic_id` ASC) VISIBLE,
  CONSTRAINT `fk_clinics_has_doctors_clinics1`
    FOREIGN KEY (`clinic_id`)
    REFERENCES `health_tourism`.`clinics` (`id`),
  CONSTRAINT `fk_clinics_has_doctors_doctors1`
    FOREIGN KEY (`doctor_id`)
    REFERENCES `health_tourism`.`doctors` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`specializations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`specializations` (
  `spec_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  PRIMARY KEY (`spec_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `health_tourism`.`procedures`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`procedures` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `start_price` VARCHAR(45) NULL DEFAULT NULL,
  `end_price` VARCHAR(255) NULL DEFAULT NULL,
  `type` VARCHAR(255) NULL DEFAULT NULL,
  `expected_time` DATETIME NULL DEFAULT NULL,
  `specializations_spec_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_procedures_specializations1_idx` (`specializations_spec_id` ASC) VISIBLE,
  CONSTRAINT `fk_procedures_specializations1`
    FOREIGN KEY (`specializations_spec_id`)
    REFERENCES `health_tourism`.`specializations` (`spec_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`clinics_procedures`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`clinics_procedures` (
  `clinic_id` INT(11) NOT NULL,
  `procedure_id` INT(11) NOT NULL,
  PRIMARY KEY (`clinic_id`, `procedure_id`),
  INDEX `fk_clinics_has_procedures_procedures1_idx` (`procedure_id` ASC) VISIBLE,
  INDEX `fk_clinics_has_procedures_clinics1_idx` (`clinic_id` ASC) VISIBLE,
  CONSTRAINT `fk_clinics_has_procedures_clinics1`
    FOREIGN KEY (`clinic_id`)
    REFERENCES `health_tourism`.`clinics` (`id`),
  CONSTRAINT `fk_clinics_has_procedures_procedures1`
    FOREIGN KEY (`procedure_id`)
    REFERENCES `health_tourism`.`procedures` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`experinces`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`experinces` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `from` DATETIME NOT NULL,
  `to` DATETIME NOT NULL,
  `organization_name` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  `experincescol` VARCHAR(45) NOT NULL,
  `doctor_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_experinces_doctors1_idx` (`doctor_id` ASC) VISIBLE,
  CONSTRAINT `fk_experinces_doctors1`
    FOREIGN KEY (`doctor_id`)
    REFERENCES `health_tourism`.`doctors` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`hotels`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`hotels` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `price` INT(11) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`trips`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`trips` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `start_from` DATETIME NOT NULL,
  `finish_to` DATETIME NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `trip_flow` VARCHAR(255) NOT NULL,
  `travel_agency_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_trips_travel_agency1_idx` (`travel_agency_id` ASC) VISIBLE,
  CONSTRAINT `fk_trips_travel_agency1`
    FOREIGN KEY (`travel_agency_id`)
    REFERENCES `health_tourism`.`travel_agency` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`images` (
  `image_id` INT(11) NOT NULL AUTO_INCREMENT,
  `image_path` VARCHAR(255) NULL DEFAULT NULL,
  `image_type` TINYINT(4) NULL DEFAULT NULL,
  `clinics_id` INT(11) NULL,
  `travel_agency_id` INT(11) NULL,
  `procedures_id` INT(11) NULL,
  `trips_id` INT(11) NULL,
  PRIMARY KEY (`image_id`),
  INDEX `fk_images_clinics1_idx` (`clinics_id` ASC) VISIBLE,
  INDEX `fk_images_travel_agency1_idx` (`travel_agency_id` ASC) VISIBLE,
  INDEX `fk_images_procedures1_idx` (`procedures_id` ASC) VISIBLE,
  INDEX `fk_images_trips1_idx` (`trips_id` ASC) VISIBLE,
  CONSTRAINT `fk_images_clinics1`
    FOREIGN KEY (`clinics_id`)
    REFERENCES `health_tourism`.`clinics` (`id`),
  CONSTRAINT `fk_images_travel_agency1`
    FOREIGN KEY (`travel_agency_id`)
    REFERENCES `health_tourism`.`travel_agency` (`id`),
  CONSTRAINT `fk_images_procedures1`
    FOREIGN KEY (`procedures_id`)
    REFERENCES `health_tourism`.`procedures` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_images_trips1`
    FOREIGN KEY (`trips_id`)
    REFERENCES `health_tourism`.`trips` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`mumbers_trips`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`mumbers_trips` (
  `users_id` INT(11) NOT NULL,
  `users_role_id` INT(11) NOT NULL,
  `trips_id` INT(11) NOT NULL,
  PRIMARY KEY (`users_id`, `users_role_id`, `trips_id`),
  INDEX `fk_users_has_trips_trips1_idx` (`trips_id` ASC) VISIBLE,
  INDEX `fk_users_has_trips_users1_idx` (`users_id` ASC, `users_role_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_has_trips_trips1`
    FOREIGN KEY (`trips_id`)
    REFERENCES `health_tourism`.`trips` (`id`),
  CONSTRAINT `fk_users_has_trips_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `health_tourism`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`permissions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`permissions` (
  `permission_id` INT(11) NOT NULL,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `createdAt` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`permission_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`permissions_roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`permissions_roles` (
  `permission_id` INT(11) NOT NULL,
  `role_id` INT(11) NOT NULL,
  INDEX `fk_permissions_roles_permissions1_idx` (`permission_id` ASC) VISIBLE,
  INDEX `fk_permissions_roles_roles1_idx` (`role_id` ASC) VISIBLE,
  CONSTRAINT `fk_permissions_roles_permissions1`
    FOREIGN KEY (`permission_id`)
    REFERENCES `health_tourism`.`permissions` (`permission_id`),
  CONSTRAINT `fk_permissions_roles_roles1`
    FOREIGN KEY (`role_id`)
    REFERENCES `health_tourism`.`roles` (`role_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`reviews`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`reviews` (
  `id` INT(11) NOT NULL,
  `clinics_id` INT(11) NOT NULL,
  `users_id` INT(11) NOT NULL,
  `travel_agency_id` INT(11) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `content` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_reviews_clinics1_idx` (`clinics_id` ASC) VISIBLE,
  INDEX `fk_reviews_users1_idx` (`users_id` ASC) VISIBLE,
  INDEX `fk_reviews_travel_agency1_idx` (`travel_agency_id` ASC) VISIBLE,
  CONSTRAINT `fk_reviews_clinics1`
    FOREIGN KEY (`clinics_id`)
    REFERENCES `health_tourism`.`clinics` (`id`),
  CONSTRAINT `fk_reviews_travel_agency1`
    FOREIGN KEY (`travel_agency_id`)
    REFERENCES `health_tourism`.`travel_agency` (`id`),
  CONSTRAINT `fk_reviews_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `health_tourism`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`travel_agency_clinics`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`travel_agency_clinics` (
  `travel_agency_id` INT(11) NOT NULL,
  `clinic_id` INT(11) NOT NULL,
  PRIMARY KEY (`travel_agency_id`, `clinic_id`),
  INDEX `fk_travel_agency_has_clinics_clinics1_idx` (`clinic_id` ASC) VISIBLE,
  INDEX `fk_travel_agency_has_clinics_travel_agency1_idx` (`travel_agency_id` ASC) INVISIBLE,
  CONSTRAINT `fk_travel_agency_has_clinics_clinics1`
    FOREIGN KEY (`clinic_id`)
    REFERENCES `health_tourism`.`clinics` (`id`),
  CONSTRAINT `fk_travel_agency_has_clinics_travel_agency1`
    FOREIGN KEY (`travel_agency_id`)
    REFERENCES `health_tourism`.`travel_agency` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`trips_hotels`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`trips_hotels` (
  `trip_id` INT(11) NOT NULL,
  `hotel_id` INT(11) NOT NULL,
  PRIMARY KEY (`trip_id`, `hotel_id`),
  INDEX `fk_trips_has_hotels_hotels1_idx` (`hotel_id` ASC) VISIBLE,
  INDEX `fk_trips_has_hotels_trips1_idx` (`trip_id` ASC) VISIBLE,
  CONSTRAINT `fk_trips_has_hotels_hotels1`
    FOREIGN KEY (`hotel_id`)
    REFERENCES `health_tourism`.`hotels` (`id`),
  CONSTRAINT `fk_trips_has_hotels_trips1`
    FOREIGN KEY (`trip_id`)
    REFERENCES `health_tourism`.`trips` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `health_tourism`.`specializations_clinics`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`specializations_clinics` (
  `specialization_id` INT NOT NULL,
  `clinic_id` INT(11) NOT NULL,
  INDEX `fk_specializations_clinics_specializations1_idx` (`specialization_id` ASC) VISIBLE,
  INDEX `fk_specializations_clinics_clinics1_idx` (`clinic_id` ASC) VISIBLE,
  PRIMARY KEY (`clinic_id`, `specialization_id`),
  CONSTRAINT `fk_specializations_clinics_specializations1`
    FOREIGN KEY (`specialization_id`)
    REFERENCES `health_tourism`.`specializations` (`spec_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_specializations_clinics_clinics1`
    FOREIGN KEY (`clinic_id`)
    REFERENCES `health_tourism`.`clinics` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `health_tourism`.`experinces_doctors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`experinces_doctors` (
  `experinces_id` INT(11) NOT NULL,
  `doctors_id` INT(11) NOT NULL,
  INDEX `fk_experinces_doctors_experinces1_idx` (`experinces_id` ASC) VISIBLE,
  INDEX `fk_experinces_doctors_doctors1_idx` (`doctors_id` ASC) VISIBLE,
  CONSTRAINT `fk_experinces_doctors_experinces1`
    FOREIGN KEY (`experinces_id`)
    REFERENCES `health_tourism`.`experinces` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_experinces_doctors_doctors1`
    FOREIGN KEY (`doctors_id`)
    REFERENCES `health_tourism`.`doctors` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

insert into permissions(permission_id,name) values(1,'addRole'),(2,'deleteRole'),(3,'editRole');
insert into roles(role_id,name) values(1,'admin'),(2,'doctor'),(3,'travelAgent'),(4,'patient');
insert into permissions_roles(permission_id,role_id) values(1,1),(2,1),(3,1);

select roles.role_id, roles.name,permissions.permission_id,permissions.name from roles 
inner join permissions_roles on roles.role_id = permissions_roles.role_id
inner join permissions on permissions.permission_id = permissions_roles.permission_id
;


/* adding all countries */
INSERT INTO `countries` (`country_id`, `country_name`, `country_code`) VALUES
(1, 'أفغانسنان', 93),
(2, 'ألبانيا', 355),
(3, 'الجزائر', 213),
(4, 'ساموا الأمريكي', 1684),
(5, 'أندورا', 376),
(6, 'أنغولا', 244),
(7, 'أنغويلا', 1264),
(8, 'أنتاركتيكا', 0),
(9, 'أنتيغوا و بربودا', 1268),
(10, 'الأرجنتين', 54),
(11, 'أرمينيا', 374),
(12, 'أروبه', 297),
(13, 'أستراليا', 61),
(14, 'النمسا', 43),
(15, 'أذربيجان', 994),
(16, 'الباهامس', 1242),
(17, 'البحرين', 973),
(18, 'بنغلادش', 880),
(19, 'بربادوس', 1246),
(20, 'روسيا البيضاء', 375),
(21, 'بلجيكا', 32),
(22, 'بيليز', 501),
(23, 'بنين', 229),
(24, 'جزر برمودا', 1441),
(25, 'بوتان', 975),
(26, 'بوليفيا', 591),
(27, 'البوسنة و الهرسك', 387),
(28, 'بوتسوانا', 267),
(29, 'جزيرة بوفيه', 0),
(30, 'البرازيل', 55),
(31, 'إقليم المحيط الهندي البريطاني', 246),
(32, 'بروناي', 673),
(33, 'بلغاريا', 359),
(34, 'بوركينا فاسو', 226),
(35, 'بوروندي', 257),
(36, 'كمبوديا', 855),
(37, 'كاميرون', 237),
(38, 'كندا', 1),
(39, 'الرأس الأخضر', 238),
(40, 'جزيرة كايمان', 1345),
(41, 'جمهورية أفريقيا الوسطى', 236),
(42, 'تشاد', 235),
(43, 'شيلي', 56),
(44, 'الصين', 86),
(45, 'جزيرة عيد الميلاد', 61),
(46, 'جزر كوكس', 672),
(47, 'كولومبيا', 57),
(48, 'جزر القمر', 269),
(49, 'جمهورية الكونغو الديمقراطية', 242),
(50, 'جزر كوك', 682),
(51, 'كوستاريكا', 506),
(52, 'ساحل العاج', 225),
(53, 'كرواتيا', 385),
(54, 'كوبا', 53),
(55, 'قبرص', 357),
(56, 'جمهورية التشيك', 420),
(57, 'الدنمارك', 45),
(58, 'جيبوتي', 253),
(59, 'دومينيكا', 1767),
(60, 'الجمهورية الدومينيكية', 1809),
(61, 'تيمور الشرقية', 670),
(62, 'إكوادور', 593),
(63, 'مصر', 20),
(64, 'السلفادور', 503),
(65, 'غينيا الاستوائية', 240),
(66, 'إريتريا', 291),
(67, 'إستونيا', 372),
(68, 'إثيوبيا', 251),
(69, 'جزر فوكلاند', 500),
(70, 'جزر فارو', 298),
(71, 'فيجي', 679),
(72, 'فنلندا', 358),
(73, 'فرنسا', 33),
(74, 'غابون', 241),
(75, 'غامبيا', 220),
(76, 'جورجيا', 995),
(77, 'ألمانيا', 49),
(78, 'غانا', 233),
(79, 'جبل طارق', 350),
(80, 'اليونان', 30),
(81, 'غرينلاند', 299),
(82, 'غرينادا', 1473),
(83, 'جزر جوادلوب', 590),
(84, 'جوام', 1671),
(85, 'غواتيمالا', 502),
(86, 'غينيا', 224),
(87, 'غينيا-بيساو', 245),
(88, 'غيانا', 592),
(89, 'هاتاي', 509),
(90, 'جزيرة هيرد وجزر ماكدونالد', 0),
(91, 'الهندوراس', 504),
(92, 'هونغ كونغ', 852),
(93, 'المجر', 36),
(94, 'أيسلندا', 354),
(95, 'الهند', 91),
(96, 'إندونيسيا', 62),
(97, 'إيران', 98),
(98, 'العراق', 964),
(99, 'إيرلندا', 353),
(100, 'إيطاليا', 39),
(101, 'جامايكا', 1876),
(102, 'اليابان', 81),
(103, 'جيرسي', 44),
(104, 'الأردن', 962),
(105, 'كازاخستان', 7),
(106, 'كينيا', 254),
(107, 'كيريباتي', 686),
(108, 'كوريا الشمالية', 850),
(109, 'كوريا الجنوبية', 82),
(110, 'الكويت', 965),
(111, 'قرغيزستان', 996),
(112, 'لاوس', 856),
(113, 'لاتفيا', 371),
(114, 'لبنان', 961),
(115, 'ليسوتو', 266),
(116, 'ليبيريا', 231),
(117, 'ليبيا', 218),
(118, 'ليختنشتين', 423),
(119, 'لتوانيا', 370),
(120, 'لوكسمبرغ', 352),
(121, 'ماكاو', 853),
(122, 'مقدونيا', 389),
(123, 'مدغشقر', 261),
(124, 'مالاوي', 265),
(125, 'ماليزيا', 60),
(126, 'المالديف', 960),
(127, 'مالي', 223),
(128, 'مالطا', 356),
(129, 'جزر مارشال', 692),
(130, 'مارتينيك', 596),
(131, 'موريتانيا', 222),
(132, 'موريشيوس', 230),
(133, 'مايوت', 269),
(134, 'المكسيك', 52),
(135, 'مايكرونيزيا', 691),
(136, 'مولدافيا', 373),
(137, 'موناكو', 377),
(138, 'منغوليا', 976),
(139, 'مونتسيرات', 1664),
(140, 'المغرب', 212),
(141, 'موزمبيق', 258),
(142, 'ميانمار', 95),
(143, 'نامبيا', 264),
(144, 'نورو', 674),
(145, 'نيبال', 977),
(146, 'هولندا', 31),
(147, 'كاليدونيا الجديدة', 687),
(148, 'نيوزيلندا', 64),
(149, 'نيكاراجوا', 505),
(150, 'النيجر', 227),
(151, 'نيجيريا', 234),
(152, 'ني', 683),
(153, 'جزيرة نورفولك', 672),
(154, 'جزر ماريانا الشمالية', 1670),
(155, 'النرويج', 47),
(156, 'عمان', 968),
(157, 'باكستان', 92),
(158, 'بالاو', 680),
(159, 'فلسطين', 970),
(160, 'بنما', 507),
(161, 'بابوا غينيا الجديدة', 675),
(162, 'باراغواي', 595),
(163, 'بيرو', 51),
(164, 'الفلبين', 63),
(165, 'بيتكيرن', 0),
(166, 'بولندا', 48),
(167, 'البرتغال', 351),
(168, 'بورتو ريكو', 1787),
(169, 'قطر', 974),
(170, 'ريونيون', 262),
(171, 'رومانيا', 40),
(172, 'روسيا', 70),
(173, 'رواندا', 250),
(174, 'سانت كيتس ونيفس', 1869),
(175, 'سان بيير وميكلون', 508),
(176, 'سانت فنسنت وجزر غرينادين', 1784),
(177, 'ساموا', 684),
(178, 'سان مارينو', 378),
(179, 'ساو تومي وبرينسيبي', 239),
(180, 'المملكة العربية السعودية', 966),
(181, 'السنغال', 221),
(182, 'صربيا', 381),
(183, 'سيشيل', 248),
(184, 'سيراليون', 232),
(185, 'سنغافورة', 65),
(186, 'سلوفاكيا', 421),
(187, 'سلوفينيا', 386),
(188, 'جزر سليمان', 677),
(189, 'الصومال', 252),
(190, 'جنوب أفريقيا', 27),
(191, 'المنطقة القطبية الجنوبية', 0),
(192, 'جنوب السودان', 211),
(193, 'اسبانيا', 34),
(194, 'سريلانكا', 94),
(195, 'السودان', 249),
(196, 'سورينام', 597),
(197, 'سفالبارد ويان ماين', 47),
(198, 'سوازيلاند', 268),
(199, 'السويد', 46),
(200, 'سويسرا', 41),
(201, 'سوريا', 963),
(202, 'تايوان', 886),
(203, 'طاجكستان', 992),
(204, 'تنزانيا', 255),
(205, 'تايلاند', 66),
(206, 'توغو', 228),
(207, 'توكيلاو', 690),
(208, 'تونغا', 676),
(209, 'ترينداد و توباغو', 1868),
(210, 'تونس', 216),
(211, 'تركيا', 90),
(212, 'تركمنستان', 7370),
(213, 'جزر توركس وكايكوس', 1649),
(214, 'توفالو', 688),
(215, 'أوغندا', 256),
(216, 'أوكرانيا', 380),
(217, 'الإمارات العربية المتحدة', 971),
(218, 'المملكة المتحدة', 44),
(219, 'الولايات المتحدة الأمريكية', 1),
(220, 'أوروغواي', 598),
(221, 'أوزبكستان', 998),
(222, 'فانواتو', 678),
(223, 'فينزويلا', 58),
(224, 'فيتنام', 84),
(225, 'والس وفوتونا', 681),
(226, 'الصحراء الغربية', 212),
(227, 'اليمن', 967),
(228, 'يوغسلافيا', 38),
(229, 'زومبيا', 260),
(230, 'زيمبابوي', 263);


/* adding all cities in syria */
INSERT INTO `cities` (`city_id`, `city_name`, `city_code` ,`country_id`) VALUES
(1, 'دمشق', '011', 201),
(2, 'القنيطرة', '014', 201),
(3, 'درعا', '015', 201),
(4, 'السويداء', '016', 201),
(5, 'حلب', '021', 201),
(6, 'الرقة', '022', 201),
(7, 'ادلب', '023', 201),
(8, 'حمص', '031', 201),
(9, 'حماه', '033', 201),
(10, 'اللاذقية', '041', 201),
(11, 'طرطوس', '043', 201),
(12, 'دير الزور', '051', 201),
(13, 'الحسكة', '052', 201),
(14, 'القامشلي', '052', 201);


/* adding all states in damascus */
INSERT INTO `states` (`state_id`, `state_name`, `state_code`, `cities_city_id`) VALUES
(1, 'العمارة', '', 1),
(2, 'باب توما', '', 1),
(3, 'القيمرية', '', 1),
(4, 'الحميدية', '', 1),
(5, 'الحريقة', '', 1),
(6, 'شارع الأمين', '', 1),
(7, 'مأذنة الشحم', '', 1),
(8, 'الشاغور', '', 1),
(9, 'ساروجة', '', 1),
(10, 'العقيبة', '', 1),
(11, 'شارع الثورة', '', 1),
(12, 'شارع بغداد', '', 1),
(13, 'القصاع', '', 1),
(14, 'العدوي', '', 1),
(15, 'القصور', '', 1),
(16, 'شارع فارس خوري', '', 1),
(17, 'القنوات', '', 1),
(18, 'الحجاز', '', 1),
(19, 'البرامكة', '', 1),
(20, 'باب الجابية', '', 1),
(21, 'السويقة', '', 1),
(22, 'قبر عاتكة', '', 1),
(23, 'الشويكة', '', 1),
(24, 'المجتهد', '', 1),
(25, 'باب السريجة', '', 1),
(26, 'الفحامة', '', 1),
(27, 'جوبر', '', 1),
(28, 'الميدان', '', 1),
(29, 'الزاهرة القديمة', '', 1),
(30, 'الزاهرة الجديدة', '', 1),
(31, 'الحقلة', '', 1),
(32, 'الدقاق', '', 1),
(33, 'القاعة', '', 1),
(34, 'باب مصلى', '', 1),
(35, 'باب شرقي', '', 1),
(36, 'ابن عساكر', '', 1),
(37, 'حي الزهور', '', 1),
(38, 'التضامن', '', 1),
(39, 'دف الشوك', '', 1),
(40, 'القدم', '', 1),
(41, 'السيدة عائشة', '', 1),
(42, 'العسالي', '', 1),
(43, 'كفرسوسة', '', 1),
(44, 'الربوة', '', 1),
(45, 'الشيخ سعد', '', 1),
(46, 'فيلات غربية', '', 1),
(47, 'فيلات شرقية', '', 1),
(48, 'مزة 86', '', 1),
(49, 'مزة جبل', '', 1),
(50, 'دمر', '', 1),
(51, 'برزة البلد', '', 1),
(52, 'مساكن برزة', '', 1),
(53, 'عش الورور', '', 1),
(54, 'القابون', '', 1),
(55, 'ركن الدين', '', 1),
(56, 'الصالحية', '', 1),
(57, 'الشيخ محي الدين', '', 1),
(58, 'المزرعة', '', 1),
(59, 'المهاجرين', '', 1),
(60, 'أبو رمانة', '', 1),
(61, 'المالكي', '', 1),
(62, 'الروضة', '', 1),
(63, 'اليرموك', '', 1);


/* adding all specializations */
INSERT INTO `specializations` (`spec_id`, `name`) VALUES
(1, 'علاج الإدمان'),
(2, 'عمليات التجميل الغير جراحية'),
(3, 'جراحات البدانة'),
(4, 'زراعة نخاع العظام'),
(5, 'علاج السرطان'),
(6, 'أمراض القلب'),
(7, 'جراحات القلب'),
(8, 'جراحات التجميل'),
(9, 'العناية بالأسنان'),
(10, 'الأمراض الجلدية'),
(11, 'الغسيل الكلوي'),
(12, 'الأذن و الأنف و الحنجرة'),
(13, 'طب الطوارئ'),
(14, 'طب الغدد الصم'),
(15, 'أمراض العين و جراحتها'),
(16, 'طب الأسرة'),
(17, 'علاج العقم'),
(18, 'أمراض الجهاز الهضمي'),
(19, 'زراعة الشعر'),
(20, 'أمراض الدم'),
(21, 'أمراض الكلى'),
(22, 'الفحوصات الطبية'),
(23, 'الأمراض العصبية'),
(24, 'جراحة المخ و الأعصاب'),
(25, 'أمراض النساء و التوليد'),
(26, 'جراحة العظام'),
(27, 'طب الأطفال'),
(28, 'الطب النفسي'),
(29, 'أمراض الجهاز التنفسي'),
(30, 'أمراض الروماتيزم'),
(31, 'الطب الرياضي'),
(32, 'العلاج بالخلايا الجذعية'),
(33, 'جراحة المسالك البولية'),
(34, 'جراحة الأوعية الدموية'),
(35, 'المعالجة الفيزيائية');



select * from roles;
select * from permissions;
select * from permissions_roles;
select * from users;
select * from permissions_roles where role_id = 2 and permission_id = 1;
