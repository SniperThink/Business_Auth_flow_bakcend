CREATE TABLE public.seller_users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    role character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.seller_users_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.seller_users_id_seq OWNED BY public.seller_users.id;

ALTER TABLE ONLY public.seller_users
    ALTER COLUMN id SET DEFAULT nextval('public.seller_users_id_seq'::regclass);

ALTER TABLE ONLY public.seller_users
    ADD CONSTRAINT seller_users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.seller_users
    ADD CONSTRAINT seller_users_email_key UNIQUE (email);

ALTER TABLE ONLY public.seller_users
    ADD CONSTRAINT seller_users_role_check CHECK (role::text = ANY (ARRAY['admin', 'sales', 'support']));
