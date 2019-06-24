

-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema test
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema test
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `test` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `test` ;

-- -----------------------------------------------------
-- Table `test`.`countries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`countries` (
  `country_id` INT(11) NOT NULL,
  `country_name` VARCHAR(45) NOT NULL,
  `country_code` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`country_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`cities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`cities` (
  `city_id` INT(11) NOT NULL,
  `city_name` VARCHAR(255) NOT NULL,
  `city_code` VARCHAR(255) NULL DEFAULT NULL,
  `country_id` INT(11) NOT NULL,
  PRIMARY KEY (`city_id`),
  INDEX `fk_cities_countries1_idx` (`country_id` ASC) VISIBLE,
  CONSTRAINT `fk_cities_countries1`
    FOREIGN KEY (`country_id`)
    REFERENCES `test`.`countries` (`country_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`states`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`states` (
  `state_id` INT(11) NOT NULL,
  `state_name` VARCHAR(255) NULL DEFAULT NULL,
  `state_code` VARCHAR(255) NULL DEFAULT NULL,
  `statescol` VARCHAR(45) NULL DEFAULT NULL,
  `cities_city_id` INT(11) NOT NULL,
  PRIMARY KEY (`state_id`),
  INDEX `fk_states_cities1_idx` (`cities_city_id` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`locations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`locations` (
  `location_id` INT(11) NOT NULL AUTO_INCREMENT,
  `longitude` DECIMAL(25,15) NOT NULL,
  `latitude` DECIMAL(25,15) NOT NULL,
  `country_id` INT(11) NOT NULL,
  `city_id` INT(11) NOT NULL,
  `state_id` INT(11) NOT NULL,
  PRIMARY KEY (`location_id`),
  INDEX `fk_locations_countries1_idx` (`country_id` ASC) VISIBLE,
  INDEX `fk_locations_cities1_idx` (`city_id` ASC) VISIBLE,
  INDEX `fk_locations_states1_idx` (`state_id` ASC) VISIBLE,
  CONSTRAINT `fk_locations_cities1`
    FOREIGN KEY (`city_id`)
    REFERENCES `test`.`cities` (`city_id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_locations_countries1`
    FOREIGN KEY (`country_id`)
    REFERENCES `test`.`countries` (`country_id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_locations_states1`
    FOREIGN KEY (`state_id`)
    REFERENCES `test`.`states` (`state_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 139
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`roles` (
  `role_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`role_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `gender` VARCHAR(12) NOT NULL,
  `birthday` DATETIME NOT NULL,
  `user_name` VARCHAR(255) NULL DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  `role_id` INT(11) NOT NULL,
  `mobile_number` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_users_roles1_idx` (`role_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_roles1`
    FOREIGN KEY (`role_id`)
    REFERENCES `test`.`roles` (`role_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 17
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`clinics`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`clinics` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `status` VARCHAR(45) NULL DEFAULT 'pending',
  `description` TEXT NULL DEFAULT NULL,
  `address` TEXT NULL DEFAULT NULL,
  `mobile_number` VARCHAR(255) NULL DEFAULT NULL,
  `phone_number` VARCHAR(255) NULL DEFAULT NULL,
  `user_id` INT(11) NOT NULL,
  `location_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_clinics_users1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_clinic_location_id_idx` (`location_id` ASC) VISIBLE,
  CONSTRAINT `fk_clinic_location_id`
    FOREIGN KEY (`location_id`)
    REFERENCES `test`.`locations` (`location_id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_clinics_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `test`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 87
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`travel_agency`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`travel_agency` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `map` VARCHAR(100) NOT NULL,
  `users_id` INT(11) NOT NULL,
  `status` VARCHAR(45) NOT NULL DEFAULT 'waiting',
  `location_id` INT(11) NOT NULL,
  `description` LONGTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_travel_agency_users1_idx` (`users_id` ASC) VISIBLE,
  INDEX `fk_location_location_id_idx` (`location_id` ASC) VISIBLE,
  CONSTRAINT `fk_travel_agency_location`
    FOREIGN KEY (`location_id`)
    REFERENCES `test`.`locations` (`location_id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_travel_agency_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `test`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 135
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`applications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`applications` (
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
    REFERENCES `test`.`clinics` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_applications_travel_agency1`
    FOREIGN KEY (`travel_agency_id`)
    REFERENCES `test`.`travel_agency` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_applications_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `test`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`appointements`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`appointements` (
  `id` INT(11) NOT NULL,
  `clinics_id` INT(11) NOT NULL,
  `users_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_appointements_clinics1_idx` (`clinics_id` ASC) VISIBLE,
  INDEX `fk_appointements_users1_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_appointements_clinics1`
    FOREIGN KEY (`clinics_id`)
    REFERENCES `test`.`clinics` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_appointements_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `test`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`currency`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`currency` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL DEFAULT NULL,
  `code` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 168
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`clinic_currency_travel_agency`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`clinic_currency_travel_agency` (
  `clinic_currency_travel_agency_id` INT(11) NOT NULL AUTO_INCREMENT,
  `currency_id` INT(11) NOT NULL,
  `clinics_id` INT(11) NULL DEFAULT NULL,
  `travel_agency_id` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`clinic_currency_travel_agency_id`),
  INDEX `fk_clinic_currency_travel_agency_clinics1_idx` (`clinics_id` ASC) VISIBLE,
  INDEX `fk_clinic_currency_travel_agency_travel_agency1_idx` (`travel_agency_id` ASC) VISIBLE,
  INDEX `fk_clinic_currency_travel_agency_currency1_idx` (`currency_id` ASC) VISIBLE,
  CONSTRAINT `fk_clinic_currency_travel_agency_clinics1`
    FOREIGN KEY (`clinics_id`)
    REFERENCES `test`.`clinics` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_clinic_currency_travel_agency_currency1`
    FOREIGN KEY (`currency_id`)
    REFERENCES `test`.`currency` (`id`),
  CONSTRAINT `fk_clinic_currency_travel_agency_travel_agency1`
    FOREIGN KEY (`travel_agency_id`)
    REFERENCES `test`.`travel_agency` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 93
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`doctors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`doctors` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `gender` VARCHAR(255) NOT NULL,
  `image_name` VARCHAR(255) NULL DEFAULT NULL,
  `phone_number` VARCHAR(255) NULL DEFAULT NULL,
  `mobile_number` VARCHAR(255) NULL DEFAULT NULL,
  `clinic_id` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_doctors_clinics1_idx` (`clinic_id` ASC) VISIBLE,
  CONSTRAINT `fk_doctors_clinics1`
    FOREIGN KEY (`clinic_id`)
    REFERENCES `test`.`clinics` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 42
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`clinics_doctors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`clinics_doctors` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `clinic_id` INT(11) NOT NULL,
  `doctor_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_clinics_doctors_clinics1_idx` (`clinic_id` ASC) VISIBLE,
  INDEX `fk_clinics_doctors_doctors1_idx` (`doctor_id` ASC) VISIBLE,
  CONSTRAINT `fk_clinics_doctors_clinics1`
    FOREIGN KEY (`clinic_id`)
    REFERENCES `test`.`clinics` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_clinics_doctors_doctors1`
    FOREIGN KEY (`doctor_id`)
    REFERENCES `test`.`doctors` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`specializations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`specializations` (
  `spec_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`spec_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 36
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`procedures`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`procedures` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `specializations_spec_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_procedures_specializations1_idx` (`specializations_spec_id` ASC) VISIBLE,
  CONSTRAINT `fk_procedures_specializations1`
    FOREIGN KEY (`specializations_spec_id`)
    REFERENCES `test`.`specializations` (`spec_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 2283
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`clinics_procedures`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`clinics_procedures` (
  `clinics_procedures_id` INT(11) NOT NULL,
  `clinic_id` INT(11) NOT NULL,
  `procedure_id` INT(11) NOT NULL,
  PRIMARY KEY (`clinics_procedures_id`),
  INDEX `fk_clinics_has_procedures_procedures1_idx` (`procedure_id` ASC) VISIBLE,
  INDEX `fk_clinics_has_procedures_clinics1_idx` (`clinic_id` ASC) VISIBLE,
  CONSTRAINT `fk_clinics_has_procedures_clinics1`
    FOREIGN KEY (`clinic_id`)
    REFERENCES `test`.`clinics` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_clinics_has_procedures_procedures1`
    FOREIGN KEY (`procedure_id`)
    REFERENCES `test`.`procedures` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`experinces`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`experinces` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `experince_name` VARCHAR(255) NOT NULL,
  `organization_name` VARCHAR(255) NOT NULL,
  `from` DATETIME NULL DEFAULT NULL,
  `to` DATETIME NULL DEFAULT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `doctor_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_experinces_doctors1_idx` (`doctor_id` ASC) VISIBLE,
  CONSTRAINT `fk_experinces_doctors1`
    FOREIGN KEY (`doctor_id`)
    REFERENCES `test`.`doctors` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 28
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`hotels`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`hotels` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `price` INT(11) NOT NULL,
  `mobile_number` VARCHAR(255) NULL,
  `emai` VARCHAR(255) NULL,
  `description` LONGTEXT NULL,
  `evaluation` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`trips`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`trips` (
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
    REFERENCES `test`.`travel_agency` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`images` (
  `image_id` INT(11) NOT NULL AUTO_INCREMENT,
  `image_name` VARCHAR(255) NULL DEFAULT NULL,
  `clinics_id` INT(11) NULL DEFAULT NULL,
  `travel_agency_id` INT(11) NULL DEFAULT NULL,
  `procedures_id` INT(11) NULL DEFAULT NULL,
  `trips_id` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`image_id`),
  INDEX `fk_images_clinics1_idx` (`clinics_id` ASC) VISIBLE,
  INDEX `fk_images_travel_agency1_idx` (`travel_agency_id` ASC) VISIBLE,
  INDEX `fk_images_procedures1_idx` (`procedures_id` ASC) VISIBLE,
  INDEX `fk_images_trips1_idx` (`trips_id` ASC) VISIBLE,
  CONSTRAINT `fk_images_clinics1`
    FOREIGN KEY (`clinics_id`)
    REFERENCES `test`.`clinics` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_images_procedures1`
    FOREIGN KEY (`procedures_id`)
    REFERENCES `test`.`procedures` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_images_travel_agency1`
    FOREIGN KEY (`travel_agency_id`)
    REFERENCES `test`.`travel_agency` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_images_trips1`
    FOREIGN KEY (`trips_id`)
    REFERENCES `test`.`trips` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 255
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`mumbers_trips`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`mumbers_trips` (
  `user_trip_id` INT(11) NOT NULL AUTO_INCREMENT,
  `users_id` INT(11) NOT NULL,
  `trips_id` INT(11) NOT NULL,
  PRIMARY KEY (`user_trip_id`),
  INDEX `fk_users_has_trips_trips1_idx` (`trips_id` ASC) VISIBLE,
  INDEX `fk_users_has_trips_users1_idx` (`users_id` ASC, `user_trip_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_has_trips_trips1`
    FOREIGN KEY (`trips_id`)
    REFERENCES `test`.`trips` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_users_has_trips_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `test`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`permissions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`permissions` (
  `permission_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `createdAt` VARCHAR(255) NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`permission_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`permissions_roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`permissions_roles` (
  `permissions_roles_id` INT(11) NOT NULL AUTO_INCREMENT,
  `permission_id` INT(11) NOT NULL,
  `role_id` INT(11) NOT NULL,
  PRIMARY KEY (`permissions_roles_id`),
  INDEX `fk_permissions_roles_permissions1_idx` (`permission_id` ASC) VISIBLE,
  INDEX `fk_permissions_roles_roles1_idx` (`role_id` ASC) VISIBLE,
  CONSTRAINT `fk_permissions_roles_permissions1`
    FOREIGN KEY (`permission_id`)
    REFERENCES `test`.`permissions` (`permission_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_permissions_roles_roles1`
    FOREIGN KEY (`role_id`)
    REFERENCES `test`.`roles` (`role_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 44
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`specializations_clinics`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`specializations_clinics` (
  `specializations_clinics_id` INT(11) NOT NULL AUTO_INCREMENT,
  `specialization_id` INT(11) NOT NULL,
  `clinic_id` INT(11) NOT NULL,
  `is_primary` TINYINT(4) NULL DEFAULT NULL,
  PRIMARY KEY (`specializations_clinics_id`),
  INDEX `fk_specializations_clinics_specializations1_idx` (`specialization_id` ASC) VISIBLE,
  INDEX `fk_specializations_clinics_clinics1_idx` (`clinic_id` ASC) VISIBLE,
  CONSTRAINT `fk_specializations_clinics_clinics1`
    FOREIGN KEY (`clinic_id`)
    REFERENCES `test`.`clinics` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_specializations_clinics_specializations1`
    FOREIGN KEY (`specialization_id`)
    REFERENCES `test`.`specializations` (`spec_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 341
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`proc_spec_clinic`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`proc_spec_clinic` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `proc_id` INT(11) NOT NULL,
  `spec_clinic_id` INT(11) NOT NULL,
  `min_price` FLOAT NULL DEFAULT NULL,
  `max_price` FLOAT NULL DEFAULT NULL,
  `duration` INT(11) NULL DEFAULT NULL,
  `num_visits` FLOAT NULL DEFAULT NULL,
  `bookable` TINYINT(1) NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `img1` TEXT NULL DEFAULT NULL,
  `img2` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `proc_id` (`proc_id` ASC) VISIBLE,
  INDEX `spec_clinic_id` (`spec_clinic_id` ASC) VISIBLE,
  CONSTRAINT `proc_spec_clinic_ibfk_1`
    FOREIGN KEY (`proc_id`)
    REFERENCES `test`.`procedures` (`id`),
  CONSTRAINT `proc_spec_clinic_ibfk_2`
    FOREIGN KEY (`spec_clinic_id`)
    REFERENCES `test`.`specializations_clinics` (`specializations_clinics_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`reviews`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`reviews` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
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
    REFERENCES `test`.`clinics` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_travel_agency1`
    FOREIGN KEY (`travel_agency_id`)
    REFERENCES `test`.`travel_agency` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `test`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`travel_agency_clinics`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`travel_agency_clinics` (
  `travel_agency_clinics_id` INT(11) NOT NULL,
  `travel_agency_id` INT(11) NOT NULL,
  `clinic_id` INT(11) NOT NULL,
  PRIMARY KEY (`travel_agency_clinics_id`),
  INDEX `fk_travel_agency_has_clinics_clinics1_idx` (`clinic_id` ASC) VISIBLE,
  INDEX `fk_travel_agency_has_clinics_travel_agency1_idx` (`travel_agency_id` ASC) INVISIBLE,
  CONSTRAINT `fk_travel_agency_has_clinics_clinics1`
    FOREIGN KEY (`clinic_id`)
    REFERENCES `test`.`clinics` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_travel_agency_has_clinics_travel_agency1`
    FOREIGN KEY (`travel_agency_id`)
    REFERENCES `test`.`travel_agency` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `test`.`trips_hotels`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `test`.`trips_hotels` (
  `trips_hotels_id` INT(11) NOT NULL AUTO_INCREMENT,
  `trip_id` INT(11) NOT NULL,
  `hotel_id` INT(11) NOT NULL,
  PRIMARY KEY (`trips_hotels_id`),
  INDEX `fk_trips_has_hotels_hotels1_idx` (`hotel_id` ASC) VISIBLE,
  INDEX `fk_trips_has_hotels_trips1_idx` (`trip_id` ASC) VISIBLE,
  CONSTRAINT `fk_trips_has_hotels_hotels1`
    FOREIGN KEY (`hotel_id`)
    REFERENCES `test`.`hotels` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_trips_has_hotels_trips1`
    FOREIGN KEY (`trip_id`)
    REFERENCES `test`.`trips` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;













