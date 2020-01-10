create table owners(
    id serial primary key,
    name text
);

create table pets(
    id serial primary key,
    name text,
    species text,
    owner_id integer references owners (id)
);