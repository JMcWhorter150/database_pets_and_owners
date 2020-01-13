create table owners(
    id serial primary key,
    name text,
    phone_number varchar(20)
);

create table pets(
    id serial primary key,
    name text,
    species varchar (100),
    birthdate date,
    owner_id integer references owners (id)
);

-- create table pets_owners (
--     -- this table needs no id
--     owner_id integer references owners (id),
--     pet_id integer references pet (id)
-- );