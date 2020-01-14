insert into owners
        (name, phone_number, hash)
    values
        ('chris', '8675309', '$2a$10$FgPLbfn1hFaKg1RzhBeJYODxT7F6kxBtf/3Ioy//FJf3dFhcWCczO'),
        ('Aylor', '5554321', '$2a$10$jJ5nooC1oVf8HLB2K8vRs.XcAKTDtC9IqlN6GTD7Gp4BwXlLNz.W2')
    ;

insert into pets
        (name, species, birthdate, owner_id)
    values
        ('oakley', 'cat', '2010-05-30', 1),
        ('milla', 'tortoise shell', '2005-01-01', 1),
        ('dexter', 'dog', '2003-09-01', 2),
        ('hank', 'dog', '1999-03-14', 2),
        ('seymour', 'cat', '1901-12-25', 2)
    ;