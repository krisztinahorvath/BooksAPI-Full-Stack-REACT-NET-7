import random
from faker import Faker
import hashlib

fake = Faker()

bookIds = set()

def hash_password(password):
    password_bytes = password.encode('utf-8')
    sha256 = hashlib.sha256()
    sha256.update(password_bytes)
    password_hash = sha256.hexdigest()

    return password_hash


password = hash_password("test")

usernames = set()
while len(usernames) < 10000:
    usernames.add(fake.user_name())
with open('users.csv', 'w') as f:
    n = 10000
    for i, name in enumerate(usernames):
        f.write(f"{i + 1};{name};{password}\n")
        print(i)
    f.close()

with open('userProfiles.csv', 'w') as f:
    n = 10000
    for i in range(n):
        bio = fake.sentence().replace("'", "''")
        location = fake.address()
        year = random.randint(1900, 2022)
        month = str(random.randint(1, 12)).zfill(2)
        day = str(random.randint(1, 28)).zfill(2)
        birthday = f"{year}-{month}-{day}"
        gender_options = ["female", "male", "other"]
        gender = random.choice(gender_options)
        marital_options = ["married", "single", "rather not say"]
        maritalStatus = random.choice(marital_options)

        f.write(f"{i + 1};{bio};{location};{birthday};{gender};{maritalStatus}\n")
        print(i)

    f.close()

with open(f'bookauthors.csv', 'w') as f:
    n = 10000000
    for i in range(n):
        while True:
            bookId = random.randint(1, 1000000)
            authorId = random.randint(1, 1000000)
            if (bookId, authorId) not in bookIds:
                bookIds.add((bookId, authorId))
                break

        bookRating = round(random.uniform(1, 10), 2)
        authorRating = round(random.uniform(1, 10), 2)

        f.write(f"{bookId}, {authorId}, {bookRating},{authorRating}\n")
        print(i)

    f.close()


with open('authors.csv', 'w') as f:
    n = 1000000
    for i in range(n):
        name = fake.name()
        yearOfBirth = random.randint(1501, 2023)
        address = fake.address()
        email = fake.email()
        phoneNumber = fake.phone_number()
        userId = random.randint(1, 10000)

        f.write(f"{i + 1};{name};{yearOfBirth};{address};{email};{phoneNumber};{userId}\n")
        print(i)

    f.close()

with open('books.csv', 'w') as f:
    n = 1000000
    for i in range(n):
        title = fake.catch_phrase().replace("'", "''")
        description = fake.sentence().replace("'", "''")
        year = random.randint(1501, 2023)
        pages = random.randint(100, 1500)
        price = round(random.uniform(1, 1000), 2)
        genreId = random.randint(1, 1000000)  # (minId, maxId)
        transcript = fake.paragraph() + " " + fake.paragraph()
        userId = random.randint(1, 10000)
        f.write(f"{i + 1},{title}, {description}, {year}, {pages}, {price}, {genreId}, {transcript}, {userId}\n")

        print(i)

    f.close()


with open('genres.csv', 'w') as f:
    n = 1000000
    for i in range(n):
        name = fake.word().replace("'", "''")
        description = fake.sentence().replace("'", "''")
        subgenre = fake.random_element()
        countryOfOrigin = fake.country().replace("'", "''")
        genreRating = random.randint(1, 10)
        userId = random.randint(1, 10000)

        f.write(f"{i+1},{name},{description},{subgenre},{countryOfOrigin},{genreRating},{userId}\n")

        print(i)

    f.close()
