--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+2)
-- Dumped by pg_dump version 16.4

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
-- Name: MessageType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MessageType" AS ENUM (
    'CHANNEL',
    'PRIVATE'
);


ALTER TYPE public."MessageType" OWNER TO postgres;

--
-- Name: ServerRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ServerRole" AS ENUM (
    'OWNER',
    'ADMIN',
    'MEMBER'
);


ALTER TYPE public."ServerRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Channel" (
    id integer NOT NULL,
    "serverId" integer NOT NULL,
    name text NOT NULL,
    "isVoice" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Channel" OWNER TO postgres;

--
-- Name: Channel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Channel_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Channel_id_seq" OWNER TO postgres;

--
-- Name: Channel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Channel_id_seq" OWNED BY public."Channel".id;


--
-- Name: Friend; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Friend" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "friendId" integer NOT NULL
);


ALTER TABLE public."Friend" OWNER TO postgres;

--
-- Name: FriendRequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FriendRequest" (
    id integer NOT NULL,
    "senderId" integer NOT NULL,
    "recipientId" integer NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."FriendRequest" OWNER TO postgres;

--
-- Name: FriendRequest_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."FriendRequest_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."FriendRequest_id_seq" OWNER TO postgres;

--
-- Name: FriendRequest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."FriendRequest_id_seq" OWNED BY public."FriendRequest".id;


--
-- Name: Friend_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Friend_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Friend_id_seq" OWNER TO postgres;

--
-- Name: Friend_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Friend_id_seq" OWNED BY public."Friend".id;


--
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id integer NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "channelId" integer,
    "userId" integer NOT NULL,
    "messageType" public."MessageType" NOT NULL,
    "recipientId" integer
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- Name: MessageReadReceipt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MessageReadReceipt" (
    id integer NOT NULL,
    "messageId" integer NOT NULL,
    "userId" integer NOT NULL,
    "readAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."MessageReadReceipt" OWNER TO postgres;

--
-- Name: MessageReadReceipt_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MessageReadReceipt_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."MessageReadReceipt_id_seq" OWNER TO postgres;

--
-- Name: MessageReadReceipt_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MessageReadReceipt_id_seq" OWNED BY public."MessageReadReceipt".id;


--
-- Name: Message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Message_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Message_id_seq" OWNER TO postgres;

--
-- Name: Message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Message_id_seq" OWNED BY public."Message".id;


--
-- Name: Permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permission" (
    id integer NOT NULL,
    "serverId" integer NOT NULL,
    "userId" integer NOT NULL,
    "roleId" integer NOT NULL
);


ALTER TABLE public."Permission" OWNER TO postgres;

--
-- Name: Permission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Permission_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Permission_id_seq" OWNER TO postgres;

--
-- Name: Permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Permission_id_seq" OWNED BY public."Permission".id;


--
-- Name: Reaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Reaction" (
    id integer NOT NULL,
    emoji text NOT NULL,
    "messageId" integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Reaction" OWNER TO postgres;

--
-- Name: Reaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Reaction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Reaction_id_seq" OWNER TO postgres;

--
-- Name: Reaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Reaction_id_seq" OWNED BY public."Reaction".id;


--
-- Name: Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Role" (
    id integer NOT NULL,
    "serverId" integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Role" OWNER TO postgres;

--
-- Name: Role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Role_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Role_id_seq" OWNER TO postgres;

--
-- Name: Role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Role_id_seq" OWNED BY public."Role".id;


--
-- Name: Server; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Server" (
    id integer NOT NULL,
    name text NOT NULL,
    "iconUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Server" OWNER TO postgres;

--
-- Name: ServerInvite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ServerInvite" (
    id integer NOT NULL,
    "inviteCode" text NOT NULL,
    "serverId" integer NOT NULL,
    "createdById" integer NOT NULL,
    "usedById" integer,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "usedAt" timestamp(3) without time zone,
    "maxUses" integer DEFAULT 1 NOT NULL,
    uses integer DEFAULT 0 NOT NULL,
    "isRevoked" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."ServerInvite" OWNER TO postgres;

--
-- Name: ServerInvite_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ServerInvite_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ServerInvite_id_seq" OWNER TO postgres;

--
-- Name: ServerInvite_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ServerInvite_id_seq" OWNED BY public."ServerInvite".id;


--
-- Name: ServerMember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ServerMember" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "serverId" integer NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "roleId" integer,
    "user.onlineStatus" boolean,
    "user.username" text,
    "user.avatarUrl" text
);


ALTER TABLE public."ServerMember" OWNER TO postgres;

--
-- Name: ServerMember_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ServerMember_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ServerMember_id_seq" OWNER TO postgres;

--
-- Name: ServerMember_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ServerMember_id_seq" OWNED BY public."ServerMember".id;


--
-- Name: Server_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Server_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Server_id_seq" OWNER TO postgres;

--
-- Name: Server_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Server_id_seq" OWNED BY public."Server".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    "avatarUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    password text NOT NULL,
    username text NOT NULL,
    "onlineStatus" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Channel id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Channel" ALTER COLUMN id SET DEFAULT nextval('public."Channel_id_seq"'::regclass);


--
-- Name: Friend id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friend" ALTER COLUMN id SET DEFAULT nextval('public."Friend_id_seq"'::regclass);


--
-- Name: FriendRequest id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FriendRequest" ALTER COLUMN id SET DEFAULT nextval('public."FriendRequest_id_seq"'::regclass);


--
-- Name: Message id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message" ALTER COLUMN id SET DEFAULT nextval('public."Message_id_seq"'::regclass);


--
-- Name: MessageReadReceipt id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MessageReadReceipt" ALTER COLUMN id SET DEFAULT nextval('public."MessageReadReceipt_id_seq"'::regclass);


--
-- Name: Permission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission" ALTER COLUMN id SET DEFAULT nextval('public."Permission_id_seq"'::regclass);


--
-- Name: Reaction id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reaction" ALTER COLUMN id SET DEFAULT nextval('public."Reaction_id_seq"'::regclass);


--
-- Name: Role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role" ALTER COLUMN id SET DEFAULT nextval('public."Role_id_seq"'::regclass);


--
-- Name: Server id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Server" ALTER COLUMN id SET DEFAULT nextval('public."Server_id_seq"'::regclass);


--
-- Name: ServerInvite id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServerInvite" ALTER COLUMN id SET DEFAULT nextval('public."ServerInvite_id_seq"'::regclass);


--
-- Name: ServerMember id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServerMember" ALTER COLUMN id SET DEFAULT nextval('public."ServerMember_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Channel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Channel" (id, "serverId", name, "isVoice", "createdAt") FROM stdin;
1	1	general	f	2024-10-28 20:35:55.485
2	1	tech-news	f	2024-10-28 20:35:55.487
3	2	gaming-talk	f	2024-10-28 20:35:55.489
18	16	general	f	2024-11-19 21:09:23.755
19	16	General	t	2024-11-19 21:09:23.755
20	16	testing voice	t	2024-11-19 21:10:51.075
22	16	test	f	2024-11-20 18:37:50.082
23	16	test	f	2024-12-05 23:40:25.216
24	16	test	t	2024-12-05 23:40:31.69
25	16	new	f	2024-12-21 23:53:26.534
\.


--
-- Data for Name: Friend; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Friend" (id, "userId", "friendId") FROM stdin;
1	1	2
2	2	3
3	1	3
4	7	4
5	4	7
9	4	6
10	6	4
11	6	7
12	7	6
\.


--
-- Data for Name: FriendRequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FriendRequest" (id, "senderId", "recipientId", status, "createdAt") FROM stdin;
2	7	4	ACCEPTED	2024-11-04 19:18:55.57
1	4	7	DECLINED	2024-11-04 18:29:31.971
3	4	6	ACCEPTED	2024-11-05 23:09:09.318
5	6	7	ACCEPTED	2024-11-22 20:24:40.331
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Message" (id, content, "createdAt", "channelId", "userId", "messageType", "recipientId") FROM stdin;
1	Welcome to the server!	2024-10-28 20:35:55.49	1	1	CHANNEL	\N
2	Hey everyone!	2024-10-28 20:35:55.49	1	2	CHANNEL	\N
3	Did you see the latest tech news?	2024-10-28 20:35:55.49	2	3	CHANNEL	\N
4	Who wants to play tonight?	2024-10-28 20:35:55.49	3	1	CHANNEL	\N
5	asd	2024-11-01 22:04:17.631	\N	4	PRIVATE	1
6	asd	2024-11-01 22:04:20.534	\N	4	PRIVATE	1
7	test	2024-11-05 18:21:26.993	\N	4	PRIVATE	7
8	hi	2024-11-05 18:21:33.65	\N	4	PRIVATE	7
9	what is going on 	2024-11-05 18:21:37.367	\N	4	PRIVATE	7
10	hi	2024-11-05 18:23:38.377	\N	7	PRIVATE	4
11	how are you	2024-11-05 18:23:55.001	\N	7	PRIVATE	4
12	hi	2024-11-05 19:26:31.934	\N	4	PRIVATE	7
13	hi	2024-11-05 19:26:41.692	\N	7	PRIVATE	4
14	asd	2024-11-05 19:56:58.101	\N	4	PRIVATE	7
15	real time?	2024-11-05 19:59:44.303	\N	4	PRIVATE	7
16	idk	2024-11-05 20:00:32.421	\N	4	PRIVATE	7
17	nope	2024-11-05 20:00:38.99	\N	7	PRIVATE	4
18	yo	2024-11-05 21:27:57.46	\N	7	PRIVATE	4
19	yo2	2024-11-05 21:28:03.803	\N	7	PRIVATE	4
20	asd	2024-11-05 22:20:29.128	\N	4	PRIVATE	7
21	asd	2024-11-05 22:20:33.557	\N	4	PRIVATE	7
22	asd	2024-11-05 22:20:38.461	\N	4	PRIVATE	7
23	asd	2024-11-05 22:21:20.767	\N	4	PRIVATE	7
24	test2	2024-11-05 22:22:51.758	\N	4	PRIVATE	7
25	hello	2024-11-05 22:25:46.866	\N	4	PRIVATE	7
26	test123	2024-11-05 22:26:45.238	\N	7	PRIVATE	4
27	i think i got it working	2024-11-05 22:27:19.518	\N	7	PRIVATE	4
28	check one	2024-11-05 22:28:29.438	\N	7	PRIVATE	4
29	check scrolling?	2024-11-05 22:30:12.253	\N	7	PRIVATE	4
30	does user send message back?	2024-11-05 22:30:44.509	\N	7	PRIVATE	4
31	test test test	2024-11-05 22:42:15.667	\N	7	PRIVATE	4
32	how are you doing?	2024-11-06 00:07:33.123	\N	7	PRIVATE	4
33	i am doing good	2024-11-06 00:07:38.643	\N	4	PRIVATE	7
34	i am not feeling well today	2024-11-06 00:08:03.945	\N	7	PRIVATE	4
35	asdfasdf	2024-11-06 02:10:32.601	\N	4	PRIVATE	7
36	ok	2024-11-06 02:12:29.729	\N	7	PRIVATE	4
37	hihow are you doing?	2024-11-06 02:13:34.061	\N	7	PRIVATE	4
38	starting chat	2024-11-06 18:02:57.537	\N	4	PRIVATE	6
39	test	2024-11-07 23:12:58.412	\N	4	CHANNEL	\N
40	hi	2024-11-07 23:13:18.12	\N	4	CHANNEL	\N
219	hey	2024-11-20 21:36:06.72	18	7	CHANNEL	\N
220	this should be real time lol	2024-11-20 21:36:22.122	18	4	CHANNEL	\N
224	{"type":"invite","inviteCode":"uwj1werq","serverName":"testing voice","expiresAt":"2024-11-29T20:23:54.209Z","serverId":16}	2024-11-22 20:23:54.274	\N	4	PRIVATE	6
44	{"type":"invite","inviteCode":"9y20h63y","serverName":"My Server","expiresAt":"2024-11-15T21:54:13.983Z"}	2024-11-08 21:54:14.028	\N	4	PRIVATE	7
45	{"type":"invite","inviteCode":"hz2hrx61","serverName":"My Server","expiresAt":"2024-11-15T21:55:50.596Z"}	2024-11-08 21:55:50.641	\N	4	PRIVATE	7
46	http://localhost:3000/server/3/4	2024-11-08 22:09:55.409	\N	4	PRIVATE	7
47	http://localhost:3000/server/3/4	2024-11-08 22:10:45.284	\N	4	PRIVATE	7
226	hey boy	2024-11-28 23:52:13.068	\N	4	PRIVATE	7
227	https://media.tenor.com/svsWKi2A7h4AAAAC/turkey-day-happy.gif	2024-11-28 23:52:28.602	\N	4	PRIVATE	7
50	http://localhost:3000/server/4/6	2024-11-08 22:39:40.747	\N	7	PRIVATE	4
230	test	2024-12-05 21:48:25.686	18	4	CHANNEL	\N
52	asd	2024-11-08 22:41:13.428	\N	4	PRIVATE	6
53	{"type":"invite","inviteCode":"1klm696c","serverName":"My Server","expiresAt":"2024-11-15T23:41:53.455Z"}	2024-11-08 23:41:53.499	\N	4	PRIVATE	7
54	http://localhost:3000/server/3/4	2024-11-08 23:42:44.504	\N	7	PRIVATE	4
55	http://localhost:3000/server/3/4	2024-11-08 23:42:59.049	\N	4	PRIVATE	7
56	http://localhost:3000/server/3/4	2024-11-08 23:43:05.935	\N	4	PRIVATE	7
57	hi	2024-11-09 22:25:55.837	\N	7	PRIVATE	4
59	invalid date	2024-11-09 22:26:13.062	\N	7	PRIVATE	4
60	hi	2024-11-09 22:27:56.999	\N	4	PRIVATE	7
61	testing time	2024-11-09 22:31:25.326	\N	4	PRIVATE	7
62	test	2024-11-09 22:33:08.348	\N	4	PRIVATE	7
63	hi	2024-11-09 22:35:37.885	\N	4	PRIVATE	7
64	asd	2024-11-09 22:35:45.278	\N	4	PRIVATE	7
65	hi	2024-11-09 22:38:02.718	\N	4	PRIVATE	7
66	test 123	2024-11-09 22:38:26.127	\N	4	PRIVATE	7
67	hi	2024-11-09 22:40:57.188	\N	4	PRIVATE	7
68	what is going on	2024-11-09 22:41:20.133	\N	4	PRIVATE	7
69	test	2024-11-09 23:00:48.696	\N	4	PRIVATE	7
70	testtesttest	2024-11-09 23:02:01.263	\N	4	PRIVATE	7
71	test	2024-11-09 23:03:36.601	\N	4	PRIVATE	7
72	hi	2024-11-09 23:06:18.279	\N	4	PRIVATE	7
73	wttt	2024-11-09 23:07:02.922	\N	4	PRIVATE	7
74	test	2024-11-09 23:08:17.843	\N	4	PRIVATE	7
75	hi	2024-11-09 23:10:31.222	\N	7	PRIVATE	4
76	hmm	2024-11-09 23:10:37.27	\N	7	PRIVATE	4
77	http://localhost:3000/server/3/4	2024-11-09 23:10:56.709	\N	4	PRIVATE	7
78	http://localhost:3000/server/3/4	2024-11-09 23:37:54.792	\N	4	PRIVATE	7
79	{"type":"invite","inviteCode":"gm90x7gj","serverName":"My Server","expiresAt":"2024-11-16T23:42:14.530Z"}	2024-11-09 23:42:14.543	\N	7	PRIVATE	4
80	{"type":"invite","inviteCode":"4ris9fu0","serverName":"My Server","expiresAt":"2024-11-17T00:27:16.282Z"}	2024-11-10 00:27:16.29	\N	4	PRIVATE	7
81	{"type":"invite","inviteCode":"mhujqgmh","serverName":"My Server","expiresAt":"2024-11-17T00:27:28.857Z"}	2024-11-10 00:27:28.898	\N	4	PRIVATE	7
82	http://localhost:3000/server/3/4	2024-11-10 02:17:19.553	\N	4	PRIVATE	7
83	http://localhost:3000/server/3/4	2024-11-10 02:25:17.418	\N	4	PRIVATE	7
84	http://localhost:3000/server/3/4	2024-11-10 02:27:22.576	\N	4	PRIVATE	7
85	http://localhost:3000/server/3/4	2024-11-10 03:34:39.616	\N	4	PRIVATE	7
86	http://localhost:3000/server/3/4	2024-11-10 03:41:52.957	\N	4	PRIVATE	7
87	{"type":"invite","inviteCode":"uox8kqo5","serverName":"My Server","expiresAt":"2024-11-17T03:41:52.955Z"}	2024-11-10 03:41:53.007	\N	4	PRIVATE	7
88	http://localhost:3000/server/3/4	2024-11-10 03:42:55.837	\N	4	PRIVATE	7
89	{"type":"invite","inviteCode":"kvyxqn2s","serverName":"My Server","expiresAt":"2024-11-17T03:42:55.834Z"}	2024-11-10 03:42:55.876	\N	4	PRIVATE	7
90	test	2024-11-10 03:47:37.518	\N	4	PRIVATE	7
91	test	2024-11-10 03:47:38.5	\N	4	PRIVATE	7
92	{"type":"invite","inviteCode":"pv62b5rz","serverName":"My Server","expiresAt":"2024-11-17T03:47:47.118Z"}	2024-11-10 03:47:47.163	\N	4	PRIVATE	7
93	http://localhost:3000/server/3/4	2024-11-10 03:47:47.173	\N	4	PRIVATE	7
94	{"type":"invite","inviteCode":"b23dsh5x","serverName":"My Server","expiresAt":"2024-11-17T03:55:36.765Z"}	2024-11-10 03:55:36.811	\N	4	PRIVATE	7
95	test reset	2024-11-10 03:56:01.207	\N	4	PRIVATE	7
96	test reset	2024-11-10 03:56:02.113	\N	4	PRIVATE	7
97	test reset	2024-11-10 03:56:02.858	\N	4	PRIVATE	7
98	{"type":"invite","inviteCode":"ns8x9j1h","serverName":"My Server","expiresAt":"2024-11-17T03:56:07.595Z"}	2024-11-10 03:56:07.639	\N	4	PRIVATE	7
99	{"type":"invite","inviteCode":"krg0nhax","serverName":"My Server","expiresAt":"2024-11-17T04:09:02.250Z"}	2024-11-10 04:09:02.305	\N	4	PRIVATE	7
100	{"type":"invite","inviteCode":"2avc3042","serverName":"My Server","expiresAt":"2024-11-17T21:17:41.351Z"}	2024-11-10 21:17:41.427	\N	4	PRIVATE	7
101	{"type":"invite","inviteCode":"o991uz60","serverName":"My Server","expiresAt":"2024-11-17T21:28:11.765Z"}	2024-11-10 21:28:11.859	\N	4	PRIVATE	7
102	{"type":"invite","inviteCode":"nug6emus","serverName":"My Server","expiresAt":"2024-11-17T21:39:17.077Z","serverId":3}	2024-11-10 21:39:17.123	\N	4	PRIVATE	7
103	{"type":"invite","inviteCode":"w1qbybm6","serverName":"My Server","expiresAt":"2024-11-17T21:39:32.154Z","serverId":3}	2024-11-10 21:39:32.159	\N	4	PRIVATE	7
104	{"type":"invite","inviteCode":"xim9vkr1","serverName":"My Server","expiresAt":"2024-11-17T21:41:03.382Z","serverId":3}	2024-11-10 21:41:03.396	\N	4	PRIVATE	7
105	'http://localhost:3000/server/3/4'	2024-11-10 21:42:28.78	\N	4	PRIVATE	7
106	{"type":"invite","inviteCode":"wlvy25vc","serverName":"My Server","expiresAt":"2024-11-17T21:56:22.240Z","serverId":8}	2024-11-10 21:56:22.285	\N	4	PRIVATE	7
107	{"type":"invite","inviteCode":"kxwpjkzx","serverName":"My Server","expiresAt":"2024-11-17T21:56:27.390Z","serverId":8}	2024-11-10 21:56:27.431	\N	4	PRIVATE	7
108	{"type":"invite","inviteCode":"izozklis","serverName":"New Server","expiresAt":"2024-11-18T19:01:34.682Z","serverId":10}	2024-11-11 19:01:34.728	\N	4	PRIVATE	7
109	ge	2024-11-11 19:29:51.436	\N	7	PRIVATE	4
110	{"type":"invite","inviteCode":"t5m4wdy8","serverName":"New Server","expiresAt":"2024-11-18T19:30:53.417Z","serverId":10}	2024-11-11 19:30:53.463	\N	4	PRIVATE	6
111	let's try the second link	2024-11-11 19:31:15.151	\N	4	PRIVATE	6
112	{"type":"invite","inviteCode":"pd35wyjp","serverName":"New Server","expiresAt":"2024-11-18T19:31:16.395Z","serverId":10}	2024-11-11 19:31:16.399	\N	4	PRIVATE	6
221	hey	2024-11-20 21:36:56.762	\N	4	PRIVATE	7
222	whats going on?	2024-11-20 21:37:01.769	\N	4	PRIVATE	7
223	es real time?	2024-11-20 21:37:43.144	22	7	CHANNEL	\N
225	{"type":"invite","inviteCode":"qf3rgen0","serverName":"testing voice","expiresAt":"2024-11-29T20:25:02.624Z","serverId":16}	2024-11-22 20:25:02.668	\N	7	PRIVATE	6
228	its been quite some time	2024-12-05 21:18:34.385	18	4	CHANNEL	\N
231	yo	2024-12-05 21:48:57.602	18	7	CHANNEL	\N
233	hi	2024-12-05 21:53:39.565	18	7	CHANNEL	\N
235	ho	2024-12-05 21:55:50.153	18	7	CHANNEL	\N
237	him	2024-12-05 21:56:38.105	18	7	CHANNEL	\N
238	now is it real time?	2024-12-05 21:56:46.952	18	7	CHANNEL	\N
239	gues so	2024-12-05 21:56:52.171	18	4	CHANNEL	\N
124	es	2024-11-13 19:21:47.983	\N	4	PRIVATE	6
125	test	2024-11-13 19:22:54.195	\N	4	PRIVATE	7
126	asd	2024-11-13 19:42:23.708	\N	4	PRIVATE	7
240	lol	2024-12-05 21:56:54.015	18	4	CHANNEL	\N
243	hi	2024-12-05 22:03:56.863	22	4	CHANNEL	\N
129	hi	2024-11-13 19:55:47.535	\N	4	PRIVATE	7
130	asd	2024-11-13 19:56:56.776	\N	4	PRIVATE	7
247	hey	2024-12-05 22:05:05.681	22	4	CHANNEL	\N
248	re	2024-12-05 22:05:32.656	18	4	CHANNEL	\N
252	test	2024-12-05 22:07:54.802	22	7	CHANNEL	\N
254	hi	2024-12-05 22:08:39.2	22	4	CHANNEL	\N
257	ok	2024-12-05 22:09:24.971	18	7	CHANNEL	\N
258	hi	2024-12-05 22:10:13.015	18	7	CHANNEL	\N
260	hi	2024-12-05 22:12:44.215	\N	7	PRIVATE	4
261	adsf	2024-12-05 22:14:43.005	18	4	CHANNEL	\N
139	test	2024-11-13 20:49:31.977	\N	4	PRIVATE	7
140	test2	2024-11-13 20:49:34.047	\N	4	PRIVATE	7
262	qwer	2024-12-05 22:14:54.636	18	7	CHANNEL	\N
142	testing alignment	2024-11-13 22:33:31.299	\N	4	PRIVATE	6
268	asdf	2024-12-05 22:17:17.557	18	4	CHANNEL	\N
144	asd	2024-11-13 22:42:29.143	\N	4	PRIVATE	6
269	te	2024-12-05 22:17:23.878	18	4	CHANNEL	\N
277	tete	2024-12-05 22:22:51.94	18	4	CHANNEL	\N
278	tetete	2024-12-05 22:23:07.118	18	4	CHANNEL	\N
279	raw	2024-12-05 22:23:14.478	18	4	CHANNEL	\N
149	asdf	2024-11-13 22:49:37.595	\N	4	PRIVATE	7
280	hey	2024-12-05 22:24:47.972	18	4	CHANNEL	\N
282	hey	2024-12-05 22:51:21.047	18	4	CHANNEL	\N
283	return	2024-12-05 22:51:29.133	18	7	CHANNEL	\N
286	test1	2024-12-05 22:52:37.575	18	4	CHANNEL	\N
287	https://media.tenor.com/VRowXt_xbckAAAAC/snow-day.gif	2024-12-05 22:56:11.364	18	7	CHANNEL	\N
155	no	2024-11-15 00:52:42.808	\N	4	PRIVATE	7
156	time 	2024-11-15 00:52:43.949	\N	4	PRIVATE	7
157	difference	2024-11-15 00:52:46.804	\N	4	PRIVATE	7
158	ok	2024-11-15 00:55:45.902	\N	4	PRIVATE	7
288	https://media.tenor.com/xmKk1OuaRM4AAAAC/good-thursday-morning.gif	2024-12-05 22:56:17.56	18	7	CHANNEL	\N
289	hi	2024-12-05 22:56:45.653	18	4	CHANNEL	\N
291	hello	2024-12-05 23:30:39.038	18	4	CHANNEL	\N
292	hello	2024-12-05 23:30:46.102	18	7	CHANNEL	\N
295	hi	2024-12-05 23:33:30.364	18	4	CHANNEL	\N
296	hi	2024-12-05 23:33:39.981	18	4	CHANNEL	\N
297	hi	2024-12-05 23:33:40.987	18	4	CHANNEL	\N
298	\\hi	2024-12-05 23:33:41.85	18	4	CHANNEL	\N
299	hi	2024-12-05 23:33:43.043	18	4	CHANNEL	\N
300	es	2024-12-05 23:37:25.966	22	4	CHANNEL	\N
302	hi	2024-12-11 19:52:27.118	\N	4	PRIVATE	7
305	how are you doing?	2024-12-11 20:03:27.188	\N	4	PRIVATE	7
306	i am doing good	2024-12-11 20:03:32.756	\N	7	PRIVATE	4
307	really? that's funny cuz you are not working?	2024-12-11 20:03:48.172	\N	4	PRIVATE	7
312	we are here baby	2024-12-11 20:30:27.982	18	7	CHANNEL	\N
315	we here baby	2024-12-11 20:32:30.394	18	4	CHANNEL	\N
318	we here	2024-12-11 20:33:10.294	18	7	CHANNEL	\N
322	asdf	2024-12-11 20:37:48.031	18	7	CHANNEL	\N
326	we	2024-12-11 20:42:10.687	18	7	CHANNEL	\N
178	"https://media.tenor.com/zYjQCxU9GQYAAAAC/sleep.gif"	2024-11-18 19:00:54.666	\N	4	PRIVATE	6
179	lol	2024-11-18 19:01:40.693	\N	4	PRIVATE	6
180	what's going on ?	2024-11-18 19:01:47.268	\N	4	PRIVATE	6
181	hi	2024-11-18 19:11:21.595	\N	4	PRIVATE	6
182	hey	2024-11-18 19:12:23.645	\N	4	PRIVATE	6
183	testing testing	2024-11-18 19:18:25.05	\N	4	PRIVATE	6
184	testing 2	2024-11-18 19:19:01.124	\N	4	PRIVATE	6
185	test	2024-11-18 19:21:26.881	\N	4	PRIVATE	6
186	test	2024-11-18 19:21:43.048	\N	4	PRIVATE	6
187	testtesttest	2024-11-18 19:22:08.097	\N	4	PRIVATE	6
188	es	2024-11-18 19:25:31.367	\N	4	PRIVATE	6
189	check check	2024-11-18 19:27:14.898	\N	4	PRIVATE	6
190	check	2024-11-18 19:27:21.232	\N	4	PRIVATE	7
191	as	2024-11-18 19:30:30.128	\N	4	PRIVATE	6
192	https://media.tenor.com/0qoqr3q9troAAAAC/monday-monday-mood.gif	2024-11-18 20:15:28.23	\N	4	PRIVATE	7
193	😀	2024-11-18 20:16:29.838	\N	4	PRIVATE	7
194	😃	2024-11-18 20:16:34.959	\N	4	PRIVATE	7
327	we	2024-12-11 20:42:14.243	18	7	CHANNEL	\N
332	we	2024-12-11 20:45:36.149	18	7	CHANNEL	\N
334	hey	2024-12-11 20:46:43.662	18	7	CHANNEL	\N
338	we are did	2024-12-11 20:58:00.569	18	4	CHANNEL	\N
229	hi	2024-12-05 21:47:07.74	18	4	CHANNEL	\N
232	yo	2024-12-05 21:50:16.931	18	7	CHANNEL	\N
234	hey	2024-12-05 21:55:10.856	18	7	CHANNEL	\N
236	he	2024-12-05 21:56:02	18	7	CHANNEL	\N
241	hi	2024-12-05 22:03:04.352	18	4	CHANNEL	\N
242	also hi	2024-12-05 22:03:18.136	18	4	CHANNEL	\N
244	hi	2024-12-05 22:04:23.401	22	4	CHANNEL	\N
245	hey	2024-12-05 22:04:45.696	22	7	CHANNEL	\N
246	hey	2024-12-05 22:04:50.478	18	7	CHANNEL	\N
249	hey 	2024-12-05 22:06:52.722	18	4	CHANNEL	\N
250	hi	2024-12-05 22:06:58.33	18	7	CHANNEL	\N
251	ok	2024-12-05 22:07:10.326	22	7	CHANNEL	\N
253	hi	2024-12-05 22:08:32.494	22	7	CHANNEL	\N
255	okay	2024-12-05 22:08:53.45	22	7	CHANNEL	\N
256	okay	2024-12-05 22:09:01.078	18	7	CHANNEL	\N
259	asdf	2024-12-05 22:11:26.881	22	4	CHANNEL	\N
263	hi	2024-12-05 22:16:25.678	18	4	CHANNEL	\N
264	asdf	2024-12-05 22:16:46.391	18	4	CHANNEL	\N
217	gang	2024-11-19 21:12:36.548	18	4	CHANNEL	\N
218	{"type":"invite","inviteCode":"qgiezbzl","serverName":"testing voice","expiresAt":"2024-11-27T21:34:23.386Z","serverId":16}	2024-11-20 21:34:23.439	\N	4	PRIVATE	7
265	asdf	2024-12-05 22:16:54.071	18	4	CHANNEL	\N
266	qewr	2024-12-05 22:16:56.179	18	4	CHANNEL	\N
267	qwer	2024-12-05 22:16:58.645	18	7	CHANNEL	\N
270	teeee	2024-12-05 22:17:35.094	18	4	CHANNEL	\N
271	asdf	2024-12-05 22:17:46.092	18	4	CHANNEL	\N
272	erer	2024-12-05 22:17:53.803	18	7	CHANNEL	\N
273	er	2024-12-05 22:17:58.226	18	7	CHANNEL	\N
274	testtest	2024-12-05 22:20:18.454	18	4	CHANNEL	\N
275	rere	2024-12-05 22:20:41.534	18	4	CHANNEL	\N
276	tete	2024-12-05 22:21:56.63	18	4	CHANNEL	\N
281	hi	2024-12-05 22:27:46.323	18	4	CHANNEL	\N
284	re	2024-12-05 22:51:44.489	18	4	CHANNEL	\N
285	return	2024-12-05 22:51:52.841	18	4	CHANNEL	\N
290	hi	2024-12-05 23:24:19.176	18	7	CHANNEL	\N
293	yo	2024-12-05 23:32:07.615	18	4	CHANNEL	\N
294	eses	2024-12-05 23:32:13.255	18	7	CHANNEL	\N
301	😀	2024-12-11 19:50:34.069	\N	4	PRIVATE	7
303	hi how are you	2024-12-11 19:58:33.404	\N	7	PRIVATE	4
304	hey	2024-12-11 19:58:47.996	\N	4	PRIVATE	7
308	hey	2024-12-11 20:05:13.969	\N	4	PRIVATE	7
309	whats going on 	2024-12-11 20:05:18.714	\N	7	PRIVATE	4
310	not much 	2024-12-11 20:05:24.419	\N	4	PRIVATE	7
311	hey	2024-12-11 20:08:04.675	\N	7	PRIVATE	4
313	we	2024-12-11 20:30:40.181	18	7	CHANNEL	\N
314	we	2024-12-11 20:30:57.439	18	4	CHANNEL	\N
316	we we	2024-12-11 20:32:50.783	\N	4	PRIVATE	7
317	what's good dog	2024-12-11 20:32:58.67	\N	7	PRIVATE	4
319	we are here baby	2024-12-11 20:34:18.687	18	7	CHANNEL	\N
320	what is going on	2024-12-11 20:34:23.564	18	7	CHANNEL	\N
321	where is the typing indicator	2024-12-11 20:34:30.941	18	7	CHANNEL	\N
323	we	2024-12-11 20:41:20.645	18	7	CHANNEL	\N
324	are not live	2024-12-11 20:41:23.577	18	7	CHANNEL	\N
325	we are not live	2024-12-11 20:41:31.642	18	7	CHANNEL	\N
328	wtf is going on	2024-12-11 20:42:22.235	18	4	CHANNEL	\N
329	we are not	2024-12-11 20:43:03.598	18	7	CHANNEL	\N
330	we	2024-12-11 20:43:21.221	18	7	CHANNEL	\N
331	we	2024-12-11 20:44:12.276	18	7	CHANNEL	\N
333	hey	2024-12-11 20:46:06.596	18	7	CHANNEL	\N
335	we are not connected	2024-12-11 20:57:27.09	18	7	CHANNEL	\N
336	lksjdaslkdjfsldkfja	2024-12-11 20:57:29.968	18	7	CHANNEL	\N
337	wer are adsf	2024-12-11 20:57:41.73	18	4	CHANNEL	\N
339	okokokokok	2024-12-11 20:58:46.346	18	4	CHANNEL	\N
340	we	2024-12-11 21:01:47.728	18	4	CHANNEL	\N
341	are not real time	2024-12-11 21:01:50.75	18	4	CHANNEL	\N
342	we	2024-12-11 21:03:23.401	18	7	CHANNEL	\N
343	we	2024-12-11 21:07:46.585	\N	4	PRIVATE	7
344	we	2024-12-11 21:07:48.894	\N	4	PRIVATE	7
345	are	2024-12-11 21:08:57.374	18	4	CHANNEL	\N
346	hey	2024-12-11 21:20:09.654	18	4	CHANNEL	\N
347	we	2024-12-11 21:20:21.276	18	7	CHANNEL	\N
348	we	2024-12-11 21:21:17.478	18	4	CHANNEL	\N
349	we	2024-12-11 21:21:29.822	18	4	CHANNEL	\N
350	we	2024-12-11 21:21:35.388	18	7	CHANNEL	\N
351	we	2024-12-11 21:24:33.596	18	4	CHANNEL	\N
352	are 	2024-12-11 21:24:35.771	18	4	CHANNEL	\N
353	good	2024-12-11 21:24:36.882	18	4	CHANNEL	\N
354	we	2024-12-11 21:25:04.581	18	4	CHANNEL	\N
355	we	2024-12-11 21:25:50.52	18	4	CHANNEL	\N
356	we are not yet	2024-12-11 21:26:24.807	18	4	CHANNEL	\N
357	what should be happeing	2024-12-11 21:29:24.568	18	4	CHANNEL	\N
358	we	2024-12-11 21:29:34.012	18	7	CHANNEL	\N
359	we are typing	2024-12-11 21:32:17.081	18	4	CHANNEL	\N
360	we want to know	2024-12-11 21:32:57.357	18	4	CHANNEL	\N
361	we	2024-12-11 21:33:52.731	18	4	CHANNEL	\N
362	we	2024-12-11 21:34:17.557	18	4	CHANNEL	\N
363	we see nothing	2024-12-11 21:34:26.364	18	7	CHANNEL	\N
364	we are not getting anything	2024-12-11 21:36:27.572	18	4	CHANNEL	\N
365	werwerwerwerwer	2024-12-11 21:39:46.17	18	7	CHANNEL	\N
366	we are	2024-12-11 21:45:43.787	18	4	CHANNEL	\N
367	we are	2024-12-11 21:46:23.955	18	4	CHANNEL	\N
368	we	2024-12-11 21:47:05.27	18	7	CHANNEL	\N
369	hi	2024-12-11 21:47:49.706	18	7	CHANNEL	\N
370	hi	2024-12-11 21:48:13.815	18	7	CHANNEL	\N
371	we	2024-12-11 21:48:31.521	18	7	CHANNEL	\N
372	we	2024-12-11 21:49:02.121	18	7	CHANNEL	\N
373	we	2024-12-11 21:49:06.448	18	4	CHANNEL	\N
374	wewe	2024-12-11 21:56:03.856	18	4	CHANNEL	\N
375	we are testing	2024-12-11 22:01:17.047	18	4	CHANNEL	\N
376	god damnit 	2024-12-11 22:03:07.569	18	4	CHANNEL	\N
377	we up	2024-12-11 22:04:21.757	18	4	CHANNEL	\N
378	we up	2024-12-11 22:08:08.548	18	4	CHANNEL	\N
379	yo	2024-12-11 22:10:25.469	18	4	CHANNEL	\N
380	nothing	2024-12-11 22:10:27.824	18	4	CHANNEL	\N
381	yo	2024-12-11 22:11:24.764	18	4	CHANNEL	\N
382	yo	2024-12-11 22:12:17.173	18	4	CHANNEL	\N
383	yoyo	2024-12-11 22:12:24.653	18	4	CHANNEL	\N
384	we	2024-12-11 22:13:26.293	18	4	CHANNEL	\N
385	yo	2024-12-11 22:15:14.42	18	7	CHANNEL	\N
386	yo	2024-12-11 22:54:29.247	18	4	CHANNEL	\N
387	hey	2024-12-11 23:06:42.156	18	7	CHANNEL	\N
388	hey	2024-12-11 23:07:31.809	18	7	CHANNEL	\N
389	what good	2024-12-11 23:26:32.855	\N	7	PRIVATE	4
390	we are here	2024-12-11 23:26:38.744	\N	4	PRIVATE	7
391	hi	2024-12-12 19:54:31.253	\N	4	PRIVATE	7
392	hi	2024-12-12 19:55:21.796	\N	7	PRIVATE	4
393	hey	2024-12-12 20:07:55.797	\N	7	PRIVATE	4
394	yo	2024-12-12 20:09:19.405	\N	7	PRIVATE	4
395	we	2024-12-12 20:09:47.86	\N	7	PRIVATE	4
396	we	2024-12-12 20:10:00.908	\N	7	PRIVATE	4
397	as	2024-12-12 20:11:06.046	\N	7	PRIVATE	4
398	as	2024-12-12 20:11:14.852	\N	7	PRIVATE	4
399	90	2024-12-12 20:11:29.173	\N	7	PRIVATE	4
400	hey	2024-12-12 20:14:16.972	\N	7	PRIVATE	4
401	hey	2024-12-12 20:14:57.085	\N	7	PRIVATE	4
402	hey	2024-12-12 20:16:01.971	\N	7	PRIVATE	4
403	hello	2024-12-12 20:37:17.594	\N	7	PRIVATE	4
404	hey	2024-12-12 20:37:36.704	\N	4	PRIVATE	7
405	hey	2024-12-12 20:41:33.744	\N	7	PRIVATE	4
406	what's good dang?	2024-12-12 20:41:43.566	\N	4	PRIVATE	7
407	hey	2024-12-12 20:50:14.291	\N	7	PRIVATE	4
408	yo	2024-12-12 20:50:57.71	\N	4	PRIVATE	7
409	how are you doing?	2024-12-12 20:51:01.827	\N	4	PRIVATE	7
410	hey how are you doing?	2024-12-12 20:51:39.497	\N	4	PRIVATE	7
411	hey	2024-12-12 20:54:45.474	\N	7	PRIVATE	4
412	hi	2024-12-12 20:55:38.594	\N	7	PRIVATE	4
413	hi	2024-12-12 20:55:44.78	\N	4	PRIVATE	7
414	hi	2024-12-12 20:56:13.17	\N	7	PRIVATE	4
415	hi	2024-12-12 20:56:37.721	\N	7	PRIVATE	4
416	hey	2024-12-12 21:00:05.297	\N	7	PRIVATE	4
417	how long do we	2024-12-12 21:00:15.531	\N	4	PRIVATE	7
418	gang	2024-12-12 21:00:23.283	\N	4	PRIVATE	7
419	we	2024-12-12 21:00:30.74	\N	4	PRIVATE	7
420	lol	2024-12-12 21:00:36.865	\N	4	PRIVATE	7
421	check	2024-12-12 21:00:44.347	\N	4	PRIVATE	7
422	yo	2024-12-12 21:04:14.851	\N	4	PRIVATE	7
423	hey	2024-12-12 21:04:20.249	\N	7	PRIVATE	4
424	hey	2024-12-12 21:05:27.072	\N	7	PRIVATE	4
425	hey	2024-12-12 21:10:15.566	\N	4	PRIVATE	7
426	hey	2024-12-12 21:10:24.155	\N	7	PRIVATE	4
427	hey	2024-12-12 21:12:15.203	\N	7	PRIVATE	4
428	hey	2024-12-12 21:13:15.424	\N	7	PRIVATE	4
429	hey	2024-12-12 21:14:20.48	\N	4	PRIVATE	7
430	hi	2024-12-12 22:13:03.376	\N	7	PRIVATE	4
431	we	2024-12-12 22:13:19.565	\N	7	PRIVATE	4
432	uhoh	2024-12-12 22:13:24.075	\N	7	PRIVATE	4
433	we	2024-12-12 22:14:11.685	\N	7	PRIVATE	4
434	we	2024-12-12 22:14:19.068	\N	7	PRIVATE	4
435	ok	2024-12-12 22:14:48.583	\N	7	PRIVATE	4
436	ok\\	2024-12-12 22:15:27.159	\N	4	PRIVATE	7
437	hi	2024-12-12 22:16:08.621	\N	4	PRIVATE	7
438	hi	2024-12-12 22:16:39.167	\N	4	PRIVATE	7
439	hi	2024-12-12 22:17:31.272	\N	7	PRIVATE	4
440	hi	2024-12-12 22:17:47.869	\N	7	PRIVATE	4
441	hi	2024-12-12 22:18:11.271	\N	7	PRIVATE	4
442	hi	2024-12-12 22:19:38.37	\N	7	PRIVATE	4
443	hi	2024-12-12 22:44:26.82	\N	4	PRIVATE	7
444	yo	2024-12-12 22:46:23.312	\N	7	PRIVATE	4
445	yo	2024-12-12 22:46:29.806	\N	4	PRIVATE	7
446	hey	2024-12-12 22:46:57.569	\N	4	PRIVATE	7
447	hey	2024-12-12 22:48:43.214	\N	7	PRIVATE	4
448	hi	2024-12-12 23:03:40.285	\N	7	PRIVATE	4
449	hi	2024-12-12 23:04:54.189	\N	4	PRIVATE	7
450	helllo	2024-12-12 23:05:26.252	\N	4	PRIVATE	7
451	hello	2024-12-12 23:05:40.86	\N	4	PRIVATE	7
452	hi	2024-12-12 23:06:22.621	\N	4	PRIVATE	7
453	are we good	2024-12-12 23:06:42.587	\N	4	PRIVATE	7
454	hi	2024-12-12 23:24:05.378	\N	7	PRIVATE	4
455	hi	2024-12-12 23:24:14.611	\N	4	PRIVATE	7
456	hi	2024-12-12 23:24:59.161	\N	4	PRIVATE	7
457	hello	2024-12-12 23:25:17.795	\N	4	PRIVATE	7
458	now	2024-12-12 23:26:07.578	\N	4	PRIVATE	7
459	hellllllllllo	2024-12-12 23:26:58.304	\N	4	PRIVATE	7
460	yes sire?	2024-12-12 23:30:46.922	\N	7	PRIVATE	4
461	hi	2024-12-12 23:31:46.017	\N	7	PRIVATE	4
462	ho	2024-12-12 23:31:52.424	\N	7	PRIVATE	4
463	hi	2024-12-12 23:32:15.393	\N	4	PRIVATE	7
464	goodbye	2024-12-12 23:32:44.729	\N	4	PRIVATE	7
465	testing	2024-12-12 23:33:31.161	\N	4	PRIVATE	7
466	hihihi	2024-12-12 23:34:42.296	\N	4	PRIVATE	7
467	yo	2024-12-12 23:34:58.502	\N	7	PRIVATE	4
468	yo	2024-12-12 23:35:06.582	\N	4	PRIVATE	7
469	testing testing	2024-12-12 23:36:17.019	\N	4	PRIVATE	7
470	test2	2024-12-12 23:36:45.481	\N	4	PRIVATE	7
471	hi	2024-12-12 23:38:29.8	\N	4	PRIVATE	7
472	what	2024-12-12 23:41:09.504	\N	4	PRIVATE	7
473	hi	2024-12-12 23:42:33.111	\N	4	PRIVATE	7
474	wtf	2024-12-12 23:43:49.627	\N	4	PRIVATE	7
475	wtffffff	2024-12-12 23:45:18.608	\N	4	PRIVATE	7
476	wtf	2024-12-12 23:45:49.265	\N	4	PRIVATE	7
477	wtf	2024-12-12 23:45:56.583	\N	4	PRIVATE	7
478	hold	2024-12-12 23:46:16.37	\N	4	PRIVATE	7
479	hey	2024-12-12 23:46:33.28	\N	4	PRIVATE	7
480	yo	2024-12-12 23:47:23.097	\N	4	PRIVATE	7
481	hiiiiiii	2024-12-12 23:49:13.27	\N	4	PRIVATE	7
482	asdf	2024-12-12 23:50:02.768	\N	4	PRIVATE	7
483	ok	2024-12-12 23:51:47.865	\N	4	PRIVATE	7
484	werewolf	2024-12-12 23:53:09.604	\N	4	PRIVATE	7
485	arf	2024-12-12 23:54:30.519	\N	4	PRIVATE	7
486	we	2024-12-12 23:54:58.037	\N	4	PRIVATE	7
487	we	2024-12-12 23:55:10.621	\N	4	PRIVATE	7
488	we	2024-12-12 23:55:12.386	\N	4	PRIVATE	7
489	we	2024-12-12 23:55:13.522	\N	4	PRIVATE	7
490	re	2024-12-12 23:56:43.767	\N	4	PRIVATE	7
491	test	2024-12-12 23:58:28.66	\N	4	PRIVATE	7
492	good day	2024-12-12 23:58:50.978	\N	4	PRIVATE	7
493	hey	2024-12-13 00:00:22.694	\N	4	PRIVATE	7
494	good night	2024-12-13 00:00:50.028	\N	4	PRIVATE	7
495	hi	2024-12-13 00:01:54.894	\N	4	PRIVATE	7
496	hi	2024-12-13 20:16:34.609	\N	4	PRIVATE	7
497	hi	2024-12-13 20:21:17.8	\N	4	PRIVATE	7
498	hi	2024-12-13 20:22:29.659	\N	4	PRIVATE	7
499	hey	2024-12-13 20:23:48.082	\N	4	PRIVATE	7
500	ho	2024-12-13 20:24:11.631	\N	4	PRIVATE	7
501	heave	2024-12-13 20:24:40.756	\N	4	PRIVATE	7
502	hey	2024-12-13 20:24:53.556	\N	4	PRIVATE	7
503	hi	2024-12-13 20:25:14.822	\N	4	PRIVATE	7
504	hi	2024-12-13 20:25:30.841	\N	4	PRIVATE	7
505	hi	2024-12-13 20:27:12.124	\N	4	PRIVATE	7
506	hello	2024-12-13 21:04:50.658	\N	7	PRIVATE	4
507	hi	2024-12-13 21:05:04.788	\N	7	PRIVATE	4
508	hi	2024-12-13 21:08:20.143	\N	7	PRIVATE	4
509	hi	2024-12-13 21:10:52.918	\N	7	PRIVATE	4
510	hi	2024-12-13 21:11:15.597	\N	7	PRIVATE	4
511	hi	2024-12-13 21:11:18.116	\N	7	PRIVATE	4
512	hi	2024-12-13 21:13:07.343	\N	7	PRIVATE	4
513	hi	2024-12-13 21:13:08.779	\N	7	PRIVATE	4
514	hi	2024-12-13 21:16:30.495	\N	7	PRIVATE	4
515	hi	2024-12-13 21:21:26.533	\N	7	PRIVATE	4
516	hi	2024-12-13 21:23:44.618	\N	7	PRIVATE	4
517	hi	2024-12-13 21:25:27.828	\N	7	PRIVATE	4
518	hello	2024-12-13 21:25:36.881	\N	7	PRIVATE	4
519	hi	2024-12-13 21:26:21.586	\N	7	PRIVATE	4
520	hi	2024-12-13 21:27:10.669	\N	7	PRIVATE	4
521	hi	2024-12-13 21:35:32.536	\N	7	PRIVATE	4
522	test	2024-12-13 22:47:56.231	\N	7	PRIVATE	4
523	test	2024-12-13 22:49:12.485	\N	7	PRIVATE	4
524	test	2024-12-13 22:49:13.865	\N	7	PRIVATE	4
525	test	2024-12-13 22:49:21.389	\N	7	PRIVATE	4
526	test	2024-12-13 22:50:41.616	\N	7	PRIVATE	4
527	test	2024-12-13 22:50:42.9	\N	7	PRIVATE	4
528	test	2024-12-13 22:50:44.667	\N	7	PRIVATE	4
529	test	2024-12-13 22:50:52.949	\N	7	PRIVATE	4
530	test	2024-12-13 22:52:37.684	\N	7	PRIVATE	4
531	test	2024-12-13 22:52:45.757	\N	7	PRIVATE	4
532	hey	2024-12-13 22:53:52.605	\N	6	PRIVATE	4
533	hi	2024-12-13 22:55:33.384	\N	6	PRIVATE	4
534	two	2024-12-13 22:55:45.788	\N	6	PRIVATE	4
535	we	2024-12-13 22:56:47.773	\N	6	PRIVATE	4
536	are tjust the best	2024-12-13 22:56:50.113	\N	6	PRIVATE	4
537	we	2024-12-13 22:56:56.419	\N	6	PRIVATE	4
538	good morning	2024-12-13 23:19:42.608	\N	4	PRIVATE	7
539	hi	2024-12-13 23:22:25.113	\N	4	PRIVATE	7
540	hi	2024-12-13 23:22:46.953	\N	4	PRIVATE	7
541	test 123	2024-12-13 23:24:27.911	\N	4	PRIVATE	7
542	hi	2024-12-13 23:28:09.234	\N	4	PRIVATE	7
543	test 321	2024-12-13 23:49:49.974	\N	4	PRIVATE	7
544	hi	2024-12-13 23:51:09.711	\N	4	PRIVATE	7
545	hi	2024-12-13 23:56:09.687	\N	4	PRIVATE	7
546	gang	2024-12-13 23:59:26.321	\N	4	PRIVATE	7
547	gang	2024-12-13 23:59:40.686	\N	4	PRIVATE	7
548	gg	2024-12-14 00:00:05.963	\N	4	PRIVATE	7
549	res	2024-12-14 00:01:18.851	\N	4	PRIVATE	7
550	test	2024-12-14 00:17:49.945	\N	4	PRIVATE	7
551	okay\\	2024-12-14 00:19:03.951	\N	4	PRIVATE	7
552	hi	2024-12-14 00:19:53.503	\N	4	PRIVATE	7
553	hi	2024-12-14 00:20:49.087	\N	4	PRIVATE	7
554	we	2024-12-14 00:21:16.094	\N	4	PRIVATE	7
555	okay	2024-12-14 00:22:55.208	\N	4	PRIVATE	7
556	think i got it	2024-12-14 00:24:06.974	\N	4	PRIVATE	7
557	we read it	2024-12-14 00:24:54.472	\N	4	PRIVATE	7
558	lkajsdflkjasdf	2024-12-14 00:30:18.205	\N	7	PRIVATE	4
559	did you read this	2024-12-14 00:30:36.4	\N	4	PRIVATE	7
560	did you read this?	2024-12-14 00:30:54.828	\N	4	PRIVATE	7
\.


--
-- Data for Name: MessageReadReceipt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MessageReadReceipt" (id, "messageId", "userId", "readAt") FROM stdin;
1	402	4	2024-12-12 20:16:03.494
2	403	4	2024-12-12 20:37:19.122
3	404	7	2024-12-12 20:37:41.225
4	405	4	2024-12-12 20:41:35.303
5	406	7	2024-12-12 20:41:45.076
6	416	4	2024-12-12 21:00:05.526
7	417	7	2024-12-12 21:00:15.747
8	418	7	2024-12-12 21:00:23.439
9	419	7	2024-12-12 21:00:30.882
10	420	7	2024-12-12 21:00:37.003
11	421	7	2024-12-12 21:00:50.426
12	422	7	2024-12-12 21:04:15.045
13	423	4	2024-12-12 21:04:20.516
14	424	4	2024-12-12 21:05:27.31
15	425	7	2024-12-12 21:10:15.897
16	426	4	2024-12-12 21:10:24.597
17	427	4	2024-12-12 21:12:15.493
18	428	4	2024-12-12 21:13:15.659
19	429	7	2024-12-12 21:14:22.058
20	430	4	2024-12-12 22:13:03.991
21	431	4	2024-12-12 22:13:19.775
22	432	4	2024-12-12 22:13:24.276
23	433	4	2024-12-12 22:14:12.029
24	434	4	2024-12-12 22:14:19.288
25	435	4	2024-12-12 22:14:48.829
26	436	7	2024-12-12 22:15:27.735
27	437	7	2024-12-12 22:16:12.268
28	438	7	2024-12-12 22:16:40.975
29	439	4	2024-12-12 22:17:31.553
30	440	4	2024-12-12 22:17:48.099
31	441	4	2024-12-12 22:18:11.515
32	442	4	2024-12-12 22:19:38.769
33	444	4	2024-12-12 22:46:23.607
34	445	7	2024-12-12 22:46:29.826
35	446	7	2024-12-12 22:46:57.756
36	447	4	2024-12-12 22:48:43.807
37	448	4	2024-12-12 23:03:40.569
38	449	7	2024-12-12 23:04:54.444
39	450	7	2024-12-12 23:05:26.404
40	451	7	2024-12-12 23:05:41.032
41	452	7	2024-12-12 23:06:57.552
42	453	7	2024-12-12 23:06:57.661
43	454	4	2024-12-12 23:24:06.007
44	455	7	2024-12-12 23:24:14.626
45	456	7	2024-12-12 23:25:03.868
46	457	7	2024-12-12 23:25:18.022
47	458	7	2024-12-12 23:26:07.792
48	459	7	2024-12-12 23:27:00.436
49	460	4	2024-12-12 23:30:47.217
50	461	4	2024-12-12 23:31:46.314
51	462	4	2024-12-12 23:31:52.663
52	463	7	2024-12-12 23:32:15.641
53	464	7	2024-12-12 23:32:44.938
54	465	7	2024-12-12 23:33:31.394
55	466	7	2024-12-12 23:34:43.599
56	467	4	2024-12-12 23:34:58.82
57	468	7	2024-12-12 23:35:06.828
58	469	7	2024-12-12 23:36:17.203
59	470	7	2024-12-12 23:36:45.709
60	471	7	2024-12-12 23:38:35.672
61	472	7	2024-12-12 23:42:33.312
62	473	7	2024-12-12 23:42:33.475
63	474	7	2024-12-12 23:43:49.823
64	475	7	2024-12-12 23:45:18.838
65	476	7	2024-12-12 23:45:49.441
66	477	7	2024-12-12 23:45:56.736
67	478	7	2024-12-12 23:46:16.515
68	479	7	2024-12-12 23:46:33.432
69	480	7	2024-12-12 23:47:23.332
70	481	7	2024-12-12 23:49:13.607
71	482	7	2024-12-12 23:50:02.959
72	483	7	2024-12-12 23:51:48.053
73	484	7	2024-12-12 23:53:09.835
74	485	7	2024-12-12 23:54:30.747
75	486	7	2024-12-12 23:55:01.206
76	487	7	2024-12-12 23:55:10.858
77	488	7	2024-12-12 23:55:12.565
78	489	7	2024-12-12 23:55:13.691
79	490	7	2024-12-12 23:56:44.025
80	491	7	2024-12-12 23:58:34.607
81	492	7	2024-12-12 23:58:51.245
82	493	7	2024-12-13 00:00:50.294
83	494	7	2024-12-13 00:00:50.483
84	495	7	2024-12-13 00:01:55.358
85	506	4	2024-12-13 21:04:51.006
86	507	4	2024-12-13 21:05:05.057
87	523	4	2024-12-13 22:49:12.836
88	524	4	2024-12-13 22:49:14.164
89	525	4	2024-12-13 22:49:21.704
90	530	4	2024-12-13 22:52:38.023
91	532	4	2024-12-13 22:53:52.778
92	533	4	2024-12-13 22:55:33.864
93	534	4	2024-12-13 22:55:45.927
94	535	4	2024-12-13 22:56:48.027
95	536	4	2024-12-13 22:56:50.258
96	537	4	2024-12-13 22:56:56.56
97	538	7	2024-12-13 23:19:43.228
98	539	7	2024-12-13 23:22:30.862
99	540	7	2024-12-13 23:22:47.211
100	541	7	2024-12-13 23:24:28.312
101	542	7	2024-12-13 23:28:09.552
102	543	7	2024-12-13 23:49:53.033
103	544	7	2024-12-13 23:51:12.894
104	545	4	2024-12-13 23:56:10.359
105	545	7	2024-12-13 23:56:20.925
106	546	7	2024-12-13 23:59:26.609
107	547	7	2024-12-13 23:59:40.943
108	548	7	2024-12-14 00:00:06.258
109	549	7	2024-12-14 00:01:27.59
110	550	7	2024-12-14 00:17:50.211
111	551	7	2024-12-14 00:19:04.227
112	552	7	2024-12-14 00:19:53.818
113	553	7	2024-12-14 00:21:16.338
114	554	7	2024-12-14 00:21:16.581
115	555	7	2024-12-14 00:22:58.966
116	556	7	2024-12-14 00:24:14.739
117	557	7	2024-12-14 00:24:58.536
118	559	7	2024-12-14 00:30:36.748
119	560	7	2024-12-14 00:31:00.912
\.


--
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permission" (id, "serverId", "userId", "roleId") FROM stdin;
\.


--
-- Data for Name: Reaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Reaction" (id, emoji, "messageId", "userId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Role" (id, "serverId", name) FROM stdin;
1	1	Admin
2	1	Member
\.


--
-- Data for Name: Server; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Server" (id, name, "iconUrl", "createdAt") FROM stdin;
1	Tech Enthusiasts	https://example.com/icon1.png	2024-10-28 20:35:55.475
2	Gaming Hub	https://example.com/icon2.png	2024-10-28 20:35:55.482
16	testing voice	\N	2024-11-19 21:09:23.755
\.


--
-- Data for Name: ServerInvite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ServerInvite" (id, "inviteCode", "serverId", "createdById", "usedById", "expiresAt", "createdAt", "usedAt", "maxUses", uses, "isRevoked") FROM stdin;
23	qgiezbzl	16	4	\N	2024-11-27 21:34:23.386	2024-11-20 21:34:23.387	\N	1	0	f
24	uwj1werq	16	4	\N	2024-11-29 20:23:54.209	2024-11-22 20:23:54.211	\N	1	0	f
25	qf3rgen0	16	7	\N	2024-11-29 20:25:02.624	2024-11-22 20:25:02.625	\N	1	0	f
\.


--
-- Data for Name: ServerMember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ServerMember" (id, "userId", "serverId", "joinedAt", "roleId", "user.onlineStatus", "user.username", "user.avatarUrl") FROM stdin;
1	1	1	2024-10-28 20:35:55.475	\N	\N	\N	\N
2	2	1	2024-10-28 20:35:55.475	\N	\N	\N	\N
3	3	1	2024-10-28 20:35:55.475	\N	\N	\N	\N
4	1	2	2024-10-28 20:35:55.482	\N	\N	\N	\N
5	2	2	2024-10-28 20:35:55.482	\N	\N	\N	\N
28	4	16	2024-11-19 21:09:23.755	\N	\N	\N	\N
29	7	16	2024-11-20 21:35:02.071	\N	\N	\N	\N
30	6	16	2024-11-22 20:24:02.052	\N	\N	\N	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, "avatarUrl", "createdAt", password, username, "onlineStatus") FROM stdin;
1	user1@example.com	\N	2024-10-28 20:35:55.431	password1	user_one	f
2	user2@example.com	\N	2024-10-28 20:35:55.472	password2	user_two	f
3	user3@example.com	\N	2024-10-28 20:35:55.474	password3	user_three	f
4	test@test.com	/defaultPfp/Solid-Violet.png	2024-10-29 13:52:38	$2a$10$nAuaJ50j9x9fDTb1CysTsuHQIXW4i7LIqcWkrcrw3QyXClUvAjp6a	test	t
7	test3@test3.com	/defaultPfp/Solid-Indigo.png	2024-11-01 15:18:20	$2a$10$DZeul8jOK4cjakHsNC1.X.hVJ0iGaK9sktO8QWrHzjafE.aRf8Xty	test3	f
6	test2@test2.com	/defaultPfp/Solid-Blue.png	2024-11-01 15:18:01	$2a$10$y36Mr1CQPGY71pPEuUpm9OtbdILgIkHRxL6SPZhaGMnmhFURrgNMm	test2	f
13	test4@test4.com	/defaultPfp/Solid-Yellow.png	2024-11-16 13:27:07	$2a$10$YROtwZpOj6K2VF6vLj.1O.cfTJYjpSaHnRUs/3mwR4s.Atdoh9VSC	test4	f
5	test1@test1.com	/defaultPfp/Solid-Green.png	2024-11-01 15:17:44	$2a$10$eyjdthAXmwEKhWoPIKpu2un0etB9WPdON17wg//sNbkc9tuLWVHEy	test1	f
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
5417deb9-b1d9-4b69-b640-81d4249d254d	af5bcbb7921880a25f12857577c0646d5be34873dd2d76120cc0ff1f5c75717b	2024-10-28 16:27:07.031738+00	20241028162706_init	\N	\N	2024-10-28 16:27:07.009056+00	1
900c44a7-20a4-48e8-8228-c3fbc6dd437c	e8e54d687c7742b164a131e15835614b50fdd0961e2b34ad810a978afbea31e4	2024-10-28 20:33:17.338641+00	20241028203317_init	\N	\N	2024-10-28 20:33:17.269556+00	1
437c1e2e-80d1-4a8d-bdb9-c77e98d92800	629131b06e0bc3b957dfae696a864527e27da40a13c144b8040eea0c4e5344ab	2024-10-31 18:54:20.81866+00	20241031185300_add_recipient_id_and_message_type	\N	\N	2024-10-31 18:54:20.772451+00	1
9ef6296f-3c04-45aa-b6ca-d4afa0502753	556735fb12ddf3f204736f8940f2ab527a866a19ff00ca588fa27dfb1c905ee3	2024-10-31 18:54:31.902952+00	20241031185431_add_default_message_type	\N	\N	2024-10-31 18:54:31.899688+00	1
d59ac2cd-85d5-4f02-b8e9-14ed846a30f2	905b9a5769a71443ae5ce21bffdada358bae49899a3f260dcb1534802032141f	2024-11-01 20:13:42.745353+00	20241101201342_add_friend_request_model	\N	\N	2024-11-01 20:13:42.716664+00	1
5036067b-d603-42a3-825b-ac162446ff01	62d1a817be9366562de6c3baf19b89d207d5a221d47057b06312908ada0153ab	2024-11-08 21:16:37.646967+00	20241108211637_add_server_invites	\N	\N	2024-11-08 21:16:37.600301+00	1
55d1a140-88ea-4422-b5f1-6b893854cd02	b4f2e4c6b7750333479ec3770c9d11cc7eb4a48c4c2f1d8d91d32ceb3ed53f5c	2024-11-16 21:40:51.564317+00	20241116214051_add_message_avatar_url	\N	\N	2024-11-16 21:40:51.55682+00	1
f3b1b254-b7dc-49dc-8b25-9cb73628ce0e	6c5321e42b63cb3285288b492d82a4fba12904ae27fe0c026cb6c2a145fb2ae6	2024-11-16 21:46:22.597542+00	20241116214622_undo_add_message_avatar_url	\N	\N	2024-11-16 21:46:22.591581+00	1
9d00f067-a6eb-47db-abb3-eee8e6925aee	f30f0a5e5ff0a3d7cea62cce531260b5774eb249ae8dd8408c463ea31b52e4c5	2024-12-09 19:07:34.811889+00	20241209190734_add_online_status	\N	\N	2024-12-09 19:07:34.796149+00	1
fa562664-3569-49cb-bc34-67d1d0f9dc33	a8b880dc098d7b26e9d2e1090927e7f672f2f5b706f54c5ca3cca8dd3fc28adb	2024-12-09 19:55:19.081736+00	20241209195519_add_username_online_status_to_servermember	\N	\N	2024-12-09 19:55:19.072558+00	1
3b516927-7224-492b-8ee4-e61dd6551482	ddc3eb4a601e827662c5fd17937273ae7e62ef6595760d6f9aacffb13a751a42	2024-12-09 20:01:12.329679+00	20241209200112_add_avatar_url_to_servermember	\N	\N	2024-12-09 20:01:12.325137+00	1
e9590617-ec96-45a0-a338-b59259b0f4d3	35cbea064967128e21ea52e37b69bb1da06c5407727da541d461975dff54279f	2024-12-12 19:47:06.070141+00	20241212194706_add_read_receipt	\N	\N	2024-12-12 19:47:06.032568+00	1
\.


--
-- Name: Channel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Channel_id_seq"', 25, true);


--
-- Name: FriendRequest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."FriendRequest_id_seq"', 5, true);


--
-- Name: Friend_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Friend_id_seq"', 12, true);


--
-- Name: MessageReadReceipt_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MessageReadReceipt_id_seq"', 119, true);


--
-- Name: Message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Message_id_seq"', 562, true);


--
-- Name: Permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Permission_id_seq"', 1, false);


--
-- Name: Reaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Reaction_id_seq"', 1, false);


--
-- Name: Role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Role_id_seq"', 2, true);


--
-- Name: ServerInvite_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ServerInvite_id_seq"', 27, true);


--
-- Name: ServerMember_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ServerMember_id_seq"', 30, true);


--
-- Name: Server_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Server_id_seq"', 16, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 13, true);


--
-- Name: Channel Channel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Channel"
    ADD CONSTRAINT "Channel_pkey" PRIMARY KEY (id);


--
-- Name: FriendRequest FriendRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_pkey" PRIMARY KEY (id);


--
-- Name: Friend Friend_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friend"
    ADD CONSTRAINT "Friend_pkey" PRIMARY KEY (id);


--
-- Name: MessageReadReceipt MessageReadReceipt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MessageReadReceipt"
    ADD CONSTRAINT "MessageReadReceipt_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: Reaction Reaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reaction"
    ADD CONSTRAINT "Reaction_pkey" PRIMARY KEY (id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: ServerInvite ServerInvite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServerInvite"
    ADD CONSTRAINT "ServerInvite_pkey" PRIMARY KEY (id);


--
-- Name: ServerMember ServerMember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServerMember"
    ADD CONSTRAINT "ServerMember_pkey" PRIMARY KEY (id);


--
-- Name: Server Server_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Server"
    ADD CONSTRAINT "Server_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Friend_userId_friendId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Friend_userId_friendId_key" ON public."Friend" USING btree ("userId", "friendId");


--
-- Name: MessageReadReceipt_messageId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "MessageReadReceipt_messageId_userId_key" ON public."MessageReadReceipt" USING btree ("messageId", "userId");


--
-- Name: Reaction_userId_messageId_emoji_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Reaction_userId_messageId_emoji_key" ON public."Reaction" USING btree ("userId", "messageId", emoji);


--
-- Name: ServerInvite_inviteCode_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ServerInvite_inviteCode_idx" ON public."ServerInvite" USING btree ("inviteCode");


--
-- Name: ServerInvite_inviteCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ServerInvite_inviteCode_key" ON public."ServerInvite" USING btree ("inviteCode");


--
-- Name: ServerInvite_serverId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ServerInvite_serverId_idx" ON public."ServerInvite" USING btree ("serverId");


--
-- Name: ServerMember_userId_serverId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ServerMember_userId_serverId_key" ON public."ServerMember" USING btree ("userId", "serverId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Channel Channel_serverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Channel"
    ADD CONSTRAINT "Channel_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES public."Server"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FriendRequest FriendRequest_recipientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FriendRequest FriendRequest_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Friend Friend_friendId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friend"
    ADD CONSTRAINT "Friend_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Friend Friend_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friend"
    ADD CONSTRAINT "Friend_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MessageReadReceipt MessageReadReceipt_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MessageReadReceipt"
    ADD CONSTRAINT "MessageReadReceipt_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public."Message"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MessageReadReceipt MessageReadReceipt_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MessageReadReceipt"
    ADD CONSTRAINT "MessageReadReceipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_channelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES public."Channel"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Message Message_recipientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Message Message_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Permission Permission_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Permission Permission_serverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES public."Server"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Permission Permission_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reaction Reaction_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reaction"
    ADD CONSTRAINT "Reaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public."Message"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reaction Reaction_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reaction"
    ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Role Role_serverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES public."Server"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ServerInvite ServerInvite_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServerInvite"
    ADD CONSTRAINT "ServerInvite_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ServerInvite ServerInvite_serverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServerInvite"
    ADD CONSTRAINT "ServerInvite_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES public."Server"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ServerInvite ServerInvite_usedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServerInvite"
    ADD CONSTRAINT "ServerInvite_usedById_fkey" FOREIGN KEY ("usedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ServerMember ServerMember_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServerMember"
    ADD CONSTRAINT "ServerMember_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ServerMember ServerMember_serverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServerMember"
    ADD CONSTRAINT "ServerMember_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES public."Server"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ServerMember ServerMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServerMember"
    ADD CONSTRAINT "ServerMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

