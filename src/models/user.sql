CREATE SEQUENCE IF NOT EXISTS public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE IF NOT EXISTS public.users (
    id integer NOT NULL DEFAULT nextval('public.users_id_seq'::regclass),
    company_id integer,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    role character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT role_check CHECK (role::text = ANY (
        ARRAY['seller', 'buyer_admin', 'employee', 'support']
    )),
    CONSTRAINT users_company_id_fkey FOREIGN KEY (company_id)
        REFERENCES public.companies(id) ON DELETE SET NULL
);

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
ALTER TABLE public.users OWNER TO postgres;
ALTER SEQUENCE public.users_id_seq OWNER TO postgres;