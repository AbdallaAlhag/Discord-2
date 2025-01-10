--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
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
-- Name: public; Type: SCHEMA; Schema: -; Owner: alhag
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO alhag;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: alhag
--

COMMENT ON SCHEMA public IS '';


--
-- Name: MessageType; Type: TYPE; Schema: public; Owner: alhag
--

CREATE TYPE public."MessageType" AS ENUM (
    'CHANNEL',
    'PRIVATE'
);


ALTER TYPE public."MessageType" OWNER TO alhag;

--
-- Name: ServerRole; Type: TYPE; Schema: public; Owner: alhag
--

CREATE TYPE public."ServerRole" AS ENUM (
    'OWNER',
    'ADMIN',
    'MEMBER'
);


ALTER TYPE public."ServerRole" OWNER TO alhag;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Channel; Type: TABLE; Schema: public; Owner: alhag
--

CREATE TABLE public."Channel" (
    id text NOT NULL,
    "serverId" text NOT NULL,
    name text NOT NULL,
    "isVoice" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Channel" OWNER TO alhag;

--
-- Name: Friend; Type: TABLE; Schema: public; Owner: alhag
--

CREATE TABLE public."Friend" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "friendId" text NOT NULL
);


ALTER TABLE public."Friend" OWNER TO alhag;

--
-- Name: FriendRequest; Type: TABLE; Schema: public; Owner: alhag
--

CREATE TABLE public."FriendRequest" (
    id text NOT NULL,
    "senderId" text NOT NULL,
    "recipientId" text NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."FriendRequest" OWNER TO alhag;

--
-- Name: Message; Type: TABLE; Schema: public; Owner: alhag
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "channelId" text,
    "userId" text NOT NULL,
    "messageType" public."MessageType" NOT NULL,
    "recipientId" text
);


ALTER TABLE public."Message" OWNER TO alhag;

--
-- Name: MessageReadReceipt; Type: TABLE; Schema: public; Owner: alhag
--

CREATE TABLE public."MessageReadReceipt" (
    id text NOT NULL,
    "messageId" text NOT NULL,
    "userId" text NOT NULL,
    "readAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."MessageReadReceipt" OWNER TO alhag;

--
-- Name: Reaction; Type: TABLE; Schema: public; Owner: alhag
--

CREATE TABLE public."Reaction" (
    id text NOT NULL,
    emoji text NOT NULL,
    "messageId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Reaction" OWNER TO alhag;

--
-- Name: Server; Type: TABLE; Schema: public; Owner: alhag
--

CREATE TABLE public."Server" (
    id text NOT NULL,
    name text NOT NULL,
    "iconUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Server" OWNER TO alhag;

--
-- Name: ServerInvite; Type: TABLE; Schema: public; Owner: alhag
--

CREATE TABLE public."ServerInvite" (
    id text NOT NULL,
    "inviteCode" text NOT NULL,
    "serverId" text NOT NULL,
    "createdById" text NOT NULL,
    "usedById" text,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "usedAt" timestamp(3) without time zone,
    "maxUses" integer DEFAULT 1 NOT NULL,
    uses integer DEFAULT 0 NOT NULL,
    "isRevoked" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."ServerInvite" OWNER TO alhag;

--
-- Name: ServerMember; Type: TABLE; Schema: public; Owner: alhag
--

CREATE TABLE public."ServerMember" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "serverId" text NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "user.onlineStatus" boolean,
    "user.username" text,
    "user.avatarUrl" text,
    role public."ServerRole" DEFAULT 'MEMBER'::public."ServerRole" NOT NULL
);


ALTER TABLE public."ServerMember" OWNER TO alhag;

--
-- Name: User; Type: TABLE; Schema: public; Owner: alhag
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "avatarUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    password text NOT NULL,
    username text NOT NULL,
    "onlineStatus" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."User" OWNER TO alhag;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: alhag
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


ALTER TABLE public._prisma_migrations OWNER TO alhag;

--
-- Data for Name: Channel; Type: TABLE DATA; Schema: public; Owner: alhag
--

COPY public."Channel" (id, "serverId", name, "isVoice", "createdAt") FROM stdin;
3	2	general	f	2025-01-03 22:58:37.55
4	2	General	t	2025-01-03 22:58:37.55
\.


--
-- Data for Name: Friend; Type: TABLE DATA; Schema: public; Owner: alhag
--

COPY public."Friend" (id, "userId", "friendId") FROM stdin;
\.


--
-- Data for Name: FriendRequest; Type: TABLE DATA; Schema: public; Owner: alhag
--

COPY public."FriendRequest" (id, "senderId", "recipientId", status, "createdAt") FROM stdin;
1	1	4	DECLINED	2025-01-03 23:17:21.308
2	1	4	DECLINED	2025-01-03 23:17:37.719
c7260134-9b70-4a36-9c48-5817546b318a	1	4	DECLINED	2025-01-08 22:06:33.865
01423ee8-bc70-495a-8c93-e58277d7ef71	1	4	DECLINED	2025-01-08 22:11:12.819
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: alhag
--

COPY public."Message" (id, content, "createdAt", "channelId", "userId", "messageType", "recipientId") FROM stdin;
\.


--
-- Data for Name: MessageReadReceipt; Type: TABLE DATA; Schema: public; Owner: alhag
--

COPY public."MessageReadReceipt" (id, "messageId", "userId", "readAt") FROM stdin;
\.


--
-- Data for Name: Reaction; Type: TABLE DATA; Schema: public; Owner: alhag
--

COPY public."Reaction" (id, emoji, "messageId", "userId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Server; Type: TABLE DATA; Schema: public; Owner: alhag
--

COPY public."Server" (id, name, "iconUrl", "createdAt") FROM stdin;
2	Global	https://discord-2-aws-s3.s3.us-east-2.amazonaws.com/global-1735945117043.png	2025-01-03 22:58:37.55
\.


--
-- Data for Name: ServerInvite; Type: TABLE DATA; Schema: public; Owner: alhag
--

COPY public."ServerInvite" (id, "inviteCode", "serverId", "createdById", "usedById", "expiresAt", "createdAt", "usedAt", "maxUses", uses, "isRevoked") FROM stdin;
\.


--
-- Data for Name: ServerMember; Type: TABLE DATA; Schema: public; Owner: alhag
--

COPY public."ServerMember" (id, "userId", "serverId", "joinedAt", "user.onlineStatus", "user.username", "user.avatarUrl", role) FROM stdin;
3	1	2	2025-01-03 22:58:37.55	\N	\N	\N	OWNER
5	4	2	2025-01-03 23:15:35.933	\N	\N	\N	MEMBER
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: alhag
--

COPY public."User" (id, email, "avatarUrl", "createdAt", password, username, "onlineStatus") FROM stdin;
1	test@test.com	/defaultPfp/Solid-Orange.png	2025-01-03 22:53:25.837	$2a$10$5bR9oFYFxvCwsL50gEhkSO0CaWQWiA9ur5DQ0QuTfM333MtaP/dQq	test	t
4	test2@test2.com	/defaultPfp/Solid-Orange.png	2025-01-03 23:15:35.885	$2a$10$dOqkLFHAJKgtBmzFhbxYc.dKR2d08lmlJ7jyRGE.h70yDEoXp.uU2	test2	f
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: alhag
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
67e2d18d-4ab2-4200-983c-17a8e10162a6	af5bcbb7921880a25f12857577c0646d5be34873dd2d76120cc0ff1f5c75717b	2025-01-03 14:51:23.23539-08	20241028162706_init	\N	\N	2025-01-03 14:51:23.223009-08	1
2edc83a5-d18a-4bc6-ad18-94caf24dccef	e8e54d687c7742b164a131e15835614b50fdd0961e2b34ad810a978afbea31e4	2025-01-03 14:51:23.299893-08	20241028203317_init	\N	\N	2025-01-03 14:51:23.236294-08	1
8fd98425-ce29-406b-a6d6-4321361e1eaa	087879d14aa3421ad54af3261a0c4f1df258670574e39fc06ebc8b290730c953	2025-01-03 15:48:07.903504-08	20250103234807_add_uuid_column	\N	\N	2025-01-03 15:48:07.739291-08	1
aae32ec2-0719-41bb-ac7d-bca0fd15a9a8	629131b06e0bc3b957dfae696a864527e27da40a13c144b8040eea0c4e5344ab	2025-01-03 14:51:23.317333-08	20241031185300_add_recipient_id_and_message_type	\N	\N	2025-01-03 14:51:23.300894-08	1
5a63abd6-b07e-49c9-9bab-0004b3d6f409	556735fb12ddf3f204736f8940f2ab527a866a19ff00ca588fa27dfb1c905ee3	2025-01-03 14:51:23.321688-08	20241031185431_add_default_message_type	\N	\N	2025-01-03 14:51:23.318444-08	1
50d2a858-36e1-4a8a-af67-9ee63f350d19	905b9a5769a71443ae5ce21bffdada358bae49899a3f260dcb1534802032141f	2025-01-03 14:51:23.333546-08	20241101201342_add_friend_request_model	\N	\N	2025-01-03 14:51:23.322706-08	1
6e221693-8bb9-4cdc-bb26-65b7ad9ea093	62d1a817be9366562de6c3baf19b89d207d5a221d47057b06312908ada0153ab	2025-01-03 14:51:23.352835-08	20241108211637_add_server_invites	\N	\N	2025-01-03 14:51:23.334493-08	1
5c8ce6c7-d22d-4cd7-be02-ee1dc8149614	b4f2e4c6b7750333479ec3770c9d11cc7eb4a48c4c2f1d8d91d32ceb3ed53f5c	2025-01-03 14:51:23.356844-08	20241116214051_add_message_avatar_url	\N	\N	2025-01-03 14:51:23.353903-08	1
e3e5e00c-f990-4ce7-a6a6-bc84b70d8b0e	6c5321e42b63cb3285288b492d82a4fba12904ae27fe0c026cb6c2a145fb2ae6	2025-01-03 14:51:23.361335-08	20241116214622_undo_add_message_avatar_url	\N	\N	2025-01-03 14:51:23.357791-08	1
e47c6874-3ccb-405a-b210-1ab17957cbeb	f30f0a5e5ff0a3d7cea62cce531260b5774eb249ae8dd8408c463ea31b52e4c5	2025-01-03 14:51:23.364701-08	20241209190734_add_online_status	\N	\N	2025-01-03 14:51:23.362161-08	1
52203563-cc4a-4e1f-a845-bf9302424981	a8b880dc098d7b26e9d2e1090927e7f672f2f5b706f54c5ca3cca8dd3fc28adb	2025-01-03 14:51:23.370708-08	20241209195519_add_username_online_status_to_servermember	\N	\N	2025-01-03 14:51:23.365385-08	1
270db351-713c-4c3a-98fb-15f4e3729833	ddc3eb4a601e827662c5fd17937273ae7e62ef6595760d6f9aacffb13a751a42	2025-01-03 14:51:23.375547-08	20241209200112_add_avatar_url_to_servermember	\N	\N	2025-01-03 14:51:23.372315-08	1
beb61a32-9a33-4e4d-bdc1-16d804072d37	35cbea064967128e21ea52e37b69bb1da06c5407727da541d461975dff54279f	2025-01-03 14:51:23.387328-08	20241212194706_add_read_receipt	\N	\N	2025-01-03 14:51:23.376465-08	1
57bbffe8-b59d-4740-8dc4-0433ccb366c9	55f6b53dc013918e4e8ea420451868127f71fe311af8f4d82216b5039842bea0	2025-01-03 14:51:23.397605-08	20241220205434_remove_role_and_permission_update_roles_in_server_member	\N	\N	2025-01-03 14:51:23.388218-08	1
\.


--
-- Name: Channel Channel_pkey; Type: CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."Channel"
    ADD CONSTRAINT "Channel_pkey" PRIMARY KEY (id);


--
-- Name: FriendRequest FriendRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_pkey" PRIMARY KEY (id);


--
-- Name: Friend Friend_pkey; Type: CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."Friend"
    ADD CONSTRAINT "Friend_pkey" PRIMARY KEY (id);


--
-- Name: MessageReadReceipt MessageReadReceipt_pkey; Type: CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."MessageReadReceipt"
    ADD CONSTRAINT "MessageReadReceipt_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: Reaction Reaction_pkey; Type: CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."Reaction"
    ADD CONSTRAINT "Reaction_pkey" PRIMARY KEY (id);


--
-- Name: ServerInvite ServerInvite_pkey; Type: CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."ServerInvite"
    ADD CONSTRAINT "ServerInvite_pkey" PRIMARY KEY (id);


--
-- Name: ServerMember ServerMember_pkey; Type: CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."ServerMember"
    ADD CONSTRAINT "ServerMember_pkey" PRIMARY KEY (id);


--
-- Name: Server Server_pkey; Type: CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."Server"
    ADD CONSTRAINT "Server_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Friend_userId_friendId_key; Type: INDEX; Schema: public; Owner: alhag
--

CREATE UNIQUE INDEX "Friend_userId_friendId_key" ON public."Friend" USING btree ("userId", "friendId");


--
-- Name: MessageReadReceipt_messageId_userId_key; Type: INDEX; Schema: public; Owner: alhag
--

CREATE UNIQUE INDEX "MessageReadReceipt_messageId_userId_key" ON public."MessageReadReceipt" USING btree ("messageId", "userId");


--
-- Name: Reaction_userId_messageId_emoji_key; Type: INDEX; Schema: public; Owner: alhag
--

CREATE UNIQUE INDEX "Reaction_userId_messageId_emoji_key" ON public."Reaction" USING btree ("userId", "messageId", emoji);


--
-- Name: ServerInvite_inviteCode_idx; Type: INDEX; Schema: public; Owner: alhag
--

CREATE INDEX "ServerInvite_inviteCode_idx" ON public."ServerInvite" USING btree ("inviteCode");


--
-- Name: ServerInvite_inviteCode_key; Type: INDEX; Schema: public; Owner: alhag
--

CREATE UNIQUE INDEX "ServerInvite_inviteCode_key" ON public."ServerInvite" USING btree ("inviteCode");


--
-- Name: ServerInvite_serverId_idx; Type: INDEX; Schema: public; Owner: alhag
--

CREATE INDEX "ServerInvite_serverId_idx" ON public."ServerInvite" USING btree ("serverId");


--
-- Name: ServerMember_userId_serverId_key; Type: INDEX; Schema: public; Owner: alhag
--

CREATE UNIQUE INDEX "ServerMember_userId_serverId_key" ON public."ServerMember" USING btree ("userId", "serverId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: alhag
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: alhag
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Channel Channel_serverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."Channel"
    ADD CONSTRAINT "Channel_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES public."Server"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FriendRequest FriendRequest_recipientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FriendRequest FriendRequest_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Friend Friend_friendId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."Friend"
    ADD CONSTRAINT "Friend_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Friend Friend_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."Friend"
    ADD CONSTRAINT "Friend_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MessageReadReceipt MessageReadReceipt_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."MessageReadReceipt"
    ADD CONSTRAINT "MessageReadReceipt_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public."Message"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MessageReadReceipt MessageReadReceipt_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."MessageReadReceipt"
    ADD CONSTRAINT "MessageReadReceipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_channelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES public."Channel"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Message Message_recipientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Message Message_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reaction Reaction_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."Reaction"
    ADD CONSTRAINT "Reaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public."Message"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reaction Reaction_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."Reaction"
    ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ServerInvite ServerInvite_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."ServerInvite"
    ADD CONSTRAINT "ServerInvite_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ServerInvite ServerInvite_serverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."ServerInvite"
    ADD CONSTRAINT "ServerInvite_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES public."Server"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ServerInvite ServerInvite_usedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."ServerInvite"
    ADD CONSTRAINT "ServerInvite_usedById_fkey" FOREIGN KEY ("usedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ServerMember ServerMember_serverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."ServerMember"
    ADD CONSTRAINT "ServerMember_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES public."Server"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ServerMember ServerMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alhag
--

ALTER TABLE ONLY public."ServerMember"
    ADD CONSTRAINT "ServerMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: alhag
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

