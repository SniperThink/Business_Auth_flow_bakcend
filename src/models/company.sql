-- ========== 1. COMPANIES TABLE ==========
CREATE SEQUENCE IF NOT EXISTS public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



CREATE TABLE IF NOT EXISTS public.companies (
    id integer NOT NULL DEFAULT nextval('public.companies_id_seq'::regclass),
    plan_type character varying(50),
    max_users integer DEFAULT 5,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    business_name character varying(255),
    business_type character varying(50),         -- optional
    sector_industry character varying(255),      -- optional
    CONSTRAINT companies_pkey PRIMARY KEY (id)
);



ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;
ALTER TABLE public.companies OWNER TO postgres;
ALTER SEQUENCE public.companies_id_seq OWNER TO postgres;

-- Allow optional business_type & sector_industry (for delayed profile completion)
ALTER TABLE public.companies
  ALTER COLUMN business_type DROP NOT NULL,
  ALTER COLUMN sector_industry DROP NOT NULL;