DROP TABLE IF EXISTS public.pending_users CASCADE;

CREATE SEQUENCE IF NOT EXISTS public.pending_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.pending_users (
    id integer NOT NULL DEFAULT nextval('public.pending_users_id_seq'::regclass),
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    otp character varying(6) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    business_name character varying(100),
    CONSTRAINT pending_users_pkey PRIMARY KEY (id),
    CONSTRAINT pending_users_email_key UNIQUE (email)
);

ALTER SEQUENCE public.pending_users_id_seq OWNED BY public.pending_users.id;
ALTER TABLE public.pending_users OWNER TO postgres;
ALTER SEQUENCE public.pending_users_id_seq OWNER TO postgres;
