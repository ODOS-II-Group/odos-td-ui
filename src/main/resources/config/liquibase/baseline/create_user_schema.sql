create role :databaseAppRole with 
 LOGIN PASSWORD :databaseAppPassword
 NOSUPERUSER NOINHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;

grant all on database :databaseName to :databaseAdminUser;
grant connect, temporary on database :databaseName to :databaseAppRole;
revoke all on database :databaseName from public;

CREATE SCHEMA :databaseSchema AUTHORIZATION :databaseAdminUser;

GRANT USAGE ON SCHEMA :databaseSchema TO :databaseAppRole;

ALTER DEFAULT PRIVILEGES IN SCHEMA :databaseSchema
 GRANT INSERT, UPDATE, DELETE, SELECT, TRUNCATE, REFERENCES, TRIGGER ON TABLES
 TO :databaseAppRole;
 
ALTER DEFAULT PRIVILEGES IN SCHEMA :databaseSchema
 GRANT SELECT, USAGE ON SEQUENCES
 TO :databaseAppRole;




