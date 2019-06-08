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
-- Table `health_tourism`.`images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `health_tourism`.`images` (
  `image_id` INT(11) NOT NULL AUTO_INCREMENT,
  `image_path` VARCHAR(255) NULL DEFAULT NULL,
  `image_type` TINYINT(4) NULL DEFAULT NULL,
  `clinics_id` INT(11) NOT NULL,
  `travel_agency_id` INT(11) NOT NULL,
  PRIMARY KEY (`image_id`),
  INDEX `fk_images_clinics1_idx` (`clinics_id` ASC) VISIBLE,
  INDEX `fk_images_travel_agency1_idx` (`travel_agency_id` ASC) VISIBLE,
  CONSTRAINT `fk_images_clinics1`
    FOREIGN KEY (`clinics_id`)
    REFERENCES `health_tourism`.`clinics` (`id`),
  CONSTRAINT `fk_images_travel_agency1`
    FOREIGN KEY (`travel_agency_id`)
    REFERENCES `health_tourism`.`travel_agency` (`id`))
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
