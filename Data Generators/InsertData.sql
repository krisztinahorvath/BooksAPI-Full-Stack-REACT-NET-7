use booksDB


--Users
SET IDENTITY_INSERT Users ON;

BULK INSERT Users
FROM 'C:\Facultate\Semestrul 4\MPP\Labs\users.csv'
WITH
(
    FIELDTERMINATOR = ';',
    ROWTERMINATOR = '\n',
    FIRSTROW = 1,
    BATCHSIZE = 1000,
	KEEPIDENTITY
);

SET IDENTITY_INSERT Users OFF;


--UserProfiles
BULK INSERT UserProfiles
FROM 'C:\Facultate\Semestrul 4\MPP\Labs\userProfiles.csv'
WITH
(
    FIELDTERMINATOR = ';',
    ROWTERMINATOR = '\n',
    FIRSTROW = 1,
    BATCHSIZE = 1000,
	KEEPIDENTITY
);


--Authors
SET IDENTITY_INSERT Authors ON;

BULK INSERT Authors
FROM 'C:\Facultate\Semestrul 4\MPP\Labs\authors.csv'
WITH
(
    FIELDTERMINATOR = ';',
    ROWTERMINATOR = '\n',
    FIRSTROW = 1,
    BATCHSIZE = 1000,
	KEEPIDENTITY
);

SET IDENTITY_INSERT Authors OFF;

-- Genres
SET IDENTITY_INSERT Genres ON;

BULK INSERT Genres
FROM 'C:\Facultate\Semestrul 4\MPP\Labs\genres.csv'
WITH
(
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    FIRSTROW = 1,
    BATCHSIZE = 1000, 
	KEEPIDENTITY
);

SET IDENTITY_INSERT Genres OFF;

-- Books
SET IDENTITY_INSERT Books ON;

BULK INSERT Books
FROM 'C:\Facultate\Semestrul 4\MPP\Labs\books.csv'
WITH
(
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    FIRSTROW = 1,
    BATCHSIZE = 1000, 
	KEEPIDENTITY
);

SET IDENTITY_INSERT Books OFF;

-- BookAuthors
BULK INSERT BookAuthors
FROM 'C:\Facultate\Semestrul 4\MPP\Labs\bookauthors.csv'
WITH
(
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    FIRSTROW = 1,
    BATCHSIZE = 1000, 
	KEEPIDENTITY
);

--select count(*) as NoOfGenres from Genres
--select count(*) as NoOfBooks from Books
--select count(*) as NoOfAuthors from Authors
--select count(*) as NoOfBookAuthors from BookAuthors
--select count(*) as NoOfUsers from Users
--select count(*) as NoOfUserProfiles from UserProfiles

--select * from Genres
--select * from Authors
--select * from Books
--select * from BookAuthors
--select * from Users
--select * from UserProfiles


