--
-- WORKAROUND: Sqitch issue https://github.com/sqitchers/sqitch/issues/358
-- seems to resurface for some people on Windows + WSL + Docker setup.
-- As a workaround we create the sqitch schema manually before running sqitch.
--

CREATE SCHEMA sqitch;

COMMENT ON SCHEMA sqitch IS 'Sqitch database deployment metadata v1.1.';

CREATE TABLE sqitch.changes (
    change_id text NOT NULL,
    script_hash text,
    change text NOT NULL,
    project text NOT NULL,
    note text DEFAULT ''::text NOT NULL,
    committed_at timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
    committer_name text NOT NULL,
    committer_email text NOT NULL,
    planned_at timestamp with time zone NOT NULL,
    planner_name text NOT NULL,
    planner_email text NOT NULL
);

COMMENT ON TABLE sqitch.changes IS 'Tracks the changes currently deployed to the database.';
COMMENT ON COLUMN sqitch.changes.change_id IS 'Change primary key.';
COMMENT ON COLUMN sqitch.changes.script_hash IS 'Deploy script SHA-1 hash.';
COMMENT ON COLUMN sqitch.changes.change IS 'Name of a deployed change.';
COMMENT ON COLUMN sqitch.changes.project IS 'Name of the Sqitch project to which the change belongs.';
COMMENT ON COLUMN sqitch.changes.note IS 'Description of the change.';
COMMENT ON COLUMN sqitch.changes.committed_at IS 'Date the change was deployed.';
COMMENT ON COLUMN sqitch.changes.committer_name IS 'Name of the user who deployed the change.';
COMMENT ON COLUMN sqitch.changes.committer_email IS 'Email address of the user who deployed the change.';
COMMENT ON COLUMN sqitch.changes.planned_at IS 'Date the change was added to the plan.';
COMMENT ON COLUMN sqitch.changes.planner_name IS 'Name of the user who planed the change.';
COMMENT ON COLUMN sqitch.changes.planner_email IS 'Email address of the user who planned the change.';

CREATE TABLE sqitch.dependencies (
    change_id text NOT NULL,
    type text NOT NULL,
    dependency text NOT NULL,
    dependency_id text,
    CONSTRAINT dependencies_check CHECK ((((type = 'require'::text) AND (dependency_id IS NOT NULL)) OR ((type = 'conflict'::text) AND (dependency_id IS NULL))))
);

COMMENT ON TABLE sqitch.dependencies IS 'Tracks the currently satisfied dependencies.';
COMMENT ON COLUMN sqitch.dependencies.change_id IS 'ID of the depending change.';
COMMENT ON COLUMN sqitch.dependencies.type IS 'Type of dependency.';
COMMENT ON COLUMN sqitch.dependencies.dependency IS 'Dependency name.';
COMMENT ON COLUMN sqitch.dependencies.dependency_id IS 'Change ID the dependency resolves to.';

CREATE TABLE sqitch.events (
    event text NOT NULL,
    change_id text NOT NULL,
    change text NOT NULL,
    project text NOT NULL,
    note text DEFAULT ''::text NOT NULL,
    requires text[] DEFAULT '{}'::text[] NOT NULL,
    conflicts text[] DEFAULT '{}'::text[] NOT NULL,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    committed_at timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
    committer_name text NOT NULL,
    committer_email text NOT NULL,
    planned_at timestamp with time zone NOT NULL,
    planner_name text NOT NULL,
    planner_email text NOT NULL,
    CONSTRAINT events_event_check CHECK ((event = ANY (ARRAY['deploy'::text, 'revert'::text, 'fail'::text, 'merge'::text])))
);

COMMENT ON TABLE sqitch.events IS 'Contains full history of all deployment events.';
COMMENT ON COLUMN sqitch.events.event IS 'Type of event.';
COMMENT ON COLUMN sqitch.events.change_id IS 'Change ID.';
COMMENT ON COLUMN sqitch.events.change IS 'Change name.';
COMMENT ON COLUMN sqitch.events.project IS 'Name of the Sqitch project to which the change belongs.';
COMMENT ON COLUMN sqitch.events.note IS 'Description of the change.';
COMMENT ON COLUMN sqitch.events.requires IS 'Array of the names of required changes.';
COMMENT ON COLUMN sqitch.events.conflicts IS 'Array of the names of conflicting changes.';
COMMENT ON COLUMN sqitch.events.tags IS 'Tags associated with the change.';
COMMENT ON COLUMN sqitch.events.committed_at IS 'Date the event was committed.';
COMMENT ON COLUMN sqitch.events.committer_name IS 'Name of the user who committed the event.';
COMMENT ON COLUMN sqitch.events.committer_email IS 'Email address of the user who committed the event.';
COMMENT ON COLUMN sqitch.events.planned_at IS 'Date the event was added to the plan.';
COMMENT ON COLUMN sqitch.events.planner_name IS 'Name of the user who planed the change.';
COMMENT ON COLUMN sqitch.events.planner_email IS 'Email address of the user who plan planned the change.';

CREATE TABLE sqitch.projects (
    project text NOT NULL,
    uri text,
    created_at timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
    creator_name text NOT NULL,
    creator_email text NOT NULL
);

COMMENT ON TABLE sqitch.projects IS 'Sqitch projects deployed to this database.';
COMMENT ON COLUMN sqitch.projects.project IS 'Unique Name of a project.';
COMMENT ON COLUMN sqitch.projects.uri IS 'Optional project URI';
COMMENT ON COLUMN sqitch.projects.created_at IS 'Date the project was added to the database.';
COMMENT ON COLUMN sqitch.projects.creator_name IS 'Name of the user who added the project.';
COMMENT ON COLUMN sqitch.projects.creator_email IS 'Email address of the user who added the project.';

CREATE TABLE sqitch.releases (
    version real NOT NULL,
    installed_at timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
    installer_name text NOT NULL,
    installer_email text NOT NULL
);

COMMENT ON TABLE sqitch.releases IS 'Sqitch registry releases.';
COMMENT ON COLUMN sqitch.releases.version IS 'Version of the Sqitch registry.';
COMMENT ON COLUMN sqitch.releases.installed_at IS 'Date the registry release was installed.';
COMMENT ON COLUMN sqitch.releases.installer_name IS 'Name of the user who installed the registry release.';
COMMENT ON COLUMN sqitch.releases.installer_email IS 'Email address of the user who installed the registry release.';

CREATE TABLE sqitch.tags (
    tag_id text NOT NULL,
    tag text NOT NULL,
    project text NOT NULL,
    change_id text NOT NULL,
    note text DEFAULT ''::text NOT NULL,
    committed_at timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
    committer_name text NOT NULL,
    committer_email text NOT NULL,
    planned_at timestamp with time zone NOT NULL,
    planner_name text NOT NULL,
    planner_email text NOT NULL
);

COMMENT ON TABLE sqitch.tags IS 'Tracks the tags currently applied to the database.';
COMMENT ON COLUMN sqitch.tags.tag_id IS 'Tag primary key.';
COMMENT ON COLUMN sqitch.tags.tag IS 'Project-unique tag name.';
COMMENT ON COLUMN sqitch.tags.project IS 'Name of the Sqitch project to which the tag belongs.';
COMMENT ON COLUMN sqitch.tags.change_id IS 'ID of last change deployed before the tag was applied.';
COMMENT ON COLUMN sqitch.tags.note IS 'Description of the tag.';
COMMENT ON COLUMN sqitch.tags.committed_at IS 'Date the tag was applied to the database.';
COMMENT ON COLUMN sqitch.tags.committer_name IS 'Name of the user who applied the tag.';
COMMENT ON COLUMN sqitch.tags.committer_email IS 'Email address of the user who applied the tag.';
COMMENT ON COLUMN sqitch.tags.planned_at IS 'Date the tag was added to the plan.';
COMMENT ON COLUMN sqitch.tags.planner_name IS 'Name of the user who planed the tag.';
COMMENT ON COLUMN sqitch.tags.planner_email IS 'Email address of the user who planned the tag.';

INSERT INTO sqitch.projects VALUES ('full-stack-template', 'https://github.com/TaitoUnited/full-stack-template/', '2021-06-16 12:15:16.311151+00', 'taito', 'taito@1a38526aa185');
INSERT INTO sqitch.releases VALUES (1.1, '2021-06-16 12:15:16.30769+00', 'taito', 'taito@1a38526aa185');

ALTER TABLE ONLY sqitch.changes
    ADD CONSTRAINT changes_pkey PRIMARY KEY (change_id);
ALTER TABLE ONLY sqitch.changes
    ADD CONSTRAINT changes_project_script_hash_key UNIQUE (project, script_hash);
ALTER TABLE ONLY sqitch.dependencies
    ADD CONSTRAINT dependencies_pkey PRIMARY KEY (change_id, dependency);
ALTER TABLE ONLY sqitch.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (change_id, committed_at);
ALTER TABLE ONLY sqitch.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (project);
ALTER TABLE ONLY sqitch.projects
    ADD CONSTRAINT projects_uri_key UNIQUE (uri);
ALTER TABLE ONLY sqitch.releases
    ADD CONSTRAINT releases_pkey PRIMARY KEY (version);
ALTER TABLE ONLY sqitch.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (tag_id);
ALTER TABLE ONLY sqitch.tags
    ADD CONSTRAINT tags_project_tag_key UNIQUE (project, tag);
ALTER TABLE ONLY sqitch.changes
    ADD CONSTRAINT changes_project_fkey FOREIGN KEY (project) REFERENCES sqitch.projects(project) ON UPDATE CASCADE;
ALTER TABLE ONLY sqitch.dependencies
    ADD CONSTRAINT dependencies_change_id_fkey FOREIGN KEY (change_id) REFERENCES sqitch.changes(change_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY sqitch.dependencies
    ADD CONSTRAINT dependencies_dependency_id_fkey FOREIGN KEY (dependency_id) REFERENCES sqitch.changes(change_id) ON UPDATE CASCADE;
ALTER TABLE ONLY sqitch.events
    ADD CONSTRAINT events_project_fkey FOREIGN KEY (project) REFERENCES sqitch.projects(project) ON UPDATE CASCADE;
ALTER TABLE ONLY sqitch.tags
    ADD CONSTRAINT tags_change_id_fkey FOREIGN KEY (change_id) REFERENCES sqitch.changes(change_id) ON UPDATE CASCADE;
ALTER TABLE ONLY sqitch.tags
    ADD CONSTRAINT tags_project_fkey FOREIGN KEY (project) REFERENCES sqitch.projects(project) ON UPDATE CASCADE;
