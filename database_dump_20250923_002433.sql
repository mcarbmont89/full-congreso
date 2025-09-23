--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (63f4182)
-- Dumped by pg_dump version 16.9

-- Started on 2025-09-23 00:24:33 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.radio_episodes DROP CONSTRAINT IF EXISTS radio_episodes_program_id_fkey;
ALTER TABLE IF EXISTS ONLY public.news_tags DROP CONSTRAINT IF EXISTS news_tags_tag_id_fkey;
ALTER TABLE IF EXISTS ONLY public.news_tags DROP CONSTRAINT IF EXISTS news_tags_news_id_fkey;
ALTER TABLE IF EXISTS ONLY public.legislators DROP CONSTRAINT IF EXISTS legislators_parliamentary_group_id_fkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_parent_id_fkey;
DROP INDEX IF EXISTS public.idx_radio_navigation_active_order;
ALTER TABLE IF EXISTS ONLY public.video_news DROP CONSTRAINT IF EXISTS video_news_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.tags DROP CONSTRAINT IF EXISTS tags_slug_key;
ALTER TABLE IF EXISTS ONLY public.tags DROP CONSTRAINT IF EXISTS tags_pkey;
ALTER TABLE IF EXISTS ONLY public.tags DROP CONSTRAINT IF EXISTS tags_name_key;
ALTER TABLE IF EXISTS ONLY public.radio_programs DROP CONSTRAINT IF EXISTS radio_programs_pkey;
ALTER TABLE IF EXISTS ONLY public.radio_navigation DROP CONSTRAINT IF EXISTS radio_navigation_pkey;
ALTER TABLE IF EXISTS ONLY public.radio_episodes DROP CONSTRAINT IF EXISTS radio_episodes_pkey;
ALTER TABLE IF EXISTS ONLY public.programs DROP CONSTRAINT IF EXISTS programs_pkey;
ALTER TABLE IF EXISTS ONLY public.parliamentary_groups DROP CONSTRAINT IF EXISTS parliamentary_groups_pkey;
ALTER TABLE IF EXISTS ONLY public.organs DROP CONSTRAINT IF EXISTS organs_pkey;
ALTER TABLE IF EXISTS ONLY public.news_tags DROP CONSTRAINT IF EXISTS news_tags_pkey;
ALTER TABLE IF EXISTS ONLY public.news DROP CONSTRAINT IF EXISTS news_pkey;
ALTER TABLE IF EXISTS ONLY public.live_streams DROP CONSTRAINT IF EXISTS live_streams_pkey;
ALTER TABLE IF EXISTS ONLY public.legislators DROP CONSTRAINT IF EXISTS legislators_pkey;
ALTER TABLE IF EXISTS ONLY public.homepage_config DROP CONSTRAINT IF EXISTS homepage_config_section_key;
ALTER TABLE IF EXISTS ONLY public.homepage_config DROP CONSTRAINT IF EXISTS homepage_config_pkey;
ALTER TABLE IF EXISTS ONLY public.contact_messages DROP CONSTRAINT IF EXISTS contact_messages_pkey;
ALTER TABLE IF EXISTS ONLY public.channel_config DROP CONSTRAINT IF EXISTS channel_config_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_slug_key;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_name_key;
ALTER TABLE IF EXISTS public.video_news ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tags ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.radio_programs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.radio_episodes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.programs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.parliamentary_groups ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.organs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.news ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.live_streams ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.legislators ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.homepage_config ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.contact_messages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.channel_config ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categories ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.video_news_id_seq;
DROP TABLE IF EXISTS public.video_news;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.tags_id_seq;
DROP TABLE IF EXISTS public.tags;
DROP SEQUENCE IF EXISTS public.radio_programs_id_seq;
DROP TABLE IF EXISTS public.radio_programs;
DROP TABLE IF EXISTS public.radio_navigation;
DROP SEQUENCE IF EXISTS public.radio_episodes_id_seq;
DROP TABLE IF EXISTS public.radio_episodes;
DROP SEQUENCE IF EXISTS public.programs_id_seq;
DROP TABLE IF EXISTS public.programs;
DROP SEQUENCE IF EXISTS public.parliamentary_groups_id_seq;
DROP TABLE IF EXISTS public.parliamentary_groups;
DROP SEQUENCE IF EXISTS public.organs_id_seq;
DROP TABLE IF EXISTS public.organs;
DROP TABLE IF EXISTS public.news_tags;
DROP SEQUENCE IF EXISTS public.news_id_seq;
DROP TABLE IF EXISTS public.news;
DROP SEQUENCE IF EXISTS public.live_streams_id_seq;
DROP TABLE IF EXISTS public.live_streams;
DROP SEQUENCE IF EXISTS public.legislators_id_seq;
DROP TABLE IF EXISTS public.legislators;
DROP SEQUENCE IF EXISTS public.homepage_config_id_seq;
DROP TABLE IF EXISTS public.homepage_config;
DROP SEQUENCE IF EXISTS public.contact_messages_id_seq;
DROP TABLE IF EXISTS public.contact_messages;
DROP SEQUENCE IF EXISTS public.channel_config_id_seq;
DROP TABLE IF EXISTS public.channel_config;
DROP SEQUENCE IF EXISTS public.categories_id_seq;
DROP TABLE IF EXISTS public.categories;
-- *not* dropping schema, since initdb creates it
--
-- TOC entry 5 (class 2615 OID 40960)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- TOC entry 3563 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 40962)
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    parent_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 216 (class 1259 OID 40969)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3564 (class 0 OID 0)
-- Dependencies: 216
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 246 (class 1259 OID 49153)
-- Name: channel_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.channel_config (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    number character varying(10) NOT NULL,
    logo text,
    background_color character varying(7) NOT NULL,
    text_color character varying(7) DEFAULT '#ffffff'::character varying,
    transmisiones_link text NOT NULL,
    is_active boolean DEFAULT true,
    order_position integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 245 (class 1259 OID 49152)
-- Name: channel_config_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.channel_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3565 (class 0 OID 0)
-- Dependencies: 245
-- Name: channel_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.channel_config_id_seq OWNED BY public.channel_config.id;


--
-- TOC entry 217 (class 1259 OID 40970)
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_messages (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    subject character varying(255),
    message text NOT NULL,
    status character varying(20) DEFAULT 'new'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT contact_messages_status_check CHECK (((status)::text = ANY (ARRAY[('new'::character varying)::text, ('read'::character varying)::text, ('replied'::character varying)::text, ('archived'::character varying)::text])))
);


--
-- TOC entry 218 (class 1259 OID 40979)
-- Name: contact_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contact_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3566 (class 0 OID 0)
-- Dependencies: 218
-- Name: contact_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contact_messages_id_seq OWNED BY public.contact_messages.id;


--
-- TOC entry 219 (class 1259 OID 40980)
-- Name: homepage_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.homepage_config (
    id integer NOT NULL,
    section character varying(255) NOT NULL,
    title character varying(255),
    description text,
    background_image_url text,
    hero_image_url text,
    logo_url text,
    additional_images jsonb,
    config_data jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 220 (class 1259 OID 40988)
-- Name: homepage_config_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.homepage_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3567 (class 0 OID 0)
-- Dependencies: 220
-- Name: homepage_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.homepage_config_id_seq OWNED BY public.homepage_config.id;


--
-- TOC entry 221 (class 1259 OID 40989)
-- Name: legislators; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legislators (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    parliamentary_group_id integer,
    legislature character varying(50),
    state character varying(100),
    type character varying(100),
    gender character(1),
    status character varying(20) DEFAULT 'Activo'::character varying,
    image_url text,
    email character varying(255),
    biography text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT legislators_gender_check CHECK ((gender = ANY (ARRAY['M'::bpchar, 'F'::bpchar]))),
    CONSTRAINT legislators_status_check CHECK (((status)::text = ANY (ARRAY[('Activo'::character varying)::text, ('Inactivo'::character varying)::text, ('Licencia'::character varying)::text])))
);


--
-- TOC entry 222 (class 1259 OID 40999)
-- Name: legislators_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.legislators_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3568 (class 0 OID 0)
-- Dependencies: 222
-- Name: legislators_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.legislators_id_seq OWNED BY public.legislators.id;


--
-- TOC entry 223 (class 1259 OID 41000)
-- Name: live_streams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.live_streams (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    thumbnail_url text,
    stream_url text NOT NULL,
    is_live boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    channel character varying(10)
);


--
-- TOC entry 224 (class 1259 OID 41008)
-- Name: live_streams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.live_streams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3569 (class 0 OID 0)
-- Dependencies: 224
-- Name: live_streams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.live_streams_id_seq OWNED BY public.live_streams.id;


--
-- TOC entry 225 (class 1259 OID 41009)
-- Name: news; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    summary text,
    content text,
    image_url text,
    category character varying(100),
    published_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'published'::character varying,
    is_featured boolean DEFAULT false NOT NULL,
    featured_rank integer
);


--
-- TOC entry 226 (class 1259 OID 41018)
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3570 (class 0 OID 0)
-- Dependencies: 226
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- TOC entry 227 (class 1259 OID 41019)
-- Name: news_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news_tags (
    news_id integer NOT NULL,
    tag_id integer NOT NULL
);


--
-- TOC entry 228 (class 1259 OID 41022)
-- Name: organs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organs (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    image_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    url text
);


--
-- TOC entry 229 (class 1259 OID 41029)
-- Name: organs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.organs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3571 (class 0 OID 0)
-- Dependencies: 229
-- Name: organs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.organs_id_seq OWNED BY public.organs.id;


--
-- TOC entry 230 (class 1259 OID 41030)
-- Name: parliamentary_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parliamentary_groups (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    abbreviation character varying(10),
    image_url text,
    color_hex character varying(7),
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 231 (class 1259 OID 41037)
-- Name: parliamentary_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.parliamentary_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3572 (class 0 OID 0)
-- Dependencies: 231
-- Name: parliamentary_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.parliamentary_groups_id_seq OWNED BY public.parliamentary_groups.id;


--
-- TOC entry 232 (class 1259 OID 41038)
-- Name: programs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.programs (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    image_url text,
    order_index integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    url text
);


--
-- TOC entry 233 (class 1259 OID 41046)
-- Name: programs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3573 (class 0 OID 0)
-- Dependencies: 233
-- Name: programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.programs_id_seq OWNED BY public.programs.id;


--
-- TOC entry 234 (class 1259 OID 41047)
-- Name: radio_episodes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.radio_episodes (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    audio_url text NOT NULL,
    duration character varying(50),
    publish_date date,
    image_url text,
    program_id integer,
    published boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 235 (class 1259 OID 41055)
-- Name: radio_episodes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.radio_episodes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3574 (class 0 OID 0)
-- Dependencies: 235
-- Name: radio_episodes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.radio_episodes_id_seq OWNED BY public.radio_episodes.id;


--
-- TOC entry 236 (class 1259 OID 41056)
-- Name: radio_navigation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.radio_navigation (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    href character varying(255) NOT NULL,
    display_order integer DEFAULT 0,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 237 (class 1259 OID 41065)
-- Name: radio_programs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.radio_programs (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    image_url text,
    audio_url text,
    duration character varying(20),
    category character varying(50),
    host character varying(255),
    published_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'active'::character varying,
    latest_episode_title character varying(255),
    latest_episode_date character varying(100),
    latest_episode_duration character varying(50),
    latest_episode_description text,
    program_link text,
    episodes_link text,
    published boolean DEFAULT true,
    display_order integer DEFAULT 0,
    featured boolean DEFAULT false,
    CONSTRAINT radio_programs_status_check CHECK (((status)::text = ANY (ARRAY[('active'::character varying)::text, ('inactive'::character varying)::text, ('archived'::character varying)::text])))
);


--
-- TOC entry 238 (class 1259 OID 41077)
-- Name: radio_programs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.radio_programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3575 (class 0 OID 0)
-- Dependencies: 238
-- Name: radio_programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.radio_programs_id_seq OWNED BY public.radio_programs.id;


--
-- TOC entry 239 (class 1259 OID 41078)
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 240 (class 1259 OID 41084)
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3576 (class 0 OID 0)
-- Dependencies: 240
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- TOC entry 241 (class 1259 OID 41085)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'admin'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 242 (class 1259 OID 41092)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3577 (class 0 OID 0)
-- Dependencies: 242
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 243 (class 1259 OID 41093)
-- Name: video_news; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.video_news (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    video_url text NOT NULL,
    thumbnail_url text,
    category character varying(100),
    duration character varying(20),
    published_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'published'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT video_news_status_check CHECK (((status)::text = ANY (ARRAY[('draft'::character varying)::text, ('published'::character varying)::text, ('scheduled'::character varying)::text, ('archived'::character varying)::text])))
);


--
-- TOC entry 244 (class 1259 OID 41103)
-- Name: video_news_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.video_news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3578 (class 0 OID 0)
-- Dependencies: 244
-- Name: video_news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.video_news_id_seq OWNED BY public.video_news.id;


--
-- TOC entry 3258 (class 2604 OID 41104)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 3320 (class 2604 OID 49156)
-- Name: channel_config id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.channel_config ALTER COLUMN id SET DEFAULT nextval('public.channel_config_id_seq'::regclass);


--
-- TOC entry 3261 (class 2604 OID 41105)
-- Name: contact_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages ALTER COLUMN id SET DEFAULT nextval('public.contact_messages_id_seq'::regclass);


--
-- TOC entry 3265 (class 2604 OID 41106)
-- Name: homepage_config id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage_config ALTER COLUMN id SET DEFAULT nextval('public.homepage_config_id_seq'::regclass);


--
-- TOC entry 3269 (class 2604 OID 41107)
-- Name: legislators id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legislators ALTER COLUMN id SET DEFAULT nextval('public.legislators_id_seq'::regclass);


--
-- TOC entry 3273 (class 2604 OID 41108)
-- Name: live_streams id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.live_streams ALTER COLUMN id SET DEFAULT nextval('public.live_streams_id_seq'::regclass);


--
-- TOC entry 3277 (class 2604 OID 41109)
-- Name: news id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- TOC entry 3283 (class 2604 OID 41110)
-- Name: organs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organs ALTER COLUMN id SET DEFAULT nextval('public.organs_id_seq'::regclass);


--
-- TOC entry 3286 (class 2604 OID 41111)
-- Name: parliamentary_groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parliamentary_groups ALTER COLUMN id SET DEFAULT nextval('public.parliamentary_groups_id_seq'::regclass);


--
-- TOC entry 3289 (class 2604 OID 41112)
-- Name: programs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.programs ALTER COLUMN id SET DEFAULT nextval('public.programs_id_seq'::regclass);


--
-- TOC entry 3293 (class 2604 OID 41113)
-- Name: radio_episodes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.radio_episodes ALTER COLUMN id SET DEFAULT nextval('public.radio_episodes_id_seq'::regclass);


--
-- TOC entry 3301 (class 2604 OID 41114)
-- Name: radio_programs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.radio_programs ALTER COLUMN id SET DEFAULT nextval('public.radio_programs_id_seq'::regclass);


--
-- TOC entry 3308 (class 2604 OID 41115)
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- TOC entry 3310 (class 2604 OID 41116)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3315 (class 2604 OID 41117)
-- Name: video_news id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_news ALTER COLUMN id SET DEFAULT nextval('public.video_news_id_seq'::regclass);


--
-- TOC entry 3526 (class 0 OID 40962)
-- Dependencies: 215
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, slug, description, parent_id, created_at, updated_at) FROM stdin;
1	Foros y seminarios	foros-y-seminarios	Eventos y actividades académicas	\N	2025-07-11 23:53:23.257645	2025-07-11 23:53:23.257645
2	Reformas aprobadas	reformas-aprobadas	Reformas legislativas aprobadas	\N	2025-07-11 23:53:23.257645	2025-07-11 23:53:23.257645
3	Temas de actualidad	temas-de-actualidad	Noticias y temas de interés actual	\N	2025-07-11 23:53:23.257645	2025-07-11 23:53:23.257645
4	Trabajo en comisiones	trabajo-en-comisiones	Actividades de las comisiones legislativas	\N	2025-07-11 23:53:23.257645	2025-07-11 23:53:23.257645
5	Reformas en DOF	reformas-en-dof	Reformas publicadas en el Diario Oficial	\N	2025-07-11 23:53:23.257645	2025-07-11 23:53:23.257645
6	Trabajos en pleno	trabajos-en-pleno	Sesiones y trabajos del pleno	\N	2025-07-11 23:53:23.257645	2025-07-11 23:53:23.257645
\.


--
-- TOC entry 3557 (class 0 OID 49153)
-- Dependencies: 246
-- Data for Name: channel_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.channel_config (id, name, number, logo, background_color, text_color, transmisiones_link, is_active, order_position, created_at, updated_at) FROM stdin;
1	C+	45.1	/images/channel-c-logo.png	#4a4a4a	#ffffff	/transmisiones?stream=1	t	1	2025-09-18 00:16:04.179155	2025-09-18 00:16:04.179155
2	S+	45.2	/images/channel-g-logo.png	#b91c1c	#ffffff	/transmisiones?stream=3	t	2	2025-09-18 00:16:04.179155	2025-09-18 00:16:04.179155
3	D+	45.3	/images/channel-d-logo.png	#15803d	#ffffff	/transmisiones?stream=2	t	3	2025-09-18 00:16:04.179155	2025-09-18 00:16:04.179155
\.


--
-- TOC entry 3528 (class 0 OID 40970)
-- Dependencies: 217
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_messages (id, name, email, subject, message, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3530 (class 0 OID 40980)
-- Dependencies: 219
-- Data for Name: homepage_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.homepage_config (id, section, title, description, background_image_url, hero_image_url, logo_url, additional_images, config_data, is_active, created_at, updated_at) FROM stdin;
1	downloadApp	\N	\N	/images/descarga-app-nueva.png	/images/descarga-app-nueva.png	\N	\N	\N	t	2025-07-12 15:07:06.900188	2025-07-15 00:46:29.709976
2	liveSection	\N	\N	/uploads/general/a8043152-1b48-4376-a425-c90a3f8892b9.png	/images/fondo-menu-inicio.png	\N	\N	\N	t	2025-07-14 22:45:13.245637	2025-07-16 17:16:34.609662
7	xFeed	Feed de X (Twitter)	Muestra el feed de X en la sección de noticias	\N	\N	\N	\N	\N	f	2025-07-16 17:35:12.222278	2025-07-16 18:15:04.581825
\.


--
-- TOC entry 3532 (class 0 OID 40989)
-- Dependencies: 221
-- Data for Name: legislators; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.legislators (id, name, parliamentary_group_id, legislature, state, type, gender, status, image_url, email, biography, created_at, updated_at) FROM stdin;
1	Acosta Trujillo Juana	1	LXVI	Guanajuato	Diputado	F	Activo	/uploads/general/91b6996c-ae63-4e93-b2dc-c03d514dfb6c.jpeg	juana.acosta@diputados.gob.mx	Grupos de amistad \n- Grupo de amistad republica fransesa\n-Grupo de amistad Hungría \n	2025-07-17 17:50:29.798367	2025-07-17 17:53:11.725199
\.


--
-- TOC entry 3534 (class 0 OID 41000)
-- Dependencies: 223
-- Data for Name: live_streams; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.live_streams (id, title, thumbnail_url, stream_url, is_live, created_at, updated_at, channel) FROM stdin;
14	Foro Nacional para el Análisis y la Construcción de Iniciativas Legislativas en Materia de Justicia Social, Derechos Humanos y Participación Ciudadana. Legislación y participación integral de movilidad y transparencia social.	/uploads/transmisiones/ec4d2586-046a-4d34-b793-7644cb501652.png	https://ccstreaming.packet.mx/WebRTCAppEE/play.html?id=45.3_kd5oiNTTWO0gEOFc875423kf52&playOrder=hls	t	2025-07-14 23:10:38.93686	2025-07-14 23:10:38.93686	D+
13	test2	/uploads/transmisiones/6991b559-86b8-401a-a390-533b6005c832.png	https://ccstreaming.packet.mx/WebRTCAppEE/play.html?id=45.2_kd5oiNTTWO0gEOFc423456787er&playOrder=hls	t	2025-07-14 23:04:08.388192	2025-07-14 23:04:08.388192	D+
12	prueba	/uploads/transmisiones/f0f045a2-3e77-4f94-ab22-e8f68188dfe4.jpeg	https://ccstreaming.packet.mx/WebRTCAppEE/play.html?id=45.1_kd5oiNTTWO0gEOFc431277834&playOrder=hls	t	2025-07-14 22:51:14.309208	2025-07-14 22:51:14.309208	C+
\.


--
-- TOC entry 3536 (class 0 OID 41009)
-- Dependencies: 225
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.news (id, title, summary, content, image_url, category, published_at, created_at, updated_at, status, is_featured, featured_rank) FROM stdin;
29	Noticia de Prueba - Borrador	Esta es una noticia guardada como borrador para testing	Contenido completo de la noticia en borrador	/images/test.jpg	Temas de actualidad	2025-09-18 18:26:22.143465	2025-09-18 18:26:22.143465	2025-09-18 18:26:22.143465	draft	t	1
31	Noticia Publicada	Esta noticia ya está publicada	Contenido de noticia ya publicada	/images/test3.jpg	Relaciones Exteriores	2025-09-18 17:26:22.143465	2025-09-18 18:26:22.143465	2025-09-18 18:26:22.143465	published	t	0
30	Noticia Programada	Esta noticia está programada para publicar en 2 minutos	Contenido de noticia programada	/images/test2.jpg	Trabajo en comisiones	2025-09-18 18:28:22.143465	2025-09-18 18:26:22.143465	2025-09-18 18:26:22.143465	published	t	1
32	Noticia Destacada 3	Tercera noticia destacada	Contenido de la tercera noticia	/images/test1.jpg	Senado	2025-09-18 19:33:43.840105	2025-09-18 19:33:43.840105	2025-09-18 19:33:43.840105	published	t	2
33	Noticia Destacada 4	Cuarta noticia destacada	Contenido de la cuarta noticia	/images/test4.jpg	Cámara de Diputados	2025-09-18 19:33:43.840105	2025-09-18 19:33:43.840105	2025-09-18 19:33:43.840105	published	t	3
34	Noticia Destacada 5	Quinta noticia destacada	Contenido de la quinta noticia	/images/test5.jpg	Mesa Directiva	2025-09-18 19:33:43.840105	2025-09-18 19:33:43.840105	2025-09-18 19:33:43.840105	published	t	4
\.


--
-- TOC entry 3538 (class 0 OID 41019)
-- Dependencies: 227
-- Data for Name: news_tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.news_tags (news_id, tag_id) FROM stdin;
\.


--
-- TOC entry 3539 (class 0 OID 41022)
-- Dependencies: 228
-- Data for Name: organs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.organs (id, title, description, image_url, created_at, updated_at, url) FROM stdin;
3	Defensoría de Audiencias	Texto	/uploads/organs/67bff7fe-22c9-42c8-928e-18188363a562.png	2025-07-13 22:42:05.761747	2025-07-14 16:36:20.496356	https://www.canaldelcongreso.gob.mx/DefensorAudiencia/Defensor
1	Comisión Bicamaral	Texto	/uploads/organs/7a2c3c15-9ca0-4651-b68b-c63311f84105.png	2025-07-13 22:37:44.091464	2025-07-14 16:36:51.695052	https://dev2025.canaldelcongreso.gob.mx/
4	Consejo Consuntivo	Consejo Consuntivo	/uploads/organs/15ba68a6-ddd9-4fe6-b086-5a174df2e0e3.png	2025-07-14 16:30:01.747138	2025-07-14 16:38:28.861069	https://www.canaldelcongreso.gob.mx/ConsejoConsultivo/inicio
\.


--
-- TOC entry 3541 (class 0 OID 41030)
-- Dependencies: 230
-- Data for Name: parliamentary_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.parliamentary_groups (id, name, abbreviation, image_url, color_hex, description, created_at, updated_at) FROM stdin;
1	MORENA	MORENA	/uploads/organs/62cfe39a-2350-4749-865a-ce459bef79f4.png	#e54124	grupo parlamentario	2025-07-16 18:24:00.350204	2025-07-16 18:24:00.350204
2	Partido Acción Nacional	PAN		#0951e1	partido pan	2025-07-17 17:56:25.279676	2025-07-17 17:56:25.279676
3	Partido Verde Ecologista de Mexico	PVEM		#65d963	El partido verde	2025-07-17 17:58:32.972554	2025-07-17 17:58:32.972554
4	Partido del Trabajo	PT		#f0f415	el partido del trabajo	2025-07-17 17:59:31.104219	2025-07-17 17:59:31.104219
5	Movimiento Ciudadano	MC		#f2aa0d	movimiento ciudadano	2025-07-17 18:01:02.728522	2025-07-17 18:01:02.728522
\.


--
-- TOC entry 3543 (class 0 OID 41038)
-- Dependencies: 232
-- Data for Name: programs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.programs (id, title, description, image_url, order_index, created_at, updated_at, url) FROM stdin;
7	Personalidades	Con Cesar Aldama	/uploads/general/4dfffb96-7347-4ad0-8699-f43802c2f1fb.png	5	2025-07-12 05:50:05.898585	2025-07-12 05:50:05.898585	https://www.youtube.com/watch?v=praNYCeB7AQ&list=PLuH8BWke2UzAd0_cc50724cQA45V_qjIq
8	La Primera Mujer	Documental	/uploads/general/0fd9ae8c-1537-4b06-a11d-3a4e50a90da0.png	6	2025-07-12 07:07:37.716723	2025-07-12 07:07:37.716723	https://www.youtube.com/watch?v=6mKnEQ1N_O8&list=PLuH8BWke2UzB8hGjA0otJgJO-CEG6qhXj&pp=0gcJCV8EOCosWNin
1	En la Banqueta	Con Paola Salinas	/uploads/general/49bccd7e-2d03-4139-82a2-b6d345ea5d07.jpeg	0	2025-07-12 05:44:52.701126	2025-07-12 05:44:52.701126	https://www.youtube.com/watch?v=GldH7G3kUiQ&list=PLuH8BWke2UzA-qdq4t1GiHoUoN_9Xa0Sx
2	La Visita Incómoda	Con Hernan Gómez	/uploads/general/dbf81618-8873-4194-a54c-f876e5525983.png	1	2025-07-12 05:46:14.91492	2025-07-12 05:46:14.91492	https://www.youtube.com/watch?v=AR5rOH_466Y&list=PLuH8BWke2UzD2rbqKRnuaHc1mn38WwATK
5	Vivas libres y sin miedo	#sigamosvisibilizando	/uploads/general/c3008e62-ba96-444d-9774-d54217fa9f79.jpeg	3	2025-07-12 05:48:52.895424	2025-07-12 05:48:52.895424	https://www.youtube.com/watch?v=ftTuAB9rZUk&list=PLuH8BWke2UzDaVt9cUUgy2FeJAjXlNqLP
4	Cultura y Más	Arte	/uploads/general/3e7ec5b9-e5be-4c11-8a96-5918e9679233.png	7	2025-07-12 05:48:11.062654	2025-07-12 05:48:11.062654	https://www.youtube.com/playlist?list=PLuH8BWke2UzCtRDXeypAzylp7HhlliQ6r
9	Test de programación	Esta es una prueba de funcionalidad	/uploads/general/b40a75fb-30e5-43a8-b123-5551e7dd12dd.png	8	2025-07-14 23:56:39.65412	2025-07-14 23:56:39.65412	https://www.youtube.com/playlist?list=PLuH8BWke2UzCtRDXeypAzylp7HhlliQ6r
3	Quorum	La serie histórica del Canal del Congreso	/uploads/general/3f2a69a0-8be0-4611-989f-cd1515d6573a.png	2	2025-07-12 05:47:07.7804	2025-07-12 05:47:07.7804	https://www.youtube.com/watch?v=4ZSt5MZTFIQ&list=PLuH8BWke2UzD_fIcBeVQLXtaE_YGlz2_E
6	Mujeres Imprescindibles	Dialogos	/uploads/general/273e71f4-728e-40b0-9a9f-2e4821079686.png	4	2025-07-12 05:49:35.84156	2025-07-12 05:49:35.84156	https://www.youtube.com/watch?v=uSD7CsMZD7Q&list=PLuH8BWke2UzB7cx1qJruJNdNztr9GfNwZ
\.


--
-- TOC entry 3545 (class 0 OID 41047)
-- Dependencies: 234
-- Data for Name: radio_episodes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.radio_episodes (id, title, description, audio_url, duration, publish_date, image_url, program_id, published, created_at, updated_at) FROM stdin;
4	Sitio Abierto - Radio Congreso	Debate respecto al presupuesto 	/uploads/audio/59b85e13-5eb2-44b5-8fa0-76c0c0ddd09b.mp3	60MIN	2024-11-21	/uploads/radio/45b3af85-ef2e-4ff8-ad66-3787e0b30372.jpg	2	t	2025-07-15 00:41:29.67352	2025-07-15 01:40:25.586667
5	Noticias del Congreso Radio - 19 de Noviembre 2024	Noticias del Congreso Radio - 19 de Noviembre 2024	/uploads/audio/570ce8d4-8da4-44a1-8880-f8b457679441.mp3	60MIN	2024-11-19	/uploads/radio/faf85e6d-8f63-46bd-b2ee-ee9738e4505b.png	4	t	2025-07-15 02:03:03.904023	2025-07-15 02:03:03.904023
6	Ultimo Episodio de Sitio Abierto	Lo más reciente	/uploads/audio/41cda5b9-e80d-41b7-8758-840426d46f7f.mp3	15MIN	2025-07-15	/uploads/radio/0ad96ac4-0110-4954-8396-aace534effbd.png	2	t	2025-07-15 17:39:54.372498	2025-07-15 17:39:54.372498
7	Radio congreso	Episodio de Noticias del Congreso Radio	/uploads/audio/618faaee-0e78-4257-9c3c-bd654739ef45.mp3	30MIN	2025-07-15	/uploads/general/11bcb3d6-0120-4d55-a2b0-b81cefddf081.png	4	t	2025-07-15 17:44:21.644257	2025-07-15 17:44:21.644257
8	Nueva Noticia	Episodio de Nuevo Progrrama de Noticias	/uploads/audio/866fd17c-74c2-488c-bb11-68da43308571.mp3	30MIN	2025-07-14	/uploads/general/0f3b9f28-6dc5-4eaa-baaf-d5f7e4fb00c7.png	5	t	2025-07-15 17:44:22.065023	2025-07-15 17:44:22.065023
\.


--
-- TOC entry 3547 (class 0 OID 41056)
-- Dependencies: 236
-- Data for Name: radio_navigation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.radio_navigation (id, name, href, display_order, active, created_at, updated_at) FROM stdin;
toma-tribuna	Toma Tribuna	/radio/toma-tribuna	0	f	2025-07-12 21:52:00.725646	2025-07-12 21:52:00.725646
entrevistas	Entrevistas	/radio/entrevistas	1	f	2025-07-12 21:52:00.747665	2025-07-12 21:54:20.049911
sitio-abierto	Sitio Abierto	/radio/sitio-abierto	2	f	2025-07-12 21:52:00.768298	2025-07-12 21:54:20.049911
noticias-congreso	Noticias del Congreso	/radio/noticias-congreso	3	t	2025-07-12 21:52:00.789424	2025-07-12 22:00:49.008211
nav-1752357283395	Un programa	/radio	1	t	2025-07-12 21:55:01.17694	2025-07-12 22:00:49.008211
\.


--
-- TOC entry 3548 (class 0 OID 41065)
-- Dependencies: 237
-- Data for Name: radio_programs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.radio_programs (id, title, description, image_url, audio_url, duration, category, host, published_at, created_at, updated_at, status, latest_episode_title, latest_episode_date, latest_episode_duration, latest_episode_description, program_link, episodes_link, published, display_order, featured) FROM stdin;
5	Nuevo Progrrama de Noticias	Las noticas en 5 minutos	/uploads/general/0f3b9f28-6dc5-4eaa-baaf-d5f7e4fb00c7.png	\N	\N	General	\N	\N	2025-07-15 17:33:31.62715	2025-07-16 18:11:28.179941	active	Las Reformas del Congreso	martes, 15 de Julio 2025	45MIN	Acuerdos del Congreso			t	0	t
4	Noticias del Congreso Radio	Un espacio que acerca la información legislativa al ciudadano.	/uploads/general/f4c82b5d-420f-41c5-8972-274479aba62a.png	\N	\N	General	\N	\N	2025-07-15 01:37:23.204114	2025-07-16 18:11:32.723174	active	Noticas del Canal del Congreso	lunes, 14 de Julio 2025	60MIN	Un espacio que acerca la información legislativa al ciudadano.			t	0	t
2	Sitio Abierto	con Carlos Solórzano	/uploads/general/de405399-c686-4bf2-89a6-eb0864b01198.png	\N	\N	General	\N	\N	2025-07-14 22:46:43.517313	2025-07-17 17:39:20.127186	active	"PAQUETE DE REFORMAS DE LA PRESIDENTA PARA ATENDER EL PROBLEMA DE DESAPARICIONES"	martes, 25 de marzo de 2025	60MIN	Hoy en #SitioAbierto con Javier Solórzano, contamos la participación de la Senadora Margarita Valdez Martínez de MORENA, el Diputado Ricardo Mejía Berdeja del PT y de la Diputada Ana Isabel González González del PRI para hablar de: PAQUETE DE REFORMAS DE LA PRESIDENTA PARA ATENDER EL PROBLEMA DE DESAPARICIONES.			t	0	t
3	Apuntes Parlamentarios	con Khemvirg Puente	/uploads/general/803a2b51-4a54-4cfa-b904-fd54342d9274.jpg	\N	\N	General	\N	\N	2025-07-14 22:51:04.894306	2025-07-16 18:03:01.496522	active	"Declaratoria de emergencia nacional en la frontera sur"	miércoles, 22 de enero de 2025	60MIN	Noticias del Congreso #Radio La diputada Graciela Ortiz nos habló de la declaratoria de emergencia nacional en la frontera sur de Estados Unidos hecha por el presidente Donald Trump y platicamos del llamado del Congreso de la Unión a la unidad nacional ante las medidas anunciadas contra México.			t	0	t
\.


--
-- TOC entry 3550 (class 0 OID 41078)
-- Dependencies: 239
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tags (id, name, slug, created_at) FROM stdin;
1	Congreso	congreso	2025-07-11 23:53:23.281521
2	Senado	senado	2025-07-11 23:53:23.281521
3	Diputados	diputados	2025-07-11 23:53:23.281521
4	Reformas	reformas	2025-07-11 23:53:23.281521
5	Transparencia	transparencia	2025-07-11 23:53:23.281521
6	Participación ciudadana	participacion-ciudadana	2025-07-11 23:53:23.281521
\.


--
-- TOC entry 3552 (class 0 OID 41085)
-- Dependencies: 241
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, password_hash, role, is_active, created_at, updated_at) FROM stdin;
1	admin	$2b$10$mTSh8O5d.lGiOzQsDDwqRegj9uBU2y/sX1rUb6DXyEEPYgHyNZqbO	admin	t	2025-07-18 06:40:39.012776	2025-07-18 06:40:39.012776
2	cmscanal	$2b$10$N6.DJm1jmW0ezOC0EOjrC.uMKXzDAvXgCKPeVAjuKGKwEh/q0UP8q	admin	t	2025-07-18 06:40:39.012776	2025-07-18 06:40:39.012776
\.


--
-- TOC entry 3554 (class 0 OID 41093)
-- Dependencies: 243
-- Data for Name: video_news; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.video_news (id, title, description, video_url, thumbnail_url, category, duration, published_at, status, created_at, updated_at) FROM stdin;
7	Avance de Noticias		https://www.youtube.com/playlist?list=PLuH8BWke2UzDW9UYSYcOuuGE3V5t-qMCC				2025-07-14 02:32:00	published	2025-07-14 04:33:42.134639	2025-07-14 04:33:42.134639
8	Cápusulas 		https://www.youtube.com/watch?v=Z0ZeN2jyjCo&list=PLuH8BWke2UzD3UPRAaprTh7RFnXdnKiku				2025-07-14 02:33:00	published	2025-07-14 04:41:53.433114	2025-07-14 04:41:53.433114
9	Legisladores		https://www.youtube.com/watch?v=79ecAb5XYYA&list=PLuH8BWke2UzD3SnYSXjb9vL1cBSbTl3_k				2025-07-14 02:42:00	published	2025-07-14 04:43:04.970515	2025-07-14 04:43:04.970515
10	Cámara Alta		https://www.youtube.com/watch?v=ZR-rlwiQCHo&list=PLuH8BWke2UzBFQsDLsp1XLj85FAcBPrDD				2025-07-14 02:44:00	published	2025-07-14 04:44:39.342314	2025-07-14 04:44:39.342314
11	Consejo 		https://www.youtube.com/watch?v=EwMJ-QF8eK0&list=PLuH8BWke2UzD59bkVexbdEeYTK-LZ7aMS				2025-07-14 02:47:00	published	2025-07-14 04:47:11.556664	2025-07-14 04:47:11.556664
12	prueba	es una prueba 	https://www.youtube.com/live/WlzfC1RIBAY?feature=shared		Foros y seminarios	--	2025-07-16 23:00:00	scheduled	2025-07-16 17:43:22.44015	2025-07-16 17:44:59.745554
14	otro	es otra prueba	https://youtu.be/VGNWPzkg0tA?feature=shared		Relaciones Exteriores		2025-07-16 19:04:00	scheduled	2025-07-16 18:47:26.700977	2025-07-16 19:03:32.980099
13	Taller	es una prueba 	https://www.youtube.com/watch?v=MJR3YbsJ5oU		Reportajes especiales	12:30	2025-07-17 00:30:00	scheduled	2025-07-16 17:55:08.403455	2025-07-16 19:04:40.186927
\.


--
-- TOC entry 3579 (class 0 OID 0)
-- Dependencies: 216
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 6, true);


--
-- TOC entry 3580 (class 0 OID 0)
-- Dependencies: 245
-- Name: channel_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.channel_config_id_seq', 3, true);


--
-- TOC entry 3581 (class 0 OID 0)
-- Dependencies: 218
-- Name: contact_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contact_messages_id_seq', 1, false);


--
-- TOC entry 3582 (class 0 OID 0)
-- Dependencies: 220
-- Name: homepage_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.homepage_config_id_seq', 17, true);


--
-- TOC entry 3583 (class 0 OID 0)
-- Dependencies: 222
-- Name: legislators_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.legislators_id_seq', 1, true);


--
-- TOC entry 3584 (class 0 OID 0)
-- Dependencies: 224
-- Name: live_streams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.live_streams_id_seq', 14, true);


--
-- TOC entry 3585 (class 0 OID 0)
-- Dependencies: 226
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.news_id_seq', 34, true);


--
-- TOC entry 3586 (class 0 OID 0)
-- Dependencies: 229
-- Name: organs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.organs_id_seq', 4, true);


--
-- TOC entry 3587 (class 0 OID 0)
-- Dependencies: 231
-- Name: parliamentary_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.parliamentary_groups_id_seq', 5, true);


--
-- TOC entry 3588 (class 0 OID 0)
-- Dependencies: 233
-- Name: programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.programs_id_seq', 9, true);


--
-- TOC entry 3589 (class 0 OID 0)
-- Dependencies: 235
-- Name: radio_episodes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.radio_episodes_id_seq', 8, true);


--
-- TOC entry 3590 (class 0 OID 0)
-- Dependencies: 238
-- Name: radio_programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.radio_programs_id_seq', 5, true);


--
-- TOC entry 3591 (class 0 OID 0)
-- Dependencies: 240
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tags_id_seq', 6, true);


--
-- TOC entry 3592 (class 0 OID 0)
-- Dependencies: 242
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- TOC entry 3593 (class 0 OID 0)
-- Dependencies: 244
-- Name: video_news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.video_news_id_seq', 14, true);


--
-- TOC entry 3332 (class 2606 OID 41119)
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- TOC entry 3334 (class 2606 OID 41121)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3336 (class 2606 OID 41123)
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- TOC entry 3377 (class 2606 OID 49165)
-- Name: channel_config channel_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.channel_config
    ADD CONSTRAINT channel_config_pkey PRIMARY KEY (id);


--
-- TOC entry 3338 (class 2606 OID 41125)
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3340 (class 2606 OID 41127)
-- Name: homepage_config homepage_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage_config
    ADD CONSTRAINT homepage_config_pkey PRIMARY KEY (id);


--
-- TOC entry 3342 (class 2606 OID 41129)
-- Name: homepage_config homepage_config_section_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage_config
    ADD CONSTRAINT homepage_config_section_key UNIQUE (section);


--
-- TOC entry 3344 (class 2606 OID 41131)
-- Name: legislators legislators_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legislators
    ADD CONSTRAINT legislators_pkey PRIMARY KEY (id);


--
-- TOC entry 3346 (class 2606 OID 41133)
-- Name: live_streams live_streams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.live_streams
    ADD CONSTRAINT live_streams_pkey PRIMARY KEY (id);


--
-- TOC entry 3348 (class 2606 OID 41135)
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- TOC entry 3350 (class 2606 OID 41137)
-- Name: news_tags news_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_tags
    ADD CONSTRAINT news_tags_pkey PRIMARY KEY (news_id, tag_id);


--
-- TOC entry 3352 (class 2606 OID 41139)
-- Name: organs organs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organs
    ADD CONSTRAINT organs_pkey PRIMARY KEY (id);


--
-- TOC entry 3354 (class 2606 OID 41141)
-- Name: parliamentary_groups parliamentary_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parliamentary_groups
    ADD CONSTRAINT parliamentary_groups_pkey PRIMARY KEY (id);


--
-- TOC entry 3356 (class 2606 OID 41143)
-- Name: programs programs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);


--
-- TOC entry 3358 (class 2606 OID 41145)
-- Name: radio_episodes radio_episodes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.radio_episodes
    ADD CONSTRAINT radio_episodes_pkey PRIMARY KEY (id);


--
-- TOC entry 3361 (class 2606 OID 41147)
-- Name: radio_navigation radio_navigation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.radio_navigation
    ADD CONSTRAINT radio_navigation_pkey PRIMARY KEY (id);


--
-- TOC entry 3363 (class 2606 OID 41149)
-- Name: radio_programs radio_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.radio_programs
    ADD CONSTRAINT radio_programs_pkey PRIMARY KEY (id);


--
-- TOC entry 3365 (class 2606 OID 41151)
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- TOC entry 3367 (class 2606 OID 41153)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 3369 (class 2606 OID 41155)
-- Name: tags tags_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_slug_key UNIQUE (slug);


--
-- TOC entry 3371 (class 2606 OID 41157)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3373 (class 2606 OID 41159)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3375 (class 2606 OID 41161)
-- Name: video_news video_news_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_news
    ADD CONSTRAINT video_news_pkey PRIMARY KEY (id);


--
-- TOC entry 3359 (class 1259 OID 41162)
-- Name: idx_radio_navigation_active_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_radio_navigation_active_order ON public.radio_navigation USING btree (active, display_order);


--
-- TOC entry 3378 (class 2606 OID 41163)
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- TOC entry 3379 (class 2606 OID 41168)
-- Name: legislators legislators_parliamentary_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legislators
    ADD CONSTRAINT legislators_parliamentary_group_id_fkey FOREIGN KEY (parliamentary_group_id) REFERENCES public.parliamentary_groups(id) ON DELETE SET NULL;


--
-- TOC entry 3380 (class 2606 OID 41173)
-- Name: news_tags news_tags_news_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_tags
    ADD CONSTRAINT news_tags_news_id_fkey FOREIGN KEY (news_id) REFERENCES public.news(id) ON DELETE CASCADE;


--
-- TOC entry 3381 (class 2606 OID 41178)
-- Name: news_tags news_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_tags
    ADD CONSTRAINT news_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- TOC entry 3382 (class 2606 OID 41183)
-- Name: radio_episodes radio_episodes_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.radio_episodes
    ADD CONSTRAINT radio_episodes_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.radio_programs(id) ON DELETE CASCADE;


-- Completed on 2025-09-23 00:24:42 UTC

--
-- PostgreSQL database dump complete
--

