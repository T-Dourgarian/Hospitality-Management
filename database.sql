CREATE TABLE IF NOT EXISTS public.additional
(
    id integer NOT NULL DEFAULT nextval('additional_id_seq'::regclass),
    reservation_id integer,
    additional_type_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    end_date timestamp without time zone,
    start_date timestamp without time zone,
    price_actual money,
    CONSTRAINT additional_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.additional_type
(
    id integer NOT NULL DEFAULT nextval('additional_type_id_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    name_short character varying(10) COLLATE pg_catalog."default",
    description character varying(500) COLLATE pg_catalog."default" NOT NULL,
    property_id integer NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    rate double precision,
    for_every_night boolean DEFAULT false,
    CONSTRAINT additional_type_pkey PRIMARY KEY (id),
    CONSTRAINT additional_type_name_key UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS public.guest
(
    id integer NOT NULL DEFAULT nextval('guest_id_seq'::regclass),
    first_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(10) COLLATE pg_catalog."default",
    street_address character varying(500) COLLATE pg_catalog."default" NOT NULL,
    city character varying(500) COLLATE pg_catalog."default" NOT NULL,
    state character varying(500) COLLATE pg_catalog."default" NOT NULL,
    zip_code character varying(500) COLLATE pg_catalog."default" NOT NULL,
    email character varying(500) COLLATE pg_catalog."default" NOT NULL,
    phone_number character varying(500) COLLATE pg_catalog."default" NOT NULL,
    property_id integer NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT guest_pkey PRIMARY KEY (id),
    CONSTRAINT guest_firstname_key UNIQUE (first_name)
);

CREATE TABLE IF NOT EXISTS public.invoice
(
    id integer NOT NULL DEFAULT nextval('invoice_id_seq'::regclass),
    reservation_id integer,
    guest_id integer,
    total numeric(10, 2),
    amount_paid numeric(10, 2) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    property_id integer,
    invoice_type_id integer,
    CONSTRAINT invoice_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.invoice_type
(
    id integer NOT NULL DEFAULT nextval('invoice_type_id_seq'::regclass),
    type character varying(50) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    property_id integer,
    CONSTRAINT invoice_type_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.note
(
    id integer NOT NULL DEFAULT nextval('note_id_seq'::regclass),
    reservation_id integer NOT NULL,
    text character varying(500) COLLATE pg_catalog."default" NOT NULL,
    property_id integer NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT note_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.property
(
    id integer NOT NULL DEFAULT nextval('property_id_seq'::regclass),
    name character varying(150) COLLATE pg_catalog."default" NOT NULL,
    street_address character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    city character varying COLLATE pg_catalog."default" NOT NULL,
    state character varying(120) COLLATE pg_catalog."default" NOT NULL,
    zip_code character varying COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    CONSTRAINT property_pkey PRIMARY KEY (id),
    CONSTRAINT property_name_key UNIQUE (name),
    CONSTRAINT property_state_key UNIQUE (state)
);

CREATE TABLE IF NOT EXISTS public.reservation
(
    id integer NOT NULL DEFAULT nextval('reservation_id_seq'::regclass),
    guest_id integer,
    check_in date NOT NULL,
    check_out date,
    rate money,
    room_id integer,
    property_id integer NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    cancelled boolean DEFAULT false,
    notes character varying(600) COLLATE pg_catalog."default",
    room_type_id integer,
    num_of_nights integer,
    status status DEFAULT 'reserved'::status,
    dnm boolean DEFAULT false,
    checked_in_at time without time zone,
    checked_out_at time without time zone,
    adults integer DEFAULT 1,
    kids integer DEFAULT 0,
    CONSTRAINT reservation_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.room
(
    id integer NOT NULL DEFAULT nextval('room_id_seq'::regclass),
    room_type_id integer,
    "number" integer NOT NULL,
    name character varying(50) COLLATE pg_catalog."default",
    property_id integer NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    status_type_id integer,
    vacant boolean DEFAULT false,
    reservation_id integer,
    guest_id integer,
    inventory_status inventory_status DEFAULT 'available'::inventory_status,
    CONSTRAINT room_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.room_status_type
(
    id integer NOT NULL DEFAULT nextval('room_status_type_id_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    name_short character varying(10) COLLATE pg_catalog."default",
    description character varying(500) COLLATE pg_catalog."default" NOT NULL,
    property_id integer NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT room_status_type_pkey PRIMARY KEY (id),
    CONSTRAINT room_status_type_name_key UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS public.room_type
(
    id integer NOT NULL DEFAULT nextval('room_type_id_seq'::regclass),
    name character varying(150) COLLATE pg_catalog."default" NOT NULL,
    name_short character varying(10) COLLATE pg_catalog."default" NOT NULL,
    description character varying(500) COLLATE pg_catalog."default" NOT NULL,
    property_id integer NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT room_type_pkey PRIMARY KEY (id),
    CONSTRAINT room_type_name_key UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS public.tag
(
    id integer NOT NULL DEFAULT nextval('tag_id_seq'::regclass),
    tag_type_id integer,
    room_id integer,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT tag_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.tag_type
(
    id integer NOT NULL DEFAULT nextval('tag_type_id_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    name_short character varying(10) COLLATE pg_catalog."default",
    description character varying(500) COLLATE pg_catalog."default" NOT NULL,
    property_id integer NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tag_type_pkey PRIMARY KEY (id),
    CONSTRAINT tag_type_name_key UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS public.txns
(
    id integer NOT NULL DEFAULT nextval('txns_id_seq'::regclass),
    reservation_id integer NOT NULL,
    txns_type_id integer NOT NULL,
    amount integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    invoice_id integer,
    CONSTRAINT txns_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.txns_type
(
    id integer NOT NULL DEFAULT nextval('txns_type_id_seq'::regclass),
    type character varying(50) COLLATE pg_catalog."default" NOT NULL,
    property_id integer NOT NULL,
    tax_exempt boolean DEFAULT false,
    CONSTRAINT txns_type_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."user"
(
    id integer NOT NULL DEFAULT nextval('user_id_seq'::regclass),
    first_name character varying(150) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    username character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying(120) COLLATE pg_catalog."default" NOT NULL,
    property_id integer NOT NULL,
    CONSTRAINT user_pkey PRIMARY KEY (id)
);