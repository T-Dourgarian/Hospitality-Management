CREATE TABLE "property" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR (150) UNIQUE NOT NULL,
    "street_address" VARCHAR (1000) NOT NULL,
    "city" VARCHAR NOT NULL,
    "state" VARCHAR (120) UNIQUE NOT NULL,
    "zip_code" VARCHAR NOT NULL
	"created_by" int references "user"
	"created_at" TIMESTAMP SET DEFAULT now()
); 

CREATE TABLE "room_type" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR (150) UNIQUE NOT NULL,
    "name_short" VARCHAR (10) NOT NULL,
    "description" VARCHAR (500) NOT NULL,
	"property_id" int references "property" NOT NULL,
	"created_by" int references "user" NOT NULL,
	"created_at" TIMESTAMP SET DEFAULT now()
); 


CREATE TABLE "room_status_type" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR (50) UNIQUE NOT NULL,
    "name_short" VARCHAR (10),
    "description" VARCHAR (500) NOT NULL,
	"property_id" int references "property" NOT NULL,
	"created_by" int references "user" NOT NULL,
	"created_at" TIMESTAMP SET DEFAULT now()
); 

CREATE TABLE "tag_type" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR (50) UNIQUE NOT NULL,
    "name_short" VARCHAR (10),
    "description" VARCHAR (500) NOT NULL,
	"property_id" int references "property" NOT NULL,
	"created_by" int references "user" NOT NULL,
	"created_at" TIMESTAMP SET DEFAULT now()
); 

CREATE TABLE "guest" (
    "id" SERIAL PRIMARY KEY,
    "firstname" VARCHAR (50) UNIQUE NOT NULL,
    "lastname" VARCHAR (10),
    "street_address" VARCHAR (500) NOT NULL,
	"city" VARCHAR (500) NOT NULL,
	"state" VARCHAR (500) NOT NULL,
	"zip_code" VARCHAR (500) NOT NULL,
	"email" VARCHAR (500) NOT NULL,
	"phone_number" VARCHAR (500) NOT NULL,
	"property_id" int references "property" NOT NULL,
	"created_by" int references "user" NOT NULL,
	"created_at" TIMESTAMP SET DEFAULT now()
); 

CREATE TABLE "additional_type" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR (50) UNIQUE NOT NULL,
    "name_short" VARCHAR (10),
    "description" VARCHAR (500) NOT NULL,
	"property_id" int references "property" NOT NULL,
	"created_by" int references "user" NOT NULL,
	"created_at" TIMESTAMP SET DEFAULT now()
); 

CREATE TABLE "reservation" (
    "id" SERIAL PRIMARY KEY,
	"guest_id" int references guest,
    "check_in" TIMESTAMP NOT NULL,
    "check_out" VARCHAR (10),
	"rate" money,
    "room_id" int references "room",
	"property_id" int references "property" NOT NULL,
	"created_by" int references "user" NOT NULL,
	"created_at" TIMESTAMP SET DEFAULT now()
); 

CREATE TABLE "room" (
    "id" SERIAL PRIMARY KEY,
    "room_type_id" INT references "room_type",
	"number" int NOT NULL,
	"name" varchar (50),
	"property_id" int references "property" NOT NULL,
	"created_by" int references "user" NOT NULL,
	"created_at" TIMESTAMP SET DEFAULT now()
); 

CREATE TABLE "tag" (
    "id" SERIAL PRIMARY KEY,
    "tag_type_id" INT references "tag_type",
	"room_id" INT references "room",
	"created_by" int references "user" NOT NULL,
	"created_at" TIMESTAMP SET DEFAULT now()
); 

CREATE TABLE "additional" (
    "id" SERIAL PRIMARY KEY,
	"reservation_id" INT references "reservation",
	"additional_type_id" int references "additional_type" NOT NULL,
	"created_at" TIMESTAMP SET DEFAULT now()
); 
