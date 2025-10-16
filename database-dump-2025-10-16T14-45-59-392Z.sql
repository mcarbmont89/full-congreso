--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (165f042)
-- Dumped by pg_dump version 16.9

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO neondb_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: neondb_owner
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.categories OWNER TO neondb_owner;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO neondb_owner;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: channel_config; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.channel_config OWNER TO neondb_owner;

--
-- Name: channel_config_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.channel_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.channel_config_id_seq OWNER TO neondb_owner;

--
-- Name: channel_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.channel_config_id_seq OWNED BY public.channel_config.id;


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.contact_messages OWNER TO neondb_owner;

--
-- Name: contact_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.contact_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_messages_id_seq OWNER TO neondb_owner;

--
-- Name: contact_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.contact_messages_id_seq OWNED BY public.contact_messages.id;


--
-- Name: defensoria_content; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.defensoria_content (
    id integer NOT NULL,
    section character varying(100) NOT NULL,
    title character varying(255),
    content text,
    image_url character varying(500),
    file_url character varying(500),
    metadata jsonb,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.defensoria_content OWNER TO neondb_owner;

--
-- Name: defensoria_content_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.defensoria_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.defensoria_content_id_seq OWNER TO neondb_owner;

--
-- Name: defensoria_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.defensoria_content_id_seq OWNED BY public.defensoria_content.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    file_name character varying(255) NOT NULL,
    file_url text NOT NULL,
    file_size bigint,
    category character varying(100) DEFAULT 'general'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.documents OWNER TO neondb_owner;

--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documents_id_seq OWNER TO neondb_owner;

--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: homepage_config; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.homepage_config OWNER TO neondb_owner;

--
-- Name: homepage_config_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.homepage_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.homepage_config_id_seq OWNER TO neondb_owner;

--
-- Name: homepage_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.homepage_config_id_seq OWNED BY public.homepage_config.id;


--
-- Name: legislators; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.legislators OWNER TO neondb_owner;

--
-- Name: legislators_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.legislators_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.legislators_id_seq OWNER TO neondb_owner;

--
-- Name: legislators_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.legislators_id_seq OWNED BY public.legislators.id;


--
-- Name: live_streams; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.live_streams (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    thumbnail_url text,
    stream_url text NOT NULL,
    is_live boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    channel character varying(10),
    status character varying(20) DEFAULT 'offline'::character varying
);


ALTER TABLE public.live_streams OWNER TO neondb_owner;

--
-- Name: live_streams_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.live_streams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.live_streams_id_seq OWNER TO neondb_owner;

--
-- Name: live_streams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.live_streams_id_seq OWNED BY public.live_streams.id;


--
-- Name: news; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.news OWNER TO neondb_owner;

--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_id_seq OWNER TO neondb_owner;

--
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- Name: news_tags; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.news_tags (
    news_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.news_tags OWNER TO neondb_owner;

--
-- Name: organs; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.organs OWNER TO neondb_owner;

--
-- Name: organs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.organs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.organs_id_seq OWNER TO neondb_owner;

--
-- Name: organs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.organs_id_seq OWNED BY public.organs.id;


--
-- Name: parliamentary_groups; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.parliamentary_groups OWNER TO neondb_owner;

--
-- Name: parliamentary_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.parliamentary_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.parliamentary_groups_id_seq OWNER TO neondb_owner;

--
-- Name: parliamentary_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.parliamentary_groups_id_seq OWNED BY public.parliamentary_groups.id;


--
-- Name: programs; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.programs OWNER TO neondb_owner;

--
-- Name: programs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.programs_id_seq OWNER TO neondb_owner;

--
-- Name: programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.programs_id_seq OWNED BY public.programs.id;


--
-- Name: radio_categories; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.radio_categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    image_url character varying(500),
    link_url character varying(500),
    display_order integer DEFAULT 0,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.radio_categories OWNER TO neondb_owner;

--
-- Name: radio_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.radio_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.radio_categories_id_seq OWNER TO neondb_owner;

--
-- Name: radio_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.radio_categories_id_seq OWNED BY public.radio_categories.id;


--
-- Name: radio_episodes; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.radio_episodes OWNER TO neondb_owner;

--
-- Name: radio_episodes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.radio_episodes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.radio_episodes_id_seq OWNER TO neondb_owner;

--
-- Name: radio_episodes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.radio_episodes_id_seq OWNED BY public.radio_episodes.id;


--
-- Name: radio_navigation; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.radio_navigation OWNER TO neondb_owner;

--
-- Name: radio_programs; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.radio_programs OWNER TO neondb_owner;

--
-- Name: radio_programs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.radio_programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.radio_programs_id_seq OWNER TO neondb_owner;

--
-- Name: radio_programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.radio_programs_id_seq OWNED BY public.radio_programs.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tags OWNER TO neondb_owner;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_id_seq OWNER TO neondb_owner;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: timezone_config; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.timezone_config (
    id integer NOT NULL,
    timezone character varying(100) NOT NULL,
    display_name character varying(255) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.timezone_config OWNER TO neondb_owner;

--
-- Name: timezone_config_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.timezone_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.timezone_config_id_seq OWNER TO neondb_owner;

--
-- Name: timezone_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.timezone_config_id_seq OWNED BY public.timezone_config.id;


--
-- Name: transparency_sections; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.transparency_sections (
    id integer NOT NULL,
    section_key character varying(100) NOT NULL,
    section_title character varying(255) NOT NULL,
    icon_type character varying(50),
    cards_data jsonb DEFAULT '[]'::jsonb NOT NULL,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.transparency_sections OWNER TO neondb_owner;

--
-- Name: transparency_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.transparency_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transparency_sections_id_seq OWNER TO neondb_owner;

--
-- Name: transparency_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.transparency_sections_id_seq OWNED BY public.transparency_sections.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: video_news; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.video_news OWNER TO neondb_owner;

--
-- Name: video_news_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.video_news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.video_news_id_seq OWNER TO neondb_owner;

--
-- Name: video_news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.video_news_id_seq OWNED BY public.video_news.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: channel_config id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.channel_config ALTER COLUMN id SET DEFAULT nextval('public.channel_config_id_seq'::regclass);


--
-- Name: contact_messages id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.contact_messages ALTER COLUMN id SET DEFAULT nextval('public.contact_messages_id_seq'::regclass);


--
-- Name: defensoria_content id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.defensoria_content ALTER COLUMN id SET DEFAULT nextval('public.defensoria_content_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: homepage_config id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.homepage_config ALTER COLUMN id SET DEFAULT nextval('public.homepage_config_id_seq'::regclass);


--
-- Name: legislators id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.legislators ALTER COLUMN id SET DEFAULT nextval('public.legislators_id_seq'::regclass);


--
-- Name: live_streams id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.live_streams ALTER COLUMN id SET DEFAULT nextval('public.live_streams_id_seq'::regclass);


--
-- Name: news id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- Name: organs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.organs ALTER COLUMN id SET DEFAULT nextval('public.organs_id_seq'::regclass);


--
-- Name: parliamentary_groups id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.parliamentary_groups ALTER COLUMN id SET DEFAULT nextval('public.parliamentary_groups_id_seq'::regclass);


--
-- Name: programs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.programs ALTER COLUMN id SET DEFAULT nextval('public.programs_id_seq'::regclass);


--
-- Name: radio_categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.radio_categories ALTER COLUMN id SET DEFAULT nextval('public.radio_categories_id_seq'::regclass);


--
-- Name: radio_episodes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.radio_episodes ALTER COLUMN id SET DEFAULT nextval('public.radio_episodes_id_seq'::regclass);


--
-- Name: radio_programs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.radio_programs ALTER COLUMN id SET DEFAULT nextval('public.radio_programs_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: timezone_config id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.timezone_config ALTER COLUMN id SET DEFAULT nextval('public.timezone_config_id_seq'::regclass);


--
-- Name: transparency_sections id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transparency_sections ALTER COLUMN id SET DEFAULT nextval('public.transparency_sections_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: video_news id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.video_news ALTER COLUMN id SET DEFAULT nextval('public.video_news_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
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
-- Data for Name: channel_config; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.channel_config (id, name, number, logo, background_color, text_color, transmisiones_link, is_active, order_position, created_at, updated_at) FROM stdin;
1	C+	45.1	/images/channel-c-logo.png	#4a4a4a	#ffffff	/transmisiones?stream=1	t	1	2025-09-18 00:16:04.179155	2025-09-18 00:16:04.179155
2	S+	45.2	/images/channel-g-logo.png	#b91c1c	#ffffff	/transmisiones?stream=3	t	2	2025-09-18 00:16:04.179155	2025-09-18 00:16:04.179155
3	D+	45.3	/images/channel-d-logo.png	#15803d	#ffffff	/transmisiones?stream=2	t	3	2025-09-18 00:16:04.179155	2025-09-18 00:16:04.179155
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.contact_messages (id, name, email, subject, message, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: defensoria_content; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.defensoria_content (id, section, title, content, image_url, file_url, metadata, display_order, is_active, created_at, updated_at) FROM stdin;
1	site_files	Documento		/uploads/general/579796de-65c1-4f3e-b391-ad0bd4112a23.png	/uploads/documents/9125b0a4-1f77-471d-8078-75e5182183a5.pdf	null	0	t	2025-09-24 12:02:09.409554	2025-09-24 12:12:05.565046
4	recent_requests	ejemplo	ejemplo			{"date": "2025-09-25", "type": "Felicitaciones", "status": "Resuelto"}	0	t	2025-09-24 16:27:12.505229	2025-09-24 16:27:12.505229
6	annual_reports	2024	Resumen	\N	\N	{"year": "2024", "pdfUrl": "/uploads/documents/481f323d-5ead-44dc-b929-e661d9111980.pdf", "period": "", "wordUrl": "/uploads/documents/e38c512a-44eb-45dd-805c-822ded2952f9.docx", "reportType": "Reporte Especial", "description": "Resumen"}	0	t	2025-09-25 17:58:46.769331	2025-09-25 18:17:40.84285
11	annual_reports	2023	Informe anual de actividades 2023	\N	\N	{"year": "2023", "pdfUrl": "/uploads/documents/42d385eb-b4d0-48bd-8e56-04b902afdaee.pdf", "period": "Enero - Diciembre 2023", "wordUrl": "", "reportType": "Informe Anual", "description": "Informe anual de actividades 2023"}	0	t	2025-09-25 20:51:05.375386	2025-09-25 20:51:05.375386
12	annual_reports	2025	Plan de trabajo integral primer semestre 2025	\N	\N	{"year": "2025", "pdfUrl": "/uploads/documents/3c60b9f7-34c0-468b-842d-a32b2cdfc6ad.pdf", "period": "Enero - Junio 2025", "wordUrl": "/uploads/documents/8e08ab25-5de9-4c5a-8a74-4a8e7a843ae1.docx", "reportType": "Plan de Trabajo", "description": "Plan de trabajo integral primer semestre 2025"}	0	t	2025-09-25 21:41:11.0703	2025-09-26 10:06:26.821056
13	annual_reports	2025	Resumen	\N	\N	{"year": "2025", "pdfUrl": "", "period": "", "wordUrl": "/uploads/documents/c396d2d6-d1b7-4e27-9657-0e784e00fb03.docx", "reportType": "Reporte Especial", "description": "Resumen"}	0	t	2025-09-26 10:07:34.689758	2025-09-29 13:52:04.798627
14	recent_requests	Mejorar programación 	Agregar más documentales 	\N	\N	{"date": "2025-10-01", "type": "Sugerencia", "status": "En proceso", "description": "Se preveebfirmar acuerdos"}	0	t	2025-09-30 20:03:53.646225	2025-09-30 20:03:53.646225
16	recent_requests	Horarios	Horarios de atención	\N	\N	{"date": "2025-09-30", "type": "Sugerencia", "status": "Pendiente", "description": "Horarios de atención"}	0	t	2025-09-30 20:53:53.395268	2025-09-30 20:53:53.395268
15	recent_requests	Mejora de la logística de acceso	Mejora de la logística de acceso para los visitantes a las instalaciones.	\N	\N	{"date": "2025-09-26", "type": "Sugerencia", "status": "En proceso", "description": "Mejora de la logística de acceso para los visitantes a las instalaciones."}	2	t	2025-09-30 20:52:45.433067	2025-09-30 20:54:23.182334
17	annual_reports	2021	plan	\N	\N	{"year": "2021", "pdfUrl": "/uploads/documents/27a18496-69f2-4bc6-96d4-fff43c1b2c56.pdf", "period": "Enero - Diciembre 2021", "wordUrl": "", "reportType": "Plan de Trabajo", "description": "plan"}	0	t	2025-10-15 03:33:50.22314	2025-10-15 03:33:50.22314
3	defensora_profile	Mtra. María Gabriela Ortíz Portilla	Es Licenciada en Relaciones Internacionales por la Universidad Iberoamericana, con estudios en Derecho Internacional en la Université Jean Moulin Lyon, Francia. Cuenta con una Maestría en Derecho por la Universidad Anáhuac, un Máster en Comunicación Política y Gobernanza por The George Washington University y cursó un programa de liderazgo frente a tecnologías en Harvard. Desde abril de 2022 se desempeña como Defensora de la Audiencia del Canal del Congreso, donde ha impulsado proyectos en favor de la igualdad de género y los derechos de las audiencias, como el foro virtual de mujeres especialistas en violencia de género y mediática realizado en 2023. Es además titular de difusión de la Asociación Mexicana de Defensores de Audiencia y de la Organización Iberoamericana de Defensores de Audiencia.	/uploads/documents/a4a8404b-3e85-40ef-b742-f2210b15dee1.png		{}	0	t	2025-09-24 16:26:41.926459	2025-10-16 02:58:30.367864
18	annual_reports	2025	Ejemplo	\N	\N	{"year": "2025", "pdfUrl": "/uploads/documents/4ace1118-85f2-43d5-b5b9-762e2a6adadb.pdf", "period": "Enero-Julio2025", "wordUrl": "", "reportType": "Plan de Trabajo", "description": "Ejemplo"}	0	t	2025-10-16 03:07:29.723385	2025-10-16 03:07:29.723385
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.documents (id, title, description, file_name, file_url, file_size, category, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: homepage_config; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.homepage_config (id, section, title, description, background_image_url, hero_image_url, logo_url, additional_images, config_data, is_active, created_at, updated_at) FROM stdin;
1	downloadApp	\N	\N	/images/descarga-app-nueva.png	/images/descarga-app-nueva.png	\N	\N	\N	t	2025-07-12 15:07:06.900188	2025-07-15 00:46:29.709976
2	liveSection	\N	\N	/uploads/general/a8043152-1b48-4376-a425-c90a3f8892b9.png	/images/fondo-menu-inicio.png	\N	\N	\N	t	2025-07-14 22:45:13.245637	2025-07-16 17:16:34.609662
7	xFeed	Feed de X (Twitter)	Muestra el feed de X en la sección de noticias	\N	\N	\N	\N	\N	f	2025-07-16 17:35:12.222278	2025-07-16 18:15:04.581825
\.


--
-- Data for Name: legislators; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.legislators (id, name, parliamentary_group_id, legislature, state, type, gender, status, image_url, email, biography, created_at, updated_at) FROM stdin;
1	Acosta Trujillo Juana	1	LXVI	Guanajuato	Diputado	F	Activo	/uploads/general/91b6996c-ae63-4e93-b2dc-c03d514dfb6c.jpeg	juana.acosta@diputados.gob.mx	Grupos de amistad \n- Grupo de amistad republica fransesa\n-Grupo de amistad Hungría \n	2025-07-17 17:50:29.798367	2025-07-17 17:53:11.725199
\.


--
-- Data for Name: live_streams; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.live_streams (id, title, thumbnail_url, stream_url, is_live, created_at, updated_at, channel, status) FROM stdin;
14	Comisiones Unidas de Salud y de Estudios Legislativos, Segunda. 	/uploads/transmisiones/ec4d2586-046a-4d34-b793-7644cb501652.png	https://ccstreaming.packet.mx/WebRTCAppEE/play.html?id=45.3_kd5oiNTTWO0gEOFc875423kf52&playOrder=hls	t	2025-07-14 23:10:38.93686	2025-07-14 23:10:38.93686	D+	live
13	Comisión de Asuntos de la Frontera Norte. Reunión binacional del Comercio Exterior y Aduanas Paso del Norte.	/uploads/transmisiones/6991b559-86b8-401a-a390-533b6005c832.png	https://ccstreaming.packet.mx/WebRTCAppEE/play.html?id=45.2_kd5oiNTTWO0gEOFc423456787er&playOrder=hls	t	2025-07-14 23:04:08.388192	2025-07-14 23:04:08.388192	S+	live
12	Comisiones de Estudios Legislativos, Segunda. 	/uploads/transmisiones/f0f045a2-3e77-4f94-ab22-e8f68188dfe4.jpeg	https://ccstreaming.packet.mx/WebRTCAppEE/play.html?id=45.1_kd5oiNTTWO0gEOFc431277834&playOrder=hls	t	2025-07-14 22:51:14.309208	2025-07-14 22:51:14.309208	C+	live
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.news (id, title, summary, content, image_url, category, published_at, created_at, updated_at, status, is_featured, featured_rank) FROM stdin;
29	Noticia de Prueba - Borrador	Esta es una noticia guardada como borrador para testing	Contenido completo de la noticia en borrador	/images/test.jpg	Temas de actualidad	2025-09-18 18:26:22.143465	2025-09-18 18:26:22.143465	2025-09-18 18:26:22.143465	draft	t	1
42	test	test	<p><strong>Lorem Ipsum</strong><span> es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.</span></p>\n<p><a href="https://dev2025.canaldelcongreso.gob.mx/" target="_blank" rel="noopener"><span>link</span></a></p>	/uploads/news/2cfce8c2-1b59-43f3-9987-01031b5c8f63.jpg	Trabajo en comisiones	2025-09-29 17:51:00	2025-09-29 11:50:33.577228	2025-09-29 11:50:33.577228	published	f	\N
43	test 2	test 2	<p>test 2</p>	/uploads/news/d4b3d524-e620-4d46-9815-f82eafef8c69.jpg	Trabajo en pleno	2025-09-29 18:02:00	2025-09-29 12:01:21.992113	2025-09-29 12:01:21.992113	published	f	\N
32	Noticia Destacada 3	Tercera noticia destacada	Contenido de la tercera noticia	/images/test1.jpg	Senado	2025-09-18 19:33:43.840105	2025-09-18 19:33:43.840105	2025-09-18 19:33:43.840105	published	t	2
33	Noticia Destacada 4	Cuarta noticia destacada	Contenido de la cuarta noticia	/images/test4.jpg	Cámara de Diputados	2025-09-18 19:33:43.840105	2025-09-18 19:33:43.840105	2025-09-18 19:33:43.840105	published	t	3
39	Timezone Test 19:00	Round-trip timezone test	Testing if 19:00 remains 19:00	\N	test	2025-09-30 01:00:00	2025-09-29 11:25:58.652805	2025-09-29 11:25:58.652805	published	f	\N
44	Noticia 30 de Sept 6:30PM	Noticia 30 de Sept 6:30PM	<p>Noticia 30 de Sept 6:30PM</p>\n<p>Actualización de Nota</p>	/uploads/news/1b432aa3-0088-4f98-b9c6-e0be881425a8.png	Temas de actualidad	2025-10-01 00:35:00	2025-09-30 18:40:20.038701	2025-09-30 18:40:20.038701	published	f	\N
31	Noticia Publicada Super Especial	Esta noticia ya está publicada	Contenido de noticia ya publicada	/uploads/news/fd70cb84-2e52-47b4-ac4f-dc7bd2b05dd4.png	Relaciones Exteriores	2025-09-15 23:26:00	2025-09-18 18:26:22.143465	2025-09-18 18:26:22.143465	published	t	0
34	Noticia Destacada 5	Quinta noticia destacada	<div class="two-column-layout">\n<p>Contenido de la quinta noticia</p>\n<p>texto de prueba</p>\n<p></p>\n<p><img src="/uploads/news/4b3c3c9c-f4ff-47e1-952a-9e667dfff99e.png" width="191" height="191"></p>\n<p></p>\n<p>mas texto</p>\n</div>	/images/test5.jpg	Mesa Directiva	2025-09-18 17:33:00	2025-09-18 19:33:43.840105	2025-09-18 19:33:43.840105	published	t	4
30	Noticia Programada	Esta noticia está programada para publicar en 2 minutos	<div class="two-column-layout">\n<p>Contenido de noticia programada Es</p>\n<p></p>\n<p></p>\n<p></p>\n<p></p>\n<p><img src="/uploads/news/a0862e97-e808-4a09-9402-f1f3291145c8.png" width="254" height="254"></p>\n<p>texto</p>\n</div>	/images/test2.jpg	Trabajo en comisiones	2025-09-24 15:41:00	2025-09-18 18:26:22.143465	2025-09-18 18:26:22.143465	published	t	1
35	Noticia 26 Spt 5PM	Noticia del 23 de sept 10am	<h4>Noticia del 23 d<img src="/uploads/news/f059d64e-80f5-47f1-9fcc-122323761a39.png" alt="" class="mx-auto block">e sept 10am</h4>	/uploads/news/0d9b4ade-d110-46ab-bd38-3a1c5aab414d.jpeg	Temas de actualidad	2025-09-26 23:00:00	2025-09-23 19:25:11.793517	2025-09-23 19:25:11.793517	published	f	\N
\.


--
-- Data for Name: news_tags; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.news_tags (news_id, tag_id) FROM stdin;
\.


--
-- Data for Name: organs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.organs (id, title, description, image_url, created_at, updated_at, url) FROM stdin;
1	Comisión Bicamaral	Texto	/uploads/organs/7a2c3c15-9ca0-4651-b68b-c63311f84105.png	2025-07-13 22:37:44.091464	2025-07-14 16:36:51.695052	https://dev2025.canaldelcongreso.gob.mx/
4	Consejo Consuntivo	Consejo Consuntivo	/uploads/organs/15ba68a6-ddd9-4fe6-b086-5a174df2e0e3.png	2025-07-14 16:30:01.747138	2025-07-14 16:38:28.861069	https://www.canaldelcongreso.gob.mx/ConsejoConsultivo/inicio
3	Defensoría de Audiencias	Texto	/uploads/organs/67bff7fe-22c9-42c8-928e-18188363a562.png	2025-07-13 22:42:05.761747	2025-09-25 11:51:38.545506	https://dev2025.canaldelcongreso.gob.mx/defensoria-audiencia
\.


--
-- Data for Name: parliamentary_groups; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.parliamentary_groups (id, name, abbreviation, image_url, color_hex, description, created_at, updated_at) FROM stdin;
1	MORENA	MORENA	/uploads/organs/62cfe39a-2350-4749-865a-ce459bef79f4.png	#e54124	grupo parlamentario	2025-07-16 18:24:00.350204	2025-07-16 18:24:00.350204
2	Partido Acción Nacional	PAN		#0951e1	partido pan	2025-07-17 17:56:25.279676	2025-07-17 17:56:25.279676
3	Partido Verde Ecologista de Mexico	PVEM		#65d963	El partido verde	2025-07-17 17:58:32.972554	2025-07-17 17:58:32.972554
4	Partido del Trabajo	PT		#f0f415	el partido del trabajo	2025-07-17 17:59:31.104219	2025-07-17 17:59:31.104219
5	Movimiento Ciudadano	MC		#f2aa0d	movimiento ciudadano	2025-07-17 18:01:02.728522	2025-07-17 18:01:02.728522
\.


--
-- Data for Name: programs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
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
-- Data for Name: radio_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.radio_categories (id, name, slug, description, image_url, link_url, display_order, active, created_at, updated_at) FROM stdin;
2	NOTICIAS CONGRESO	noticias-congreso	Noticias y actualizaciones del Congreso	/images/placeholder.jpg	/radio/noticias-del-congreso-radio/episodios	2	t	2025-09-23 23:50:36.492817	2025-09-23 23:50:36.492817
3	PROGRAMAS	programas	Todos los programas de Radio Congreso	/images/placeholder.jpg	/radio/mi-radio	3	t	2025-09-23 23:50:36.492817	2025-09-23 23:50:36.492817
4	PREGUNTA AL CONGRESO	pregunta-al-congreso		/uploads/general/70b92bdc-c77a-4a02-b506-7a4dc8236185.jpg	/radio/pregunta-al-congreso/episodes	0	t	2025-09-23 21:43:09.064129	2025-09-24 00:10:30.122975
1	ENTREVISTAS	entrevistas		/images/placeholder.jpg	/radio/entrevistas	1	t	2025-09-23 23:50:36.492817	2025-09-29 11:41:59.26695
\.


--
-- Data for Name: radio_episodes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.radio_episodes (id, title, description, audio_url, duration, publish_date, image_url, program_id, published, created_at, updated_at) FROM stdin;
4	Sitio Abierto - Radio Congreso	Debate respecto al presupuesto 	/uploads/audio/59b85e13-5eb2-44b5-8fa0-76c0c0ddd09b.mp3	60MIN	2024-11-21	/uploads/radio/45b3af85-ef2e-4ff8-ad66-3787e0b30372.jpg	2	t	2025-07-15 00:41:29.67352	2025-07-15 01:40:25.586667
5	Noticias del Congreso Radio - 19 de Noviembre 2024	Noticias del Congreso Radio - 19 de Noviembre 2024	/uploads/audio/570ce8d4-8da4-44a1-8880-f8b457679441.mp3	60MIN	2024-11-19	/uploads/radio/faf85e6d-8f63-46bd-b2ee-ee9738e4505b.png	4	t	2025-07-15 02:03:03.904023	2025-07-15 02:03:03.904023
6	Ultimo Episodio de Sitio Abierto	Lo más reciente	/uploads/audio/41cda5b9-e80d-41b7-8758-840426d46f7f.mp3	15MIN	2025-07-15	/uploads/radio/0ad96ac4-0110-4954-8396-aace534effbd.png	2	t	2025-07-15 17:39:54.372498	2025-07-15 17:39:54.372498
7	Radio congreso	Episodio de Noticias del Congreso Radio	/uploads/audio/618faaee-0e78-4257-9c3c-bd654739ef45.mp3	30MIN	2025-07-15	/uploads/general/11bcb3d6-0120-4d55-a2b0-b81cefddf081.png	4	t	2025-07-15 17:44:21.644257	2025-07-15 17:44:21.644257
8	Nueva Noticia	Episodio de Nuevo Progrrama de Noticias	/uploads/audio/866fd17c-74c2-488c-bb11-68da43308571.mp3	30MIN	2025-07-14	/uploads/general/0f3b9f28-6dc5-4eaa-baaf-d5f7e4fb00c7.png	5	t	2025-07-15 17:44:22.065023	2025-07-15 17:44:22.065023
\.


--
-- Data for Name: radio_navigation; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.radio_navigation (id, name, href, display_order, active, created_at, updated_at) FROM stdin;
toma-tribuna	Toma Tribuna	/radio/toma-tribuna	0	f	2025-07-12 21:52:00.725646	2025-07-12 21:52:00.725646
entrevistas	Entrevistas	/radio/entrevistas	1	f	2025-07-12 21:52:00.747665	2025-07-12 21:54:20.049911
sitio-abierto	Sitio Abierto	/radio/sitio-abierto	2	f	2025-07-12 21:52:00.768298	2025-07-12 21:54:20.049911
noticias-congreso	Noticias del Congreso	/radio/noticias-congreso	3	t	2025-07-12 21:52:00.789424	2025-07-12 22:00:49.008211
nav-1752357283395	Un programa	/radio	1	t	2025-07-12 21:55:01.17694	2025-07-12 22:00:49.008211
\.


--
-- Data for Name: radio_programs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.radio_programs (id, title, description, image_url, audio_url, duration, category, host, published_at, created_at, updated_at, status, latest_episode_title, latest_episode_date, latest_episode_duration, latest_episode_description, program_link, episodes_link, published, display_order, featured) FROM stdin;
5	Nuevo Progrrama de Noticias	Las noticas en 5 minutos	/uploads/general/0f3b9f28-6dc5-4eaa-baaf-d5f7e4fb00c7.png	\N	\N	General	\N	\N	2025-07-15 17:33:31.62715	2025-07-16 18:11:28.179941	active	Las Reformas del Congreso	martes, 15 de Julio 2025	45MIN	Acuerdos del Congreso			t	0	t
4	Noticias del Congreso Radio	Un espacio que acerca la información legislativa al ciudadano.	/uploads/general/f4c82b5d-420f-41c5-8972-274479aba62a.png	\N	\N	General	\N	\N	2025-07-15 01:37:23.204114	2025-07-16 18:11:32.723174	active	Noticas del Canal del Congreso	lunes, 14 de Julio 2025	60MIN	Un espacio que acerca la información legislativa al ciudadano.			t	0	t
2	Sitio Abierto	con Carlos Solórzano	/uploads/general/de405399-c686-4bf2-89a6-eb0864b01198.png	\N	\N	General	\N	\N	2025-07-14 22:46:43.517313	2025-07-17 17:39:20.127186	active	"PAQUETE DE REFORMAS DE LA PRESIDENTA PARA ATENDER EL PROBLEMA DE DESAPARICIONES"	martes, 25 de marzo de 2025	60MIN	Hoy en #SitioAbierto con Javier Solórzano, contamos la participación de la Senadora Margarita Valdez Martínez de MORENA, el Diputado Ricardo Mejía Berdeja del PT y de la Diputada Ana Isabel González González del PRI para hablar de: PAQUETE DE REFORMAS DE LA PRESIDENTA PARA ATENDER EL PROBLEMA DE DESAPARICIONES.			t	0	t
3	Apuntes Parlamentarios	con Khemvirg Puente	/uploads/general/803a2b51-4a54-4cfa-b904-fd54342d9274.jpg	\N	\N	General	\N	\N	2025-07-14 22:51:04.894306	2025-07-16 18:03:01.496522	active	"Declaratoria de emergencia nacional en la frontera sur"	miércoles, 22 de enero de 2025	60MIN	Noticias del Congreso #Radio La diputada Graciela Ortiz nos habló de la declaratoria de emergencia nacional en la frontera sur de Estados Unidos hecha por el presidente Donald Trump y platicamos del llamado del Congreso de la Unión a la unidad nacional ante las medidas anunciadas contra México.			t	0	t
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: neondb_owner
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
-- Data for Name: timezone_config; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.timezone_config (id, timezone, display_name, is_active, created_at, updated_at) FROM stdin;
1	America/Mexico_City	Ciudad de México (CST/CDT)	t	2025-09-29 11:07:48.421137	2025-09-29 11:07:48.421137
\.


--
-- Data for Name: transparency_sections; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.transparency_sections (id, section_key, section_title, icon_type, cards_data, display_order, is_active, created_at, updated_at) FROM stdin;
5	transparencia-focalizada	Experiencias imperdibles en Tierra del Fuego	book	[{"title": "Tren del Fin del Mundo", "linkUrl": "https://en.wikipedia.org/wiki/Tierra_del_Fuego", "hasButton": true, "description": "Recorrido histórico por el antiguo trazado de los presos, entre bosques, turberas y ríos. Ideal para una primera vista panorámica del paisaje fueguino."}, {"title": "Parque Nacional Tierra del Fuego", "linkUrl": "https://en.wikipedia.org/wiki/Tierra_del_Fuego", "hasButton": true, "description": "Senderos señalizados junto a bahías y bosques subantárticos. Perfecto para caminar en familia, avistar aves y llegar hasta el icónico cartel del “Fin del Mundo”."}, {"title": "Navegación por el Canal Beagle", "linkUrl": "https://en.wikipedia.org/wiki/Tierra_del_Fuego", "hasButton": true, "description": "Faros, islas con lobos marinos y pingüineras en temporada. Una salida clásica para entender la geografía austral desde el agua."}, {"title": "Trekking a Laguna Esmeralda", "linkUrl": "https://www.google.com/", "hasButton": true, "description": "Sendero accesible con final impactante: aguas verde esmeralda rodeadas de montañas y glaciares de valle. Recomendable llevar calzado impermeable."}]	5	t	2025-10-15 01:09:24.395586	2025-10-16 08:40:51.808702
3	normatividad	Consejos del Sur: Clima y Logística	scale	[{"title": "Clima y mejores épocas", "hasButton": false, "description": "Vientos patagónicos y clima cambiante: llevá capas, campera impermeable y calzado técnico. Verano con días largos; otoño y primavera, colores únicos; invierno, nieve asegurada."}, {"title": "Cómo moverse en Tierra del Fuego", "hasButton": false, "description": "Traslados entre ciudad y valles en transfer o auto de alquiler; navegación por el Beagle y excursiones guiadas. Reservá con anticipación y respetá áreas protegidas y senderos señalizados."}, {"items": [], "title": "Test ", "linkUrl": "", "hasButton": false, "description": "Este sistema crea nuevas tarjetas"}]	3	t	2025-10-15 01:09:24.242122	2025-10-16 08:40:18.808905
7	acerca-nosotros	Guía práctica del viajero (7 claves)	info	[{"title": "Dónde alojarse", "hasButton": false, "description": "Centro para moverte a pie y acceder a servicios; valles para silencio y naturaleza. Reservá con anticipación en temporada alta (dic–mar y julio–ago)."}, {"title": "Vuelos y traslados", "hasButton": false, "description": "Arribos al Aeropuerto Malvinas Argentinas (USH). Traslado en taxi, transfer o alquiler. Verificá estado del clima para evitar reprogramaciones."}, {"title": "Equipo imprescindible", "hasButton": false, "description": "Sistema de capas, campera impermeable, calzado con agarre, gorro y guantes. En verano: protector solar y antiparras; en invierno: cadenas o crampones ligeros"}, {"title": "Seguridad en senderos", "linkUrl": "https://en.wikipedia.org/wiki/Tierra_del_Fuego", "hasButton": true, "description": "Clima variable: consultá pronóstico y avisá tu plan. Seguí señalización oficial, no salgas de los trazados y lleva agua/snacks y mapa offline."}, {"title": "Turismo responsable", "linkUrl": "https://en.wikipedia.org/wiki/Tierra_del_Fuego", "hasButton": true, "description": "Practicá Leave No Trace: no alimentes fauna, traé tu basura de vuelta y respetá turberas y vegetación frágil. Preferí guías y operadores habilitados."}, {"title": "Conectividad y pagos", "linkUrl": "https://en.wikipedia.org/wiki/Tierra_del_Fuego", "hasButton": true, "description": "Cobertura 4G variable fuera de la ciudad. Considerá eSIM o chip local. Se acepta tarjeta, pero llevá algo de efectivo para excursiones y refugios."}, {"title": "Artesanías y sabores locales", "linkUrl": "https://en.wikipedia.org/wiki/Tierra_del_Fuego", "hasButton": true, "description": "Madera de lenga, cerámicas y textiles; chocolates y mermeladas patagónicas. Comprar local apoya a la comunidad y reduce huella logística."}]	7	t	2025-10-15 01:09:24.549228	2025-10-15 16:10:33.657678
6	datos-abiertos	Datos abiertos	database	[{"items": [{"label": "Actividades 2021 TIERRA DEL FUEGO", "fileUrl": "/uploads/documents/8fe4e5e0-b3cb-42ec-a2bf-0e05d5e43a70.pdf", "fileType": "pdf"}, {"label": "Actividades 2020", "fileUrl": "/uploads/documents/82520f61-4f2f-4541-9df1-3ce9bd45cbeb.pdf", "fileType": "pdf"}, {"label": "Actividades 2019 ", "fileUrl": "/uploads/documents/59ad2c6b-73ee-4124-8d80-2e958ff7ce5f.pdf", "fileType": "pdf"}, {"label": "Actividades 2018", "fileUrl": "/uploads/documents/1924d186-aac1-4f35-9f27-05415d3a9aa7.pdf", "fileType": "pdf"}, {"label": "Actividades 2017 TIERRA DEL FUEGO"}, {"label": "Actividades 2016 TIERRA DEL FUEGO"}, {"label": "Actividades 2015 TIERRA DEL FUEGO"}], "title": "Ushuaia ciudad & museos", "linkUrl": "https://en.wikipedia.org/wiki/Tierra_del_Fuego", "hasButton": true, "description": ""}, {"items": [{"label": "Informe 2021 "}, {"label": "Informe 2020 TIERRA DEL FUEGO"}, {"label": "Informe 2017 TIERRA DEL FUEGO"}], "title": "Parque Nacional en un día", "linkUrl": "https://en.wikipedia.org/wiki/Tierra_del_Fuego", "hasButton": true, "description": ""}, {"items": [{"label": "Programa 2021 TIERRA DEL FUEGO"}, {"label": "Programa 2020 TIERRA DEL FUEGO"}, {"label": "Programa 2019 TIERRA DEL FUEGO"}, {"label": "Programa 2018 TIERRA DEL FUEGO"}, {"label": "Programa 2017 TIERRA DEL FUEGO"}, {"label": "Programa 2016 TIERRA DEL FUEGO"}, {"label": "Programa 2015 TIERRA DEL FUEGO"}], "title": "TIERRA DEL FUEGO", "linkUrl": "https://en.wikipedia.org/wiki/Tierra_del_Fuego", "hasButton": true, "description": ""}, {"items": [{"label": "Acervo videográfico 2022 TIERRA DEL FUEGO"}, {"label": "Acervo videográfico 2021 TIERRA DEL FUEGO"}, {"label": "Acervo videográfico 2020 TIERRA DEL FUEGO"}, {"label": "Acervo videográfico 2019 TIERRA DEL FUEGO"}, {"label": "Acervo videográfico 2018 TIERRA DEL FUEGO"}], "title": "TIERRA DEL FUEGO", "linkUrl": "https://en.wikipedia.org/wiki/Tierra_del_Fuego", "hasButton": true, "description": ""}, {"items": [{"label": "Estadísticas 2021 TIERRA DEL FUEGO"}, {"label": "Estadísticas 2020 TIERRA DEL FUEGO"}, {"label": "Estadísticas 2019 TIERRA DEL FUEGO"}, {"label": "Estadísticas 2018 TIERRA DEL FUEGO"}, {"label": "Estadísticas 2017 TIERRA DEL FUEGO"}], "title": "TIERRA DEL FUEGO", "linkUrl": "https://en.wikipedia.org/wiki/Tierra_del_Fuego", "hasButton": true, "description": ""}]	6	t	2025-10-15 01:09:24.472418	2025-10-16 08:41:39.902156
4	compromisos-transparencia	Foto & Fauna del Fin del Mundoa	message	[{"title": "Fauna austral responsable", "hasButton": false, "description": "Pingüinos, lobos marinos y aves cordilleranas. Observá a distancia, sin alimentar ni invadir nidos. Guiados habilitados y senderos marcados ayudan a proteger el ecosistema."}, {"title": "Miradores y rutas fotográficas", "hasButton": false, "description": "Glaciar Martial, Paso Garibaldi y faro Les Eclaireurs ofrecen encuadres únicos. Mejor luz al amanecer/atardecer; llevá trípode y filtro para cielos patagónicos cambiantes"}]	4	t	2025-10-15 01:09:24.318758	2025-10-15 00:47:49.101668
1	informacion-utilidad	Información de Utilidad Pública	document	[{"title": "Patagonia Austral — Tierra del Fuego", "linkUrl": "https://en.wikipedia.org/wiki/Tierra_del_Fuego", "hasButton": true, "description": "Archipiélago en el extremo sur: bosques subantárticos, estepa, glaciares y el Canal Beagle. Ushuaia combina naturaleza, historia y vida portuaria en un paisaje de vientos y montañas."}, {"title": "Fin del mundo, principio de aventuras", "linkUrl": "https://en.wikipedia.org/wiki/Diego_Maradona", "hasButton": true, "description": "Trekking a Laguna Esmeralda y Glaciar Martial, navegación por el Beagle con pingüinos y lobos marinos, y senderos en el Parque Nacional Tierra del Fuego. Ideal para outdoor todo el año."}]	1	t	2025-10-15 01:09:24.059263	2025-10-16 08:39:30.2003
2	estructura-presupuesto	Sabores y Expediciones del Sur	building	[{"title": "Sabores australes", "linkUrl": "https://en.wikipedia.org/wiki/Tierra_del_Fuego", "hasButton": true, "description": "Centolla, merluza negra y cordero fueguino lideran una cocina marina y patagónica. Entre cervecerías y chocolaterías artesanales, la mesa del sur es parte del viaje."}, {"title": "Puerta a la Antártida", "linkUrl": "https://en.wikipedia.org/wiki/Tierra_del_Fuego", "hasButton": true, "description": "Ushuaia es base logística de expediciones antárticas. Museos marítimos, el antiguo presidio y el faro Les Eclaireurs conectan historia, ciencia y navegación austral."}]	2	t	2025-10-15 01:09:24.164917	2025-10-16 08:39:41.537319
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, password_hash, role, is_active, created_at, updated_at) FROM stdin;
1	admin	$2b$10$mTSh8O5d.lGiOzQsDDwqRegj9uBU2y/sX1rUb6DXyEEPYgHyNZqbO	admin	t	2025-07-18 06:40:39.012776	2025-07-18 06:40:39.012776
2	cmscanal	$2b$10$N6.DJm1jmW0ezOC0EOjrC.uMKXzDAvXgCKPeVAjuKGKwEh/q0UP8q	admin	t	2025-07-18 06:40:39.012776	2025-07-18 06:40:39.012776
\.


--
-- Data for Name: video_news; Type: TABLE DATA; Schema: public; Owner: neondb_owner
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
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.categories_id_seq', 18, true);


--
-- Name: channel_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.channel_config_id_seq', 3, true);


--
-- Name: contact_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.contact_messages_id_seq', 1, false);


--
-- Name: defensoria_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.defensoria_content_id_seq', 18, true);


--
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.documents_id_seq', 1, false);


--
-- Name: homepage_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.homepage_config_id_seq', 17, true);


--
-- Name: legislators_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.legislators_id_seq', 1, true);


--
-- Name: live_streams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.live_streams_id_seq', 14, true);


--
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.news_id_seq', 44, true);


--
-- Name: organs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.organs_id_seq', 4, true);


--
-- Name: parliamentary_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.parliamentary_groups_id_seq', 5, true);


--
-- Name: programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.programs_id_seq', 9, true);


--
-- Name: radio_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.radio_categories_id_seq', 4, true);


--
-- Name: radio_episodes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.radio_episodes_id_seq', 8, true);


--
-- Name: radio_programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.radio_programs_id_seq', 5, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.tags_id_seq', 18, true);


--
-- Name: timezone_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.timezone_config_id_seq', 1, true);


--
-- Name: transparency_sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.transparency_sections_id_seq', 14, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: video_news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.video_news_id_seq', 14, true);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: channel_config channel_config_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.channel_config
    ADD CONSTRAINT channel_config_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: defensoria_content defensoria_content_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.defensoria_content
    ADD CONSTRAINT defensoria_content_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: homepage_config homepage_config_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.homepage_config
    ADD CONSTRAINT homepage_config_pkey PRIMARY KEY (id);


--
-- Name: homepage_config homepage_config_section_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.homepage_config
    ADD CONSTRAINT homepage_config_section_key UNIQUE (section);


--
-- Name: legislators legislators_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.legislators
    ADD CONSTRAINT legislators_pkey PRIMARY KEY (id);


--
-- Name: live_streams live_streams_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.live_streams
    ADD CONSTRAINT live_streams_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: news_tags news_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.news_tags
    ADD CONSTRAINT news_tags_pkey PRIMARY KEY (news_id, tag_id);


--
-- Name: organs organs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.organs
    ADD CONSTRAINT organs_pkey PRIMARY KEY (id);


--
-- Name: parliamentary_groups parliamentary_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.parliamentary_groups
    ADD CONSTRAINT parliamentary_groups_pkey PRIMARY KEY (id);


--
-- Name: programs programs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);


--
-- Name: radio_categories radio_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.radio_categories
    ADD CONSTRAINT radio_categories_name_key UNIQUE (name);


--
-- Name: radio_categories radio_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.radio_categories
    ADD CONSTRAINT radio_categories_pkey PRIMARY KEY (id);


--
-- Name: radio_categories radio_categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.radio_categories
    ADD CONSTRAINT radio_categories_slug_key UNIQUE (slug);


--
-- Name: radio_episodes radio_episodes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.radio_episodes
    ADD CONSTRAINT radio_episodes_pkey PRIMARY KEY (id);


--
-- Name: radio_navigation radio_navigation_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.radio_navigation
    ADD CONSTRAINT radio_navigation_pkey PRIMARY KEY (id);


--
-- Name: radio_programs radio_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.radio_programs
    ADD CONSTRAINT radio_programs_pkey PRIMARY KEY (id);


--
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: tags tags_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_slug_key UNIQUE (slug);


--
-- Name: timezone_config timezone_config_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.timezone_config
    ADD CONSTRAINT timezone_config_pkey PRIMARY KEY (id);


--
-- Name: transparency_sections transparency_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transparency_sections
    ADD CONSTRAINT transparency_sections_pkey PRIMARY KEY (id);


--
-- Name: transparency_sections transparency_sections_section_key_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transparency_sections
    ADD CONSTRAINT transparency_sections_section_key_key UNIQUE (section_key);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: video_news video_news_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.video_news
    ADD CONSTRAINT video_news_pkey PRIMARY KEY (id);


--
-- Name: idx_defensoria_active; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_defensoria_active ON public.defensoria_content USING btree (is_active);


--
-- Name: idx_defensoria_section; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_defensoria_section ON public.defensoria_content USING btree (section);


--
-- Name: idx_radio_navigation_active_order; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_radio_navigation_active_order ON public.radio_navigation USING btree (active, display_order);


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: legislators legislators_parliamentary_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.legislators
    ADD CONSTRAINT legislators_parliamentary_group_id_fkey FOREIGN KEY (parliamentary_group_id) REFERENCES public.parliamentary_groups(id) ON DELETE SET NULL;


--
-- Name: news_tags news_tags_news_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.news_tags
    ADD CONSTRAINT news_tags_news_id_fkey FOREIGN KEY (news_id) REFERENCES public.news(id) ON DELETE CASCADE;


--
-- Name: news_tags news_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.news_tags
    ADD CONSTRAINT news_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- Name: radio_episodes radio_episodes_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.radio_episodes
    ADD CONSTRAINT radio_episodes_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.radio_programs(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: neondb_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

